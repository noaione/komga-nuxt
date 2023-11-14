<template>
  <VApp :theme="colorMode.value">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SnackbarNotification />
    <DialogConfirmation />
  </VApp>
</template>

<script setup lang="ts">
import type { KomgaTaskQueue } from "./composables/reusable-contents";

const router = useRouter();
const auth = useKomgaUser();
const reusables = useReusableContents();
const { $komgaSSE } = useNuxtApp();
const colorMode = useColorMode();

onMounted(() => {
  useSeoMeta({
    title: "Komga",
  });

  $komgaSSE.on<KomgaTaskQueue>("TaskQueueStatus", (event) => {
    reusables.tasksData = event.detail;
  });

  $komgaSSE.on("SessionExpired", () => {
    auth.logout();

    router.push("/login");
  });

  $komgaSSE.on("KomgaSSEUnauthorized", () => {
    auth.logout();

    const currentRoute = router.currentRoute.value.fullPath;

    if (currentRoute.startsWith("/login")) {
      router.push("/login");
    } else {
      router.push(`/login?redirect=${encodeURIComponent(currentRoute)}`);
    }
  });

  if (auth.authenticated) {
    $komgaSSE.connect();
  }
});
</script>
