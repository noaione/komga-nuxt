<template>
  <VSelect
    v-model="$colorMode.preference"
    item-title="text"
    item-value="value"
    variant="underlined"
    density="compact"
    color="primary"
    :class="$props.class"
    :items="availableColors"
    :label="$t('home.theme')"
    :prepend-icon="$props.prependIcon"
  />
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
  prependIcon?: string;
}>();

const { t } = useI18n();

const availableColors = [
  {
    text: t("theme.system"),
    value: "system",
  },
  {
    text: t("theme.light"),
    value: "light",
  },
  {
    text: t("theme.dark"),
    value: "dark",
  },
];
</script>
