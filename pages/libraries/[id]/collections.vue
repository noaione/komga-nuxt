<template>
  <p>TODO COLLECTIONS</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();

watch(
  [() => route.name, () => route.params],
  ([newPath, params]) => {
    if (newPath === "libraries-id-collections") {
      const libraryId = String((params as { id: string }).id);

      config.library.routeMode[libraryId] = "collections";
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
