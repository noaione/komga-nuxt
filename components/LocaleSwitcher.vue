<template>
  <VSelect
    v-model="remoteLocale"
    item-title="text"
    item-value="value"
    variant="underlined"
    density="compact"
    color="primary"
    :class="$props.class"
    :items="availableLocales"
    :label="$t('home.translation')"
  />
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
}>();

const { $vuetify } = useNuxtApp();
const { locale, availableLocales: locales } = useI18n();

const config = useKomgaConfig();

const remoteLocale = computed({
  get: () => locale.value,
  set: (newLocale: string) => {
    locale.value = newLocale;
    $vuetify.locale.current.value = newLocale;

    config.locale = newLocale;
  },
});
const availableLocales = computed(() => {
  return locales.map((loc) => {
    const langNames = new Intl.DisplayNames([loc.replace("_", "-")], { type: "language" });

    let name = langNames.of(loc.replace("_", "-"));

    if (name) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    return {
      text: name || loc,
      value: loc,
    };
  });
});
</script>
