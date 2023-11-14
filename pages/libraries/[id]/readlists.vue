<template>
  <p>TODO READLISTS</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();
const libraryId = String(route.params.id);

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.includes("/libraries") && newPath.includes("/readlists")) {
      config.library.routeMode[libraryId] = "readlists";
    }
  },
  {
    immediate: true,
  }
);
</script>
