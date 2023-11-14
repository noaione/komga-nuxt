import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

interface KomgaNavbarData {
  booksToCheck: number;
  announcements: KomgaComponents["schemas"]["ItemDto"][];
}

export const useKomgaGlobals = defineStore("komga.navbar", {
  state: (): KomgaNavbarData => ({
    booksToCheck: 0,
    announcements: [],
  }),
  getters: {
    announcementCount(state) {
      return state.announcements.length;
    },
  },
  actions: {
    setAnnuncements(announcements: KomgaNavbarData["announcements"]) {
      this.announcements = announcements;
    },
  },
});
