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
      <NavigationLibrary v-if="$vuetify.display.mdAndUp" :library-id="libraryId" />
      <VSpacer />
      <MenusPageSize
        v-if="route.name !== 'libraries-id-recommended' || libraryId === 'all'"
        v-model="config.pageSize.libraries"
      />
    </ToolbarSticky>
    <NavigationLibrary v-if="$vuetify.display.smAndDown" :library-id="libraryId" bottom-navigation />
    <VContainer fluid>
      <NuxtPage v-if="libraryId !== 'all'" />
    </VContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const config = useKomgaConfig();
const upstream = useKomgaGlobals();

const libraryId = ref("all");
const library = useKomgaLibrary(libraryId.value);

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
  () => route.params,
  async (routeParam) => {
    const routeId = String((routeParam as { id: string }).id);

    if (!routeId) {
      router.replace("/libraries/all");
      libraryId.value = "all";
      await processRoute("all");

      return;
    }

    if (routeId === "all") {
      libraryId.value = "all";
      await processRoute("all");

      return;
    }

    libraryId.value = routeId;
    await processRoute(routeId);
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(async () => {
  const libraries = useKomgaLibraries();

  if (libraries.librariesList.length === 0) {
    await libraries.fetchLibraries();
  }
});
</script>
