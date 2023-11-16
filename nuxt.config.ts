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
  build: {
    transpile: ["vue-i18n"],
  },
  modules: [
    "vuetify-nuxt-module",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@nuxtjs/eslint-module",
    "@vueuse/nuxt",
    "nuxt-open-fetch",
  ],
  colorMode: {
    preference: "system",
    fallback: "dark",
    storageKey: "komgaN3.theme",
  },
  eslint: {
    lintOnStart: false,
  },
  app: {
    head: {
      meta: [
        {
          "http-equiv": "x-ua-compatible",
          content: "IE=edge",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "msapplication-TileColor",
          content: "#08397f",
        },
        {
          name: "msapplication-TileImage",
          content: "/mstile-144x144.png",
        },
      ],
      link: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
      ],
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
  imports: {
    imports: [
      {
        name: "useVuelidate",
        from: "@vuelidate/core",
      },
      {
        name: "components",
        from: "#build/types/nuxt-open-fetch/komga",
        as: "KomgaComponents",
      },
    ],
    presets: [
      {
        from: "vue-i18n",
        imports: ["useI18n"],
      },
    ],
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
      Inter: true,
    },
  },
  runtimeConfig: {
    public: {
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
  vuetify: {
    vuetifyOptions: "./vuetify.config.ts",
    moduleOptions: {
      styles: {
        configFile: "assets/vuetify/settings.scss",
      },
    },
  },
  css: ["~/assets/vuetify/main.scss"],
  experimental: {
    inlineSSRStyles: false,
  },
});
