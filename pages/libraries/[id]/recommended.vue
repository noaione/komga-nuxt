<template>
  <p>TODO RECOMMENDED</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();
const libraryId = String(route.params.id);

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.includes("/libraries") && newPath.includes("/recommended")) {
      config.library.routeMode[libraryId] = "recommended";
    }
  },
  {
    immediate: true,
  }
);
</script>
