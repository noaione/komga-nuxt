<template>
  <p>TODO SERIES</p>
</template>

<script setup lang="ts">
const globals = useKomgaGlobals();
const config = useKomgaConfig();
const route = useRoute();
const router = useRouter();

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
