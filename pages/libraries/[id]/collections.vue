<template>
  <p>TODO COLLECTIONS</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();
const libraryId = String(route.params.id);

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.includes("/libraries") && newPath.includes("/collections")) {
      config.library.routeMode[libraryId] = "collections";
    }
  },
  {
    immediate: true,
  }
);
</script>
