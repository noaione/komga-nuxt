type FilterValues = { [key: string]: string[] };

type ThingFilters = {
  [id: string]: FilterValues;
};

interface KomgaConfigN3 {
  webreader: {
    paged: {
      layout: "single" | "double" | "double-no-cover";
      scale: "screen" | "fit-width" | "fit-width-shrink" | "fit-height" | "original";
    };
    continous: {
      scale: "original" | "fit-width";
      padding: number;
    };
    readingDirection: "series-default" | "ltr" | "rtl" | "vertical" | "webtoon";
    swipe: boolean;
    alwaysFullscreen: boolean;
    animations: boolean;
    background: "black" | "white" | "gray";
  };
  pageSize: {
    series: number;
    libraries: number;
  };
  collection: {
    filter: ThingFilters;
  };
  readList: {
    filter: ThingFilters;
  };
  library: {
    filter: ThingFilters;
    sort: {
      [libraryId: string]: {
        key: string;
        order: "asc" | "desc";
      };
    };
    routeMode: {
      [libraryId: string]: "recommended" | "series" | "collections" | "readlists";
    };
  };
  importPath?: string;
  rememberMe: boolean;
  duplicateNewPageSize: number;
  locale: string;
}

export const useKomgaConfig = defineStore("komga.config", {
  state: (): KomgaConfigN3 => ({
    webreader: {
      paged: {
        layout: "single",
        scale: "screen",
      },
      continous: {
        padding: 0,
        scale: "fit-width",
      },
      readingDirection: "series-default",
      swipe: false,
      alwaysFullscreen: false,
      animations: true,
      background: "black",
    },
    pageSize: {
      series: 20,
      libraries: 20,
    },
    collection: {
      filter: {},
    },
    readList: {
      filter: {},
    },
    library: {
      filter: {},
      sort: {},
      routeMode: {},
    },
    importPath: undefined,
    rememberMe: false,
    duplicateNewPageSize: 10,
    locale: "en",
  }),
  getters: {
    isContinous(state) {
      return state.webreader.readingDirection === "vertical" || state.webreader.readingDirection === "webtoon";
    },
    isDoublePage(state) {
      return state.webreader.paged.layout === "double" || state.webreader.paged.layout === "double-no-cover";
    },
    getLibrarySort: (state) => (libraryId: string) => {
      return state.library.sort[libraryId] || undefined;
    },
    getLibraryRouteMode: (state) => (libraryId: string) => {
      return state.library.routeMode[libraryId] || libraryId === "all" ? "browse" : "recommended";
    },
    getLibraryFilter: (state) => (libraryId: string) => {
      return state.library.filter[libraryId] || undefined;
    },
    getCollectionFilter: (state) => (collectionId: string) => {
      return state.collection.filter[collectionId] || undefined;
    },
    getReadListFilter: (state) => (readListId: string) => {
      return state.readList.filter[readListId] || undefined;
    },
  },
  persist: {
    key: "komgaN3.config",
    storage: persistedState.localStorage,
  },
});
