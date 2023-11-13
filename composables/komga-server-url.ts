export const useKomgaServerUrl = () => {
  const runtimeConf = useRuntimeConfig();

  const originUrl = computed(() => {
    const baseHost = runtimeConf.public.baseHost;

    if (typeof baseHost === "string" && baseHost.trim().length > 0) {
      return baseHost;
    }

    return window.location.origin + window.resourceBaseUrl;
  });

  const baseUrl = computed(() => {
    return import.meta.env.PROD ? window.resourceBaseUrl : "/";
  });

  const sameDomain = computed(() => {
    const origin = new URL(originUrl.value);

    return origin.hostname === window.location.hostname;
  });

  return {
    origin: originUrl.value.replace(/\/$/, ""),
    base: baseUrl.value.replace(/\/$/, ""),
    sameDomain,
  };
};

declare global {
  interface Window {
    resourceBaseUrl: string;
  }
}
