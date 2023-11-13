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

  constructor(url: string) {
    this.url = url;
    this.reconnectAttempt = 1;
    this.baseDelay = 1000;
    this.attemptReset = 8;

    this.eventTarget = new EventTarget();

    this._connected = false;
  }

  connect() {
    if (this._connected) {
      return;
    }

    console.info("Connecting to SSE");
    this.abortSignal = new AbortController();

    fetchEventSource(this.url, {
      method: "GET",
      credentials: "include",
      signal: this.abortSignal.signal,
      onopen: async (response) => {
        if (response.ok && response.headers.get("content-type") === EventStreamContentType) {
          console.info("SSE connected established");

          this.reconnectAttempt = 1;
          this._connected = true;
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // client-side errors are usually non-retriable:
          throw new FatalError();
        } else {
          throw new RetriableError();
        }
      },
      onmessage: (event) => {
        console.trace("SSE event received", event);

        // Custom event
        const customEvent = new CustomEvent(event.event, {
          detail: JSON.parse(event.data),
        });

        console.trace("Dispatching event", customEvent);
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
        if (error instanceof RetriableError) {
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
        } else {
          throw error;
        }
      },
      onclose: () => {
        console.info("SSE closed");

        this.reconnectAttempt = 1;
        this._connected = false;

        const delayBy = this.baseDelay * 2 ** this.reconnectAttempt;

        // Try to reconnect
        setTimeout(() => {
          this.connect();
        }, delayBy);
      },
    });
  }

  disconnect() {
    this.abortSignal?.abort();
    this._connected = false;
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
  const auth = useKomgaUser();

  const es = new KomgaSSEPlugin(`${origin}/sse/v1/events`);

  watch(
    () => auth.authenticated,
    (a) => {
      if (a) {
        es.connect();
      } else {
        es.disconnect();
      }
    }
  );

  return {
    provide: {
      komgaSSE: es,
    },
  };
});
