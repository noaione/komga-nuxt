<template>
  <VMenu v-if="auth.isAdmin" location="bottom" :offset="[0, 0]">
    <template #activator="{ props: dataBind }">
      <VBtn icon v-bind="dataBind" @click.prevent="">
        <VIcon>mdi-dots-vertical</VIcon>
      </VBtn>
    </template>

    <VList>
      <VListItem @click="scanLibrary(false)">
        <VListItemTitle>{{ $t("menu.scan_library_files") }}</VListItemTitle>
      </VListItem>
      <VListItem class="list-warning" @click="scanLibrary(true)">
        <VListItemTitle>{{ $t("menu.scan_library_files_deep") }}</VListItemTitle>
      </VListItem>
      <VListItem @click="promptAnalyze">
        <VListItemTitle>{{ $t("menu.analyze") }}</VListItemTitle>
      </VListItem>
      <VListItem @click="promptRefreshMetadata">
        <VListItemTitle>{{ $t("menu.refresh_metadata") }}</VListItemTitle>
      </VListItem>
      <VListItem @click="promptConfirmEmptyTrash">
        <VListItemTitle>{{ $t("menu.empty_trash") }}</VListItemTitle>
      </VListItem>
      <VListItem>
        <VListItemTitle>{{ $t("menu.edit") }}</VListItemTitle>
      </VListItem>
      <VListItem class="list-danger">
        <VListItemTitle>{{ $t("menu.delete") }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script setup lang="ts">
import type { KomgaComponents } from "#imports";

const props = defineProps<{
  library: KomgaComponents["schemas"]["LibraryDto"];
}>();

const { t } = useI18n();

const reusables = useReusableContents();
const auth = useKomgaUser();

async function scanLibrary(deepScan: boolean) {
  await useKomgaFetch("/api/v1/libraries/{libraryId}/scan", {
    method: "post",
    path: {
      libraryId: props.library.id,
    },
    params: {
      deep: deepScan,
    },
    credentials: "include",
    baseURL: useKomgaServerUrl().origin,
  });
}

function promptAnalyze() {
  reusables.openConfirmDialog({
    title: t("dialog.analyze_library.title"),
    body: t("dialog.analyze_library.body"),
    buttonConfirm: t("dialog.analyze_library.button_confirm"),
    onConfirm() {
      useKomgaFetch("/api/v1/libraries/{libraryId}/analyze", {
        method: "post",
        path: {
          libraryId: props.library.id,
        },
        credentials: "include",
        baseURL: useKomgaServerUrl().origin,
      }).catch((_error) => {
        console.error(_error);

        reusables.queueSnackbar({
          text: t("common.error_console"),
          timeout: 3000,
        });
      });
    },
  });
}

function promptRefreshMetadata() {
  reusables.openConfirmDialog({
    title: t("dialog.refresh_library_metadata.title"),
    body: t("dialog.refresh_library_metadata.body"),
    buttonConfirm: t("dialog.refresh_library_metadata.button_confirm"),
    onConfirm() {
      useKomgaFetch("/api/v1/libraries/{libraryId}/metadata/refresh", {
        method: "post",
        path: {
          libraryId: props.library.id,
        },
        credentials: "include",
        baseURL: useKomgaServerUrl().origin,
      }).catch((_error) => {
        console.error(_error);

        reusables.queueSnackbar({
          text: t("common.error_console"),
          timeout: 3000,
        });
      });
    },
  });
}

function promptConfirmEmptyTrash() {
  reusables.openConfirmDialog({
    title: t("dialog.empty_trash.title"),
    body: t("dialog.empty_trash.body"),
    buttonConfirm: t("dialog.empty_trash.button_confirm"),
    onConfirm() {
      useKomgaFetch("/api/v1/libraries/{libraryId}/empty-trash", {
        method: "post",
        path: {
          libraryId: props.library.id,
        },
        credentials: "include",
        baseURL: useKomgaServerUrl().origin,
      }).catch((_error) => {
        console.error(_error);

        reusables.queueSnackbar({
          text: t("common.error_console"),
          timeout: 3000,
        });
      });
    },
  });
}
</script>
