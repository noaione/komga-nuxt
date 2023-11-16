<template>
  <NavigationAlpabeticalSeries
    class="text-center"
    :symbols="alphaNavSymbols"
    :selected="activeAlphaNav"
    :group-count="alphaNavGroupings"
  />

  <EmptyState
    v-if="totalPages === 0"
    :title="$t('common.nothing_to_show')"
    icon="mdi-help-circle"
    icon-color="secondary"
  />

  <template v-if="totalPages > 0">
    <VPagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :total-visible="visiblePage"
      :length="totalPages"
    />

    <!-- TODO: Item browser here -->

    <VPagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :total-visible="visiblePage"
      :length="totalPages"
    />
  </template>
</template>

<script setup lang="ts">
import type { KomgaComponents } from "#imports";

const { $vuetify } = useNuxtApp();
const globals = useKomgaGlobals();
const config = useKomgaConfig();
const route = useRoute();
const router = useRouter();

const currentPage = ref(1);

const series = computed(() => {
  const library = useKomgaLibrary(route.params.id.toString());

  return library.series;
});
const totalPages = computed(() => {
  const library = useKomgaLibrary(route.params.id.toString());

  const totalCounts = library.totalSeries;
  const perPage = config.pageSize.libraries;

  return Math.ceil(totalCounts / perPage);
});
const visiblePage = computed(() => {
  switch ($vuetify.display.name.value) {
    case "xs": {
      return 5;
    }
    case "sm": {
      return 10;
    }
    case "md": {
      return 10;
    }
    default: {
      return 15;
    }
  }
});

const alphaNavGroupings = ref<KomgaComponents["schemas"]["GroupCountDto"][]>();
const activeAlphaNav = ref<string>();
const alphaNavSymbols = [
  "ALL",
  "#",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

async function dispatchAndProcess(libraryId: string) {
  if (libraryId === "all") {
    // forward to all libraries
    router.push("/libraries/all");

    return;
  }

  const library = useKomgaLibrary(libraryId);

  if (!library.library) {
    await library.fetchLibrary();
  }

  await library.fetchSeries(0);

  globals.toolbarCount = library.totalSeries;
}

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.includes("/libraries") && newPath.includes("/series")) {
      const libraryId = String(route.params.id);

      config.library.routeMode[libraryId] = "series";

      dispatchAndProcess(libraryId);
    }
  },
  {
    immediate: true,
  }
);
</script>
