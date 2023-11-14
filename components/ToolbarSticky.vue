<template>
  <VToolbar flat :color="$props.color ?? 'contrast-1'" class="sticky-bar" :style="barStyles" :elevation="elevation">
    <slot />
  </VToolbar>
</template>

<script setup lang="ts">
defineProps<{
  elevation?: number;
  color?: string;
}>();

const display = useDisplay();
const barStyles = computed(() => {
  return ["xs", "sm"].includes(display.name.value.toString()) ? { top: "56px" } : { top: "64px" };
});
</script>

<style scoped lang="scss">
.sticky-bar {
  position: -webkit-sticky;
  position: sticky;
  z-index: 2;
}
</style>
