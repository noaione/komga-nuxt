<template>
  <div :style="$vuetify.display.xs ? { marginBottom: '56px' } : undefined">
    <ToolbarSticky>
      <MenusLibraryAction v-if="library.library" :library="library.library" />

      <VToolbarTitle>
        <span>{{ library.library?.name ?? $t("common.all_libraries") }}</span>
        <VChip v-if="upstream.toolbarCount" label class="mx-4">
          <span :style="{ fontSize: '1.1rem' }">{{ upstream.toolbarCount }}</span>
        </VChip>
      </VToolbarTitle>

      <LibraryNavigation v-if="$vuetify.display.mdAndUp" :library-id="library.libraryId" />
      <VSpacer />

      <MenusPageSize
        v-if="!$route.path.endsWith('/recommended') || libraryId === 'all'"
        v-model="config.pageSize.libraries"
      />
    </ToolbarSticky>

    <LibraryNavigation v-if="$vuetify.display.smAndDown" :library-id="library.libraryId" bottom-navigation />

    <NuxtPage v-if="library.libraryId !== 'all'" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const config = useKomgaConfig();
const upstream = useKomgaGlobals();
const libraryId = String(route.params.id);

const library = useKomgaLibrary(libraryId);

async function processRoute(routeId: string) {
  upstream.toolbarCount = undefined;

  if (routeId === "all") {
    await library.fetchSeries(0);

    upstream.toolbarCount = library.totalSeries;
  } else {
    const currentRoute = config.library.routeMode[routeId] ?? "recommended";

    router.push(`/libraries/${routeId}/${currentRoute}`);
  }
}

watch(
  () => route.params?.id,
  async (routeId) => {
    if (routeId) {
      await processRoute(String(routeId));
    }
  }
);

onMounted(async () => {
  const libraries = useKomgaLibraries();

  if (libraries.librariesList.length === 0) {
    await libraries.fetchLibraries();
  }

  await processRoute(libraryId);
});
</script>
