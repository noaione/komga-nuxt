<template>
  <VApp :theme="colorMode.value">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SnackbarNotification />
  </VApp>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

onMounted(() => {
  useSeoMeta({
    title: "Komga",
  });
});
</script>
