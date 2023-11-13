export default defineNuxtPlugin(() => {
  const { origin } = useKomgaServerUrl();
  const auth = useKomgaAuth();
  const router = useRouter();

  router.beforeEach((to) => {
    console.log("beforeEach", to);

    if (window.opener !== null && window.name === "oauth2Login" && to.query.server_redirect === "Y") {
      window.opener.location.href = to.query.error ? window.location : origin;
      window.close();
    }

    if (!to.path.startsWith("/startup") && !to.path.startsWith("/login") && !auth.authenticated) {
      const redirect = encodeURIComponent(to.fullPath);

      return navigateTo(`/startup?redirect=${redirect}`);
    }
  });
});
