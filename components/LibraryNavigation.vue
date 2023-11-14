<template>
  <div>
    <VBottomNavigation v-if="show && bottomNavigation" grow color="primary" active order="10" :absolute="false">
      <VBtn v-if="showRecommend" :to="`/libraries/${props.libraryId}/recommended`">
        <span>{{ $t("library_navigation.recommended") }}</span>
        <VIcon>mdi-star</VIcon>
      </VBtn>
      <VBtn :to="`/libraries/${props.libraryId}/series`">
        <span>{{ $t("library_navigation.browse") }}</span>
        <VIcon>mdi-bookshelf</VIcon>
      </VBtn>
      <VBtn v-if="collectionCount > 0" :to="`/libraries/${props.libraryId}/collections`">
        <span>{{ $t("library_navigation.collections") }}</span>
        <VIcon>mdi-layers-triple</VIcon>
      </VBtn>
      <VBtn v-if="collectionCount > 0" :to="`/libraries/${props.libraryId}/readlists`">
        <span>{{ $t("library_navigation.readlists") }}</span>
        <VIcon>mdi-book-multiple</VIcon>
      </VBtn>
    </VBottomNavigation>

    <template v-if="show && !bottomNavigation">
      <VBtn v-if="showRecommend" variant="text" class="mx-1" :to="`/libraries/${props.libraryId}/recommended`">
        {{ $t("library_navigation.recommended") }}
      </VBtn>
      <VBtn variant="text" class="mx-1" :to="`/libraries/${props.libraryId}/series`">
        {{ $t("library_navigation.browse") }}
      </VBtn>
      <VBtn v-if="collectionCount > 0" variant="text" class="mx-1" :to="`/libraries/${props.libraryId}/collections`">
        {{ $t("library_navigation.collections") }}
      </VBtn>
      <VBtn v-if="collectionCount > 0" variant="text" class="mx-1" :to="`/libraries/${props.libraryId}/readlists`">
        {{ $t("library_navigation.readlists") }}
      </VBtn>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  libraryId: string;
  bottomNavigation?: boolean;
}>();

const collectionCount = ref(0);
const readListCount = ref(0);

const showRecommend = computed(() => {
  return props.libraryId !== "all";
});

const show = computed(() => {
  return collectionCount.value > 0 || readListCount.value > 0 || showRecommend.value;
});

async function loadCollectionCount(libraryId: string) {
  const { data } = await useKomgaFetch("/api/v1/collections", {
    params: {
      library_id: libraryId === "all" ? undefined : libraryId,
      size: 0,
    },
  });

  if (data.value) {
    collectionCount.value = data.value.totalElements ?? 0;
  }
}

async function loadReadListCount(libraryId: string) {
  const { data } = await useKomgaFetch("/api/v1/readlists", {
    params: {
      library_id: libraryId === "all" ? undefined : libraryId,
      size: 0,
    },
  });

  if (data.value) {
    collectionCount.value = data.value.totalElements ?? 0;
  }
}

watch(
  () => props.libraryId,
  async (libraryId) => {
    await loadCollectionCount(libraryId);
    await loadReadListCount(libraryId);
  },
  { immediate: true }
);
</script>
