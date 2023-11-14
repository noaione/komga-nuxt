<template>
  <VCol v-if="!loading">
    <p>TODO</p>
  </VCol>
</template>

<script setup lang="ts">
const loading = ref(true);
const libraries = useKomgaLibraries();

onMounted(async () => {
  if (libraries.librariesList.length === 0) {
    await libraries.fetchLibraries();
  }

  loading.value = false;
});
</script>
