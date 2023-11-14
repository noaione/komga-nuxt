// vuetify.config.ts
import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";
import colors from "vuetify/util/colors";

export default defineVuetifyConfiguration({
  directives: ["Touch"],
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    themes: {
      light: {
        colors: {
          base: colors.shades.white,
          primary: "#005ed3",
          secondary: "#fec000",
          accent: "#ff0335",
          "contrast-1": colors.grey.lighten4,
          "contrast-2": colors.grey.lighten3,
          "contrast-light-2": colors.grey.darken2,
          diff: colors.green.lighten4,
          error: colors.red.accent2,
        },
      },
      dark: {
        colors: {
          base: colors.shades.black,
          primary: "#78baec",
          "on-primary": colors.shades.white,
          secondary: "#fec000",
          accent: "#ff0335",
          "contrast-1": colors.grey.darken4,
          "contrast-2": colors.grey.darken3,
          "contrast-light-2": colors.grey.lighten2,
          diff: colors.green.darken4,
          error: colors.red.accent2,
        },
      },
    },
  },
});
