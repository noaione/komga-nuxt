<template>
  <VMenu v-model="menuState" location="bottom">
    <template #activator="{ props: dataBind }">
      <VBtn icon v-bind="dataBind" @click.prevent="">
        <VIcon>mdi-dots-vertical</VIcon>
      </VBtn>
    </template>

    <VList>
      <VListItem v-if="user.isAdmin && series && !series.oneshot" @click="scanSeries(false)">
        <VListItemTitle>{{ $t("menu.scan_series_files") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.isAdmin && series && !series.oneshot" @click="scanSeries(true)">
        <VListItemTitle>{{ $t("menu.scan_series_files_deep") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.isAdmin" @click="analyze">
        <VListItemTitle>{{ $t("menu.analyze") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.isAdmin" @click="refreshMetadata">
        <VListItemTitle>{{ $t("menu.refresh_metadata") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.isAdmin && (series || oneshotMode)" @click="addToCollection">
        <VListItemTitle>{{ $t("menu.add_to_collection") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.isAdmin && book" @click="addToReadList">
        <VListItemTitle>{{ $t("menu.add_to_readlist") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="!isRead" @click="markRead">
        <VListItemTitle>{{ $t("menu.mark_read") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="isRead" @click="markUnread">
        <VListItemTitle>{{ $t("menu.mark_unread") }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.canDownload && downloadFileUrl" :href="downloadFileUrl">
        <VListItemTitle>{{ downloadFileName }}</VListItemTitle>
      </VListItem>
      <VListItem v-if="user.isAdmin" class="list-danger">
        <VListItemTitle>{{ $t("menu.delete") }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import type { KomgaComponents } from "#imports";

const props = defineProps<{
  book?: KomgaComponents["schemas"]["BookDto"];
  series?: KomgaComponents["schemas"]["SeriesDto"];
  oneshotMode?: boolean;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { t } = useI18n();
const reusables = useReusableContents();
const user = useKomgaUser();
const menuState = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const isRead = computed(() => {
  if (props.book) {
    return props.book.readProgress !== undefined;
  } else if (props.series) {
    return props.series.booksReadCount === props.series.booksCount;
  }
});
const downloadFileUrl = computed(() => {
  if (props.book) {
    return bookFileURL(props.book.id);
  } else if (props.series) {
    return seriesFileURL(props.series.id);
  }

  return;
});
const downloadFileName = computed(() => {
  if (props.book) {
    return t("browse_book.download_file");
  } else if (props.series) {
    return t("menu.download_series");
  }

  return t("common.download");
});

function emitError(error: unknown) {
  console.error(error);

  reusables.queueSnackbar({
    text: t("common.error_console"),
    timeout: 3000,
  });
}

function analyze() {
  if (props.book) {
    useKomgaFetch("/api/v1/books/{bookId}/analyze", {
      path: {
        bookId: props.book.id,
      },
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
      method: "post",
    }).catch((error) => {
      emitError(error);
    });
  } else if (props.series) {
    useKomgaFetch("/api/v1/series/{seriesId}/analyze", {
      path: {
        seriesId: props.series.id,
      },
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
      method: "post",
    }).catch((error) => {
      emitError(error);
    });
  }
}

function scanSeries(deepScan: boolean) {
  if (props.series) {
    useKomgaFetch("/api/v1/series/{seriesId}/scan", {
      path: {
        seriesId: props.series.id,
      },
      query: {
        scanDeep: deepScan,
      },
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
      method: "post",
    }).catch((error) => {
      if (error instanceof FetchError) {
        if (error.response?.status === 404) {
          return;
        }

        emitError(error);
      }
    });
  }
}

function refreshMetadata() {
  if (props.book) {
    useKomgaFetch("/api/v1/books/{bookId}/metadata/refresh", {
      path: {
        bookId: props.book.id,
      },
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
      method: "post",
    }).catch((error) => {
      emitError(error);
    });
  } else if (props.series) {
    useKomgaFetch("/api/v1/series/{seriesId}/metadata/refresh", {
      path: {
        seriesId: props.series.id,
      },
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
      method: "post",
    }).catch((error) => {
      emitError(error);
    });
  }
}

function addToCollection() {
  const seriesId = props.series?.id ?? props.book?.seriesId;

  if (!seriesId) {
    return;
  }

  // Dispatch to reusable
}

function addToReadList() {
  if (!props.book) {
    return;
  }

  // Dispatch to reusable
}

function markRead() {
  if (props.series) {
    useKomgaFetch("/api/v1/series/{seriesId}/read-progress", {
      path: {
        seriesId: props.series.id,
      },
      method: "POST",
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
    }).catch((error) => {
      emitError(error);
    });
  } else if (props.book) {
    useKomgaFetch("/api/v1/books/{bookId}/read-progress", {
      path: {
        bookId: props.book.id,
      },
      method: "patch",
      body: {
        completed: true,
      },
    }).catch((error) => {
      emitError(error);
    });
  }
}

function markUnread() {
  if (props.series) {
    useKomgaFetch("/api/v1/series/{seriesId}/read-progress", {
      path: {
        seriesId: props.series.id,
      },
      method: "delete",
      baseURL: useKomgaServerUrl().origin,
      credentials: "include",
    }).catch((error) => {
      emitError(error);
    });
  } else if (props.book) {
    useKomgaFetch("/api/v1/books/{bookId}/read-progress", {
      path: {
        bookId: props.book.id,
      },
      method: "delete",
    }).catch((error) => {
      emitError(error);
    });
  }
}
</script>
