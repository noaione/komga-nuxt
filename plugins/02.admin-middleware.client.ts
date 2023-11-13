const startsWithRoutes = ["/settings", "/media-management", "/import"];

export default defineNuxtPlugin(() => {
  const auth = useKomgaAuth();

  addRouteMiddleware(
    "admin-guard",
    (to) => {
      if (to.path.startsWith("/login")) return;

      const redirect = encodeURIComponent(to.fullPath);

      for (const route of startsWithRoutes) {
        if (to.path.startsWith(route) && !auth.isAdmin) {
          return navigateTo(`/login?redirect=${redirect}`);
        }
      }
    },
    { global: true }
  );
});
