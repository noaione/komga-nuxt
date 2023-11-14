export default defineNuxtPlugin(() => {
  const { origin } = useKomgaServerUrl();
  const auth = useKomgaUser();
  const router = useRouter();

  router.beforeEach((to) => {
    if (window.opener !== null && window.name === "oauth2Login" && to.query.server_redirect === "Y") {
      window.opener.location.href = to.query.error ? window.location : origin;
      window.close();
    }

    if (!auth.authenticated) {
      const redirect = encodeURIComponent(to.fullPath);

      if (!to.path.startsWith("/startup") && !to.path.startsWith("/login")) {
        return navigateTo(`/startup?redirect=${redirect}`);
      }
    }
  });
});
