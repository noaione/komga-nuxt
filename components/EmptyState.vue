<template>
  <div class="text-center">
    <VAvatar color="contrast-1" :size="size">
      <div>
        <VIcon v-if="icon" :color="iconColor" :size="iconSize">{{ icon }}</VIcon>
        <h1 class="text-h5">{{ title }}</h1>
        <p v-if="subtitle" class="text-body-1">{{ subtitle }}</p>
        <slot />
      </div>
    </VAvatar>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    icon?: string;
    iconColor?: string;
    iconSize?: number;
    size?: number;
  }>(),
  {
    subtitle: undefined,
    icon: undefined,
    iconColor: "secondary",
    iconSize: 140,
    size: 400,
  }
);
</script>
