export interface KomgaReusableSnackbar {
  text: string;
  details?: string;
  color?: string;
  timeout: number;
  vertical?: boolean;
  goto?: {
    text: string;
    click: () => void;
  };
}

export interface KomgaTaskQueue {
  count: number;
  countByType: Record<string, number>;
}

interface KomgaReusable {
  snackbars: KomgaReusableSnackbar[];
  tasksData?: KomgaTaskQueue;
}

export const useReusableContents = defineStore("komga.reusableDialogs", {
  state: (): KomgaReusable => ({
    snackbars: [],
  }),
  actions: {
    queueSnackbar(data: KomgaReusableSnackbar) {
      this.snackbars.push(data);
    },
    getSnackbar() {
      return this.snackbars.shift();
    },
  },
});
