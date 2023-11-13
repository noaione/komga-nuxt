<template>
  <VSnackbar
    v-if="currentSnackbar"
    v-model="currentSnackbar.show"
    :color="currentSnackbar.color"
    :multi-line="Boolean(currentSnackbar.details)"
    :vertical="currentSnackbar.vertical"
    :timeout="currentSnackbar.timeout"
    location="bottom"
  >
    <p>{{ currentSnackbar.text }}</p>
    <p v-if="currentSnackbar.details">{{ currentSnackbar.details }}</p>
    <template #actions>
      <VBtn
        v-if="currentSnackbar.goto"
        color="secondary"
        variant="text"
        @click="
          currentSnackbar.goto.click();
          currentSnackbar.show = false;
        "
      >
        {{ currentSnackbar.goto.text }}
      </VBtn>
      <VBtn variant="text" @click="currentSnackbar.show = false">{{ $t("common.dismiss") }} </VBtn>
    </template>
  </VSnackbar>
</template>

<script setup lang="ts">
const reusable = useReusableContents();

type SnackbarWithShow = KomgaReusableSnackbar & { show: boolean };

const currentSnackbar = ref<SnackbarWithShow>();

watchDeep(
  () => reusable.snackbars,
  () => {
    const snackbar = reusable.getSnackbar();

    if (snackbar) {
      currentSnackbar.value = { ...snackbar, show: true };
    }
  }
);

watchDeep(
  () => currentSnackbar.value,
  () => {
    if (currentSnackbar.value && !currentSnackbar.value.show) {
      // remove the snackbar from the ref
      currentSnackbar.value = undefined;
    }
  }
);

onMounted(() => {
  const snackbar = reusable.getSnackbar();

  if (snackbar) {
    currentSnackbar.value = { ...snackbar, show: true };
  }
});
</script>
