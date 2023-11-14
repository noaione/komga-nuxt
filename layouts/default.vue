<template>
  <div class="fill-height">
    <VAppBar scroll-behavior="elevate" scroll-threshold="0" order="2">
      <VBadge dot :model-value="showBadge" :color="info.booksToCheck > 0 ? 'accent' : 'warning'" class="ms-2">
        <VAppBarNavIcon @click.stop="drawerVisible = !drawerVisible" />
      </VBadge>

      <SearchBar class="flex-fill" />
    </VAppBar>

    <NavigationDrawer v-model="drawerVisible" />

    <VMain class="fill-height">
      <slot />
    </VMain>
  </div>
</template>

<script setup lang="ts">
const display = useDisplay();
const info = useKomgaGlobals();
const drawerVisible = ref(display.lgAndUp);

const showBadge = computed(() => {
  return !drawerVisible && (info.booksToCheck > 0 || info.announcementCount > 0);
});

async function checkForAnnouncement() {
  const { origin } = useKomgaServerUrl();

  const { data } = await useKomgaFetch("/api/v1/announcements", {
    method: "GET",
    credentials: "include",
    baseURL: origin,
  });

  if (data.value) {
    info.setAnnuncements(data.value.items);
  }
}

onMounted(async () => {
  await checkForAnnouncement();
});
</script>
