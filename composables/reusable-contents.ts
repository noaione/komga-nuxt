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

interface KomgaReusable {
  snackbars: KomgaReusableSnackbar[];
}

export const useReusableContents = defineStore("komga.reusableDialogs", {
  state: (): KomgaReusable => ({
    snackbars: [],
  }),
  actions: {
    queueSnackbar(data: KomgaReusableSnackbar) {
      console.log("queueSnackbar", data);

      this.snackbars.push(data);
    },
    getSnackbar() {
      return this.snackbars.shift();
    },
  },
});
