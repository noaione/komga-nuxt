<template>
  <VRow align="center" justify="center">
    <VImg src="~/assets/logo.svg" :max-width="maxLogoWidth" />
  </VRow>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const komgaAuth = useKomgaUser();
const komgaLibraries = useKomgaLibraries();

const maxLogoWidth = computed(() => {
  switch (useDisplay().name.value) {
    case "xs": {
      return 100;
    }
    case "sm": {
      return 100;
    }
    case "md": {
      return 200;
    }
    default: {
      return 300;
    }
  }
});

onMounted(async () => {
  try {
    if (route.query.xAuthToken) {
      try {
        await komgaAuth.oauthLogin(route.query.xAuthToken.toString());
      } catch (error) {
        console.debug("OAuth login failed", error);
      }
    }

    await komgaAuth.getSetUser();
    // Fetch libaries
    await komgaLibraries.fetchLibraries();

    const redirect = route.query.redirect?.toString();

    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/dashboard");
    }
  } catch {
    const redirect = route.query.redirect?.toString();

    if (redirect) {
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    } else {
      router.push("/login");
    }
  }
});

definePageMeta({
  layout: "fullpage",
});
</script>
