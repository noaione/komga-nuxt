<template>
  <div class="d-flex align-center my-1">
    <VImg :src="seriesThumbnailURL(data.id)" height="50" max-width="35" class="mx-3">
      <span
        v-if="data.booksUnreadCount !== 0"
        class="white--text pa-0 px-1 text-caption"
        :style="{ background: 'orange', position: 'absolute', right: 0 }"
      >
        {{ data.booksUnreadCount }}
      </span>
    </VImg>
    <VListItem>
      <VListItemTitle>{{ data.metadata.title }}</VListItemTitle>
      <VListItemSubtitle>
        {{ $t("searchbox.in_library", { library: data.libraryId }) }}
      </VListItemSubtitle>
      <VListItemSubtitle v-if="data.booksMetadata.releaseDate">
        {{ formatDateToYear(data.booksMetadata.releaseDate) }}
      </VListItemSubtitle>
    </VListItem>
  </div>
</template>

<script setup lang="ts">
import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

defineProps<{
  data: KomgaComponents["schemas"]["SeriesDto"];
}>();

const { locale } = useI18n();

function formatDateToYear(date: string) {
  const formatter = new Intl.DateTimeFormat(locale.value.replace("_", "-"), { year: "numeric", timeZone: "UTC" });

  console.log(date, new Date(date));

  return formatter.format(new Date(date));
}
</script>
