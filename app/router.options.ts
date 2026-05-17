import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    // Strip locale suffix (___fr, ___en) to compare base route names
    const toBase = String(to.name ?? "").replace(/___\w+$/, "");
    const fromBase = String(from.name ?? "").replace(/___\w+$/, "");
    if (toBase === fromBase) return false;
    return { top: 0 };
  },
};
