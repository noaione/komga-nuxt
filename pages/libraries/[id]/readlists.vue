<template>
  <p>TODO READLISTS</p>
</template>

<script setup lang="ts">
const config = useKomgaConfig();
const route = useRoute();

watch(
  [() => route.name, () => route.params],
  ([newPath, params]) => {
    if (newPath === "libraries-id-readlists") {
      const libraryId = String((params as { id: string }).id);

      config.library.routeMode[libraryId] = "readlists";
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
