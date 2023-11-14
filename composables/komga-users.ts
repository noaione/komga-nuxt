import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

export const useKomgaUser = defineStore(
  "komga.auth",
  () => {
    const { origin } = useKomgaServerUrl();

    // State
    const user = ref<KomgaComponents["schemas"]["UserDto"]>();

    // Getters
    const authenticated = computed(() => user.value !== undefined);
    const isAdmin = computed(() => user.value?.roles.includes("ADMIN"));
    const canDownload = computed(() => user.value?.roles.includes("FILE_DOWNLOAD"));
    const canRead = computed(() => user.value?.roles.includes("PAGE_STREAMING"));

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
        credentials: "include",
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
        credentials: "include",
      });
    }

    async function getSetUser() {
      const { data, error } = await useKomgaFetch("/api/v2/users/me", {
        baseURL: origin,
        credentials: "include",
      });

      if (data.value) {
        user.value = data.value;
      }

      if (error) {
        throw error;
      }
    }

    function logout() {
      user.value = undefined;
    }

    return {
      user,
      authenticated,
      isAdmin,
      canDownload,
      canRead,
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
