<template>
  <p>TODO RECOMMENDED</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();

watch(
  [() => route.name, () => route.params],
  ([newPath, params]) => {
    if (newPath === "libraries-id-recommended") {
      const libraryId = String((params as { id: string }).id);

      config.library.routeMode[libraryId] = "recommended";
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
