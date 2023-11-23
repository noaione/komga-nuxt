<template>
  <p>TODO RECOMMENDED</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();

const libraryId = ref("all");

async function fetchLibraryData() {
  if (libraryId.value === "all") {
    return;
  }

  console.log("Fetching library", libraryId.value, route.name);

  const library = useKomgaLibrary(libraryId.value);

  await library.fetchLibrary();
}

watch(
  [() => route.name, () => route.params],
  ([newPath, params]) => {
    if (newPath === "libraries-id-recommended") {
      const newId = String((params as { id: string }).id);

      config.library.routeMode[newId] = "recommended";

      libraryId.value = newId;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => libraryId.value,
  async () => {
    await fetchLibraryData();
  },
  {
    immediate: true,
  }
);
</script>
