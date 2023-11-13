<template>
  <VContainer :style="{ maxWidth: '550px' }">
    <VRow align="center" justify="center">
      <VImg src="~/assets/logo.svg" :max-width="maxLogoWidth" />
    </VRow>

    <div class="ma-3">Login</div>
  </VContainer>
</template>

<script setup lang="ts">
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

definePageMeta({
  layout: "fullpage",
});
</script>
