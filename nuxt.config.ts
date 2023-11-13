import type { NuxtPage } from "nuxt/schema";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

function getEnv(key: string): string | undefined {
  return import.meta.env[key] ?? process.env[key];
}

function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
  const pagesToRemove = [];

  for (const page of pages) {
    if (!page.file) continue;

    if (pattern.test(page.file)) {
      pagesToRemove.push(page);
    } else {
      removePagesMatching(pattern, page.children);
    }
  }

  if (pagesToRemove.length === 0) return;

  console.log("Removing dev pages:", pagesToRemove.map((p) => p.path).join(", "));

  for (const page of pagesToRemove) {
    pages.splice(pages.indexOf(page), 1);
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  vue: {
    defineModel: true,
    propsDestructure: true,
  },
  vite: {
    plugins: [
      VueI18nPlugin.vite({
        include: resolve(dirname(fileURLToPath(import.meta.url)), "./locales/**"),
        strictMessage: false,
      }),
    ],
  },
  modules: [
    "@nuxtjs/i18n",
    "vuetify-nuxt-module",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/eslint-module",
    "@vueuse/nuxt",
    "nuxt-open-fetch",
  ],
  colorMode: {
    preference: "system",
    fallback: "dark",
  },
  eslint: {
    lintOnStart: false,
  },
  app: {
    head: {
      script: [
        {
          // @ts-expect-error - we're adding th:inline since it will be used by thymeleaf
          "th:inline": "javascript",
          innerHTML: `
          /*<![CDATA[*/
          window.resourceBaseUrl = /*[(<%="$"%>{"'" + baseUrl + "'"})]*/ '/'
          /*]]>*/
          `,
        },
      ],
    },
  },
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    vueI18n: "./i18n.config.ts",
    compilation: {
      strictMessage: false,
    },
  },
  hooks: {
    "pages:extend"(pages) {
      // remove routes
      if (process.env.NODE_ENV === "production") {
        // Remove all pages that match the pattern in production
        console.log("Removing dev pages for production build...");
        removePagesMatching(/\/_testground/, pages);
      }
    },
  },
  googleFonts: {
    families: {
      Roboto: true,
    },
  },
  runtimeConfig: {
    public: {
      // with './' the dev server cannot load any arbitrary path
      // with '/' the prod build generates some url(/fonts…) calls in the css chunks, which doesn't work with a servlet context path
      publicPath: import.meta.env.PROD ? "./" : "/",
      // Used when on dev mode or not bundled with the Spring Boot app
      baseHost: getEnv("BASE_HOST") ?? getEnv("NUXT_PUBLIC_BASE_HOST") ?? undefined,
    },
  },
  openFetch: {
    clients: {
      komga: {
        baseURL: "",
      },
    },
  },
});
