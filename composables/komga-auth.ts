// import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";
import type { FetchResponse } from "ofetch";

export const useKomgaAuth = defineStore(
  "komga.auth",
  () => {
    const { origin } = useKomgaServerUrl();

    // State
    const tokenSession = ref<string>();
    const tokenRememberMe = ref<string>();
    const user = ref();

    // Getters
    const authenticated = computed(() => user.value !== undefined);
    const cookies = computed(() => {
      if (tokenSession.value === undefined) return;

      const tempCookies = [`SESSION=${tokenSession.value}`];

      if (tokenRememberMe.value !== undefined) {
        tempCookies.push(`remember-me=${tokenRememberMe.value}`);
      }

      return tempCookies.join("; ");
    });
    const isAdmin = computed(() => user.value?.roles.includes("ADMIN"));
    const canDownload = computed(() => user.value?.roles.includes("FILE_DOWNLOAD"));
    const canRead = computed(() => user.value?.roles.includes("PAGE_STREAMING"));

    function interceptResponse(response: FetchResponse<any>) {
      const cookies = response.headers.getSetCookie();

      for (const cookie of cookies) {
        if (cookie.startsWith("SESSION=")) {
          tokenSession.value = cookie.slice(8, cookie.indexOf(";"));
        } else if (cookie.startsWith("remember-me=")) {
          tokenRememberMe.value = cookie.slice(12, cookie.indexOf(";"));
        }
      }
    }

    // Methods
    async function login(username: string, password: string, rememberMe: boolean) {
      const { data } = await useKomgaFetch("/api/v2/users/me", {
        query: {
          "remember-me": rememberMe ? "true" : "false",
        },
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        baseURL: origin,
        onResponse: ({ response }) => {
          interceptResponse(response);
        },
      });

      if (data.value) {
        user.value = data.value;
      }
    }

    async function oauthLogin(xAuthToken: string) {
      await useKomgaFetch("/api/v1/login/set-cookie", {
        headers: {
          "X-Auth-Token": xAuthToken,
        },
        baseURL: origin,
        onResponse: ({ response }) => {
          interceptResponse(response);
        },
      });
    }

    async function getSetUser() {
      const cookieData = cookies.value;

      if (cookieData === undefined) {
        throw new Error("No session cookie");
      }

      const { data } = await useKomgaFetch("/api/v2/users/me", {
        headers: {
          Cookie: cookieData,
        },
        baseURL: origin,
        onResponse: ({ response }) => {
          interceptResponse(response);
        },
      });

      if (data.value) {
        user.value = data.value;
      }
    }

    function logout() {
      tokenSession.value = undefined;
      tokenRememberMe.value = undefined;
      user.value = undefined;
    }

    return {
      tokenSession,
      tokenRememberMe,
      user,
      authenticated,
      cookies,
      isAdmin,
      canDownload,
      canRead,
      interceptResponse,
      login,
      oauthLogin,
      getSetUser,
      logout,
    };
  },
  {
    persist: {
      key: "komgaN3.auth",
      storage: persistedState.localStorage,
    },
  }
);
