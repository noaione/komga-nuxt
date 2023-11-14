<template>
  <div class="d-flex align-center my-1">
    <VImg :src="bookThumbnailURL(data.id)" height="50" max-width="35" class="mx-3">
      <div v-if="!data.readProgress" class="unread-tick" />
    </VImg>
    <VListItem>
      <VListItemTitle>{{ data.metadata.title }}</VListItemTitle>
      <VListItemSubtitle v-if="!data.oneshot">{{ data.seriesTitle }} - {{ data.metadata.number }}</VListItemSubtitle>
      <VListItemSubtitle>
        {{ $t("searchbox.in_library", { library: data.libraryId }) }}
      </VListItemSubtitle>
    </VListItem>
  </div>
</template>

<script setup lang="ts">
import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

defineProps<{
  data: KomgaComponents["schemas"]["BookDto"];
}>();

console.log("mount book");
</script>
