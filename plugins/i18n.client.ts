import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

export default defineNuxtPlugin(({ vueApp }) => {
  const komgaConfig = useKomgaConfig();

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: komgaConfig.locale,
    fallbackLocale: "en",
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    messages,
  });

  vueApp.use(i18n);
});
