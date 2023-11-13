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
          "contrast-light-2": colors.grey.darken2,
          diff: colors.green.lighten4,
        },
      },
      dark: {
        colors: {
          base: colors.shades.black,
          primary: "#78baec",
          secondary: "#fec000",
          accent: "#ff0335",
          "contrast-1": colors.grey.darken4,
          "contrast-light-2": colors.grey.lighten2,
          diff: colors.green.darken4,
        },
      },
    },
  },
});
