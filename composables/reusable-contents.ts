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

export interface KomgaReusableConfirmDialog {
  title: string;
  body?: string;
  asHtml?: boolean;
  confirmText?: string;
  buttonCancel?: string;
  buttonConfirm?: string;
  buttonConfirmColor?: string;
  buttonAlternate?: string;
  onConfirm: () => void;
}

interface KomgaReusable {
  snackbars: KomgaReusableSnackbar[];
  tasksData?: KSSETaskQueue;
  confirmDialog?: KomgaReusableConfirmDialog;
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
    openConfirmDialog(data: KomgaReusableConfirmDialog) {
      const mergedData: KomgaReusableConfirmDialog = {
        buttonConfirmColor: "primary",
        ...data,
      };

      this.confirmDialog = mergedData;
    },
  },
});
