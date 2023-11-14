<template>
  <div class="d-flex align-center my-1">
    <VImg :src="thumbnailUrl(data.id)" height="50" max-width="35" class="mx-3" />
    <VListItem>
      <VListItemTitle>{{ data.name }}</VListItemTitle>
    </VListItem>
  </div>
</template>

<script setup lang="ts">
import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

const props = defineProps<{
  data: KomgaComponents["schemas"]["ReadListDto"] | KomgaComponents["schemas"]["CollectionDto"];
  type: "readlist" | "collection";
}>();

function thumbnailUrl(id: string) {
  return props.type === "collection" ? collectionThumbnailURL(id) : readListThumbnailURL(id);
}
</script>
