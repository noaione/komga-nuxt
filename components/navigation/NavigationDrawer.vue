<template>
  <VNavigationDrawer v-model="drawerVisible" :location="$vuetify.locale.isRtl ? 'right' : 'left'" order="1">
    <VListItem :active="false" class="py-4" @click="$router.push('/dashboard')">
      <template #prepend>
        <VAvatar>
          <VImg src="~/assets/logo.svg" />
        </VAvatar>
      </template>

      <VListItemTitle class="font-weight-bold mt-1">Komga</VListItemTitle>
    </VListItem>

    <VDivider />

    <VList>
      <VListItem to="/dashboard" class="py-4">
        <template #prepend>
          <VIcon>mdi-home</VIcon>
        </template>
        <VListItemTitle class="text-body-2">{{ $t("navigation.home") }}</VListItemTitle>
      </VListItem>
      <VListItem to="/libraries/all" class="py-4">
        <template #prepend>
          <VIcon>mdi-book-multiple</VIcon>
        </template>
        <VListItemTitle class="text-body-2">{{ $t("navigation.libraries") }}</VListItemTitle>
        <template v-if="user.isAdmin" #append>
          <VBtn icon size="small" color="contrast-2" @click.stop.capture.prevent="console.log('TODO')">
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </template>
      </VListItem>

      <VListItem
        v-for="library in libraries.librariesList"
        :key="library.id"
        :to="`/libraries/${library.id}`"
        class="py-4"
      >
        <template #prepend>
          <VIcon :style="{ visibility: 'hidden' }">mdi-book</VIcon>
        </template>
        <VListItemTitle class="text-body-2">{{ library.name }}</VListItemTitle>
      </VListItem>

      <VListItem v-if="user.isAdmin" to="/import" class="py-4">
        <template #prepend>
          <VIcon>mdi-import</VIcon>
        </template>
        <VListItemTitle class="text-body-2">{{ $t("book_import.title") }}</VListItemTitle>
      </VListItem>

      <VListItem v-if="user.isAdmin" to="/media-management" class="py-4">
        <template #prepend>
          <VIcon>mdi-book-cog</VIcon>
        </template>
        <VBadge v-model="booksCheck" offset-x="-15" offset-y="10" dot :content="globals.booksToCheck" color="accent">
          <VListItemTitle class="text-body-2">{{ $t("media_management.title") }}</VListItemTitle>
        </VBadge>
      </VListItem>

      <VListItem v-if="user.isAdmin" to="/settings" class="py-4">
        <template #prepend>
          <VIcon>mdi-cog</VIcon>
        </template>
        <VBadge
          v-model="showAnnounce"
          offset-x="-20"
          offset-y="11"
          dot
          :content="globals.announcementCount"
          color="warning"
        >
          <VListItemTitle class="text-body-2">{{ $t("server_settings.server_settings") }}</VListItemTitle>
        </VBadge>
      </VListItem>

      <VListItem to="/account" class="py-4">
        <template #prepend>
          <VIcon>mdi-account</VIcon>
        </template>
        <VListItemTitle class="text-body-2">{{ $t("account_settings.account_settings") }}</VListItemTitle>
      </VListItem>

      <VListItem class="py-4" @click="doLogout">
        <template #prepend>
          <VIcon>mdi-power</VIcon>
        </template>
        <VListItemTitle class="text-body-2">{{ $t("navigation.logout") }}</VListItemTitle>
      </VListItem>
    </VList>

    <VDivider />

    <VList lines="one">
      <VListItem>
        <template #prepend>
          <VIcon class="mb-4">{{ themeIcon }}</VIcon>
        </template>

        <template #default>
          <ThemeSwitcher class="mt-2" />
        </template>
      </VListItem>
    </VList>

    <VList>
      <VListItem>
        <template #prepend>
          <VIcon class="mb-4">mdi-translate</VIcon>
        </template>
        <LocaleSwitcher class="mt-2" />
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const drawerVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const user = useKomgaUser();
const globals = useKomgaGlobals();
const libraries = useKomgaLibraries();
const reusables = useReusableContents();
const router = useRouter();
const colorMode = useColorMode();

const booksCheck = computed(() => {
  return globals.booksToCheck > 0;
});

const showAnnounce = computed(() => {
  return globals.announcementCount === 0;
});

const themeIcon = computed(() => {
  switch (colorMode.preference) {
    case "light": {
      return "mdi-brightness-7";
    }
    case "dark": {
      return "mdi-brightness-3";
    }
    default: {
      return "mdi-brightness-auto";
    }
  }
});

async function performLogout() {
  try {
    await $fetch("/api/logout", {
      method: "POST",
      credentials: "include",
      baseURL: useKomgaServerUrl().origin,
    });

    return true;
  } catch (error) {
    let msg = "An error occurred while trying to logout";

    if (error instanceof FetchError && error.response?._data.message) {
      msg += `: ${error.response._data.message}`;
    }

    reusables.queueSnackbar({
      text: msg,
      timeout: 2500,
      color: "error",
    });

    return false;
  }
}

async function doLogout() {
  await performLogout();
  router.push("/login");
}
</script>
