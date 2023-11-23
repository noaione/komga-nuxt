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
import type { KSSESessionExpired, KSSETaskQueue } from "./utils/sse-events";

const router = useRouter();
const auth = useKomgaUser();
const reusables = useReusableContents();
const { $komgaSSE } = useNuxtApp();
const colorMode = useColorMode();

onMounted(() => {
  useSeoMeta({
    title: "Komga",
  });

  $komgaSSE.on<KSSETaskQueue>(TASK_QUEUE_STATUS, (event) => {
    reusables.tasksData = event.detail;
  });

  $komgaSSE.on<KSSESessionExpired>(SESSION_EXPIRED, (event) => {
    if (event.detail.userId === auth.user?.id) {
      auth.logout();
      router.push("/login");
    }
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
