import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source";

class RetriableError extends Error {}

class FatalError extends Error {}

interface SSEListener<T> {
  (event: CustomEvent<T>): void;
}

class KomgaSSEPlugin {
  private abortSignal: AbortController | undefined;
  private reconnectAttempt: number;
  private baseDelay: number;
  private attemptReset: number;
  private url: string;
  private eventTarget: EventTarget;
  private _connected: boolean;
  private _connecting: boolean;

  constructor(url: string) {
    this.url = url;
    this.reconnectAttempt = 1;
    this.baseDelay = 1000;
    this.attemptReset = 8;

    this.eventTarget = new EventTarget();

    this._connected = false;
    this._connecting = false;
  }

  connect() {
    if (this._connected || this._connecting) {
      return;
    }

    console.info("Connecting to SSE");
    this._connecting = true;
    this.abortSignal = new AbortController();

    this.abortSignal.signal.addEventListener("abort", () => {
      console.info("SSE aborted");
    });

    fetchEventSource(this.url, {
      method: "GET",
      credentials: "include",
      signal: this.abortSignal.signal,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      onopen: async (response) => {
        this._connecting = false;

        if (response.ok && response.headers.get("content-type") === EventStreamContentType) {
          console.info("SSE connected established");

          this.reconnectAttempt = 1;
          this._connected = true;
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // Check if the error is non-authorized (401/403)
          if (response.status === 401 || response.status === 403) {
            // Emit KomgaSSEUnauthorized event
            const event = new CustomEvent("KomgaSSEUnauthorized");

            this.eventTarget.dispatchEvent(event);
          }

          this._connected = false;

          // client-side errors are usually non-retriable:
          throw new FatalError();
        } else {
          throw new RetriableError();
        }
      },
      onmessage: (event) => {
        // Custom event
        const customEvent = new CustomEvent(event.event, {
          detail: JSON.parse(event.data),
        });

        this.eventTarget.dispatchEvent(customEvent);

        // Also dispatch to global event target
        const globalEvent = new CustomEvent("KomgaSSEReceived", {
          detail: {
            event: event.event,
            data: JSON.parse(event.data),
          },
        });

        this.eventTarget.dispatchEvent(globalEvent);
      },
      onerror: (error) => {
        this._connecting = false;

        if (error instanceof RetriableError) {
          this.#retryConnection();
        } else {
          this.abortSignal = undefined;
          throw error;
        }
      },
      onclose: () => {
        console.info("SSE closed");

        this.reconnectAttempt = 1;
        this.abortSignal = undefined;
        this.#retryConnection();
      },
    });
  }

  disconnect() {
    this.abortSignal?.abort();
    this._connected = false;
  }

  #retryConnection() {
    if (this.reconnectAttempt > this.attemptReset) {
      this.reconnectAttempt = 1;
    }

    this._connected = false;

    const delayBy = this.baseDelay * 2 ** this.reconnectAttempt;

    console.info(`Reconnecting SSE in ${delayBy}ms`);

    setTimeout(() => {
      this.reconnectAttempt++;
      this.connect();
    }, delayBy);
  }

  on<T>(event: string, listener: SSEListener<T>) {
    this.eventTarget.addEventListener(event, listener as EventListener);
  }

  off<T>(event: string, listener: SSEListener<T>) {
    this.eventTarget.removeEventListener(event, listener as EventListener);
  }
}

export default defineNuxtPlugin(() => {
  const { origin } = useKomgaServerUrl();

  const es = new KomgaSSEPlugin(`${origin}/sse/v1/events`);

  return {
    provide: {
      komgaSSE: es,
    },
  };
});
