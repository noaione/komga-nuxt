import type { KomgaComponents } from "#imports";
import { getActivePinia } from "pinia";

interface KomgaLibrariesState {
  libraries: { [key: string]: KomgaComponents["schemas"]["LibraryDto"] };
}

interface KomgaLibraryState {
  library?: KomgaComponents["schemas"]["LibraryDto"];
  series: KomgaComponents["schemas"]["SeriesDto"][];
  page: number;
  totalSeries: number;
}

export const useKomgaLibrary = (libraryId: string) => {
  return defineStore(`komga.library.${libraryId}`, {
    state: (): KomgaLibraryState => ({
      library: undefined,
      series: [],
      page: 0,
      totalSeries: 0,
    }),
    actions: {
      setLibrary(library: KomgaComponents["schemas"]["LibraryDto"]) {
        this.library = library;
      },
      setSeries(series: KomgaComponents["schemas"]["SeriesDto"][]) {
        this.series = series;
      },
      async fetchSeries(page: number) {
        this.page = page;

        const config = useKomgaConfig();

        const { data } = await useKomgaFetch("/api/v1/series", {
          method: "GET",
          params: {
            library_id: this.library?.id,
            page: this.page,
            size: config.pageSize.libraries,
          },
          credentials: "include",
          baseURL: useKomgaServerUrl().origin,
        });

        if (data.value) {
          this.totalSeries = data.value.totalElements ?? 0;
          this.series = data.value.content ?? [];
        }
      },
    },
  })();
};

export const useKomgaLibraries = defineStore("komga.libraries", {
  state: (): KomgaLibrariesState => ({
    libraries: {},
  }),
  getters: {
    getLibraryById: (state) => (libraryId: string) => {
      return state.libraries[libraryId];
    },
    librariesList(state) {
      return Object.values(state.libraries);
    },
  },
  actions: {
    async fetchLibraries() {
      const { data } = await useKomgaFetch("/api/v1/libraries", {
        method: "GET",
        credentials: "include",
        params: {
          unpaged: true,
        },
        baseURL: useKomgaServerUrl().origin,
      });

      if (data.value) {
        for (const item of data.value) {
          this.setLibrary(item);
        }
      }
    },
    async dispatchUpdate(libraryId: string) {
      const { data } = await useKomgaFetch("/api/v1/libraries/{libraryId}", {
        method: "GET",
        path: {
          libraryId,
        },
        credentials: "include",
        baseURL: useKomgaServerUrl().origin,
      });

      if (data.value) {
        this.libraries[data.value.id] = data.value;

        const libraryStore = useKomgaLibrary(data.value.id);

        libraryStore.library = data.value;
      }
    },
    async dispatchDelete(libraryId: string) {
      const { error } = await useKomgaFetch("/api/v1/libraries/{libraryId}", {
        method: "DELETE",
        path: {
          libraryId,
        },
        credentials: "include",
        baseURL: useKomgaServerUrl().origin,
      });

      if (error.value?.statusCode !== 204) {
        throw new Error("Failed to delete library");
      }

      try {
        delete this.libraries[libraryId];
      } catch {}

      const libraryStore = useKomgaLibrary(libraryId);

      libraryStore.$dispose();

      try {
        delete getActivePinia()?.state.value[libraryStore.$id];
      } catch {}
    },
    setLibrary(library: KomgaComponents["schemas"]["LibraryDto"]) {
      this.libraries[library.id] = library;

      const libraryStore = useKomgaLibrary(library.id);

      libraryStore.library = library;
    },
    deleteLibrary(libraryId: string) {
      delete this.libraries[libraryId];

      const libraryStore = useKomgaLibrary(libraryId);

      libraryStore.$dispose();

      try {
        delete getActivePinia()?.state.value[libraryStore.$id];
      } catch {}
    },
    reset() {
      this.libraries = {};
    },
  },
});
