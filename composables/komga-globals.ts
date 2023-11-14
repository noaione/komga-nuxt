import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

interface KomgaNavbarData {
  booksToCheck: number;
  announcements: KomgaComponents["schemas"]["ItemDto"][];
  toolbarCount?: number;
}

export const useKomgaGlobals = defineStore("komga.navbar", {
  state: (): KomgaNavbarData => ({
    booksToCheck: 0,
    announcements: [],
    toolbarCount: undefined,
  }),
  getters: {
    announcementCount(state) {
      return state.announcements.length;
    },
    showTbCount(state) {
      return state.toolbarCount !== undefined;
    },
  },
  actions: {
    setAnnuncements(announcements: KomgaNavbarData["announcements"]) {
      this.announcements = announcements;
    },
  },
});
