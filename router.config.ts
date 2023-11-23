import type { RouterConfig } from "@nuxt/schema";
import { createWebHistory } from "vue-router";

export default <RouterConfig>{
  history: (base) => createWebHistory(base),
  hashMode: false,
};
