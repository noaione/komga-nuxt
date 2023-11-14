import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";

export async function komgaSearchBook(
  query: string,
  size: number = 10,
  unpaged: boolean = false
): Promise<KomgaComponents["schemas"]["BookDto"][]> {
  const { data } = await useKomgaFetch("/api/v1/books", {
    query: {
      search: query,
      size,
      unpaged,
    },
    credentials: "include",
    baseURL: useKomgaServerUrl().origin,
  });

  return data.value?.content ?? [];
}

export async function komgaSearchSeries(
  query: string,
  size: number = 10,
  unpaged: boolean = false
): Promise<KomgaComponents["schemas"]["SeriesDto"][]> {
  const { data } = await useKomgaFetch("/api/v1/series", {
    query: {
      oneshot: false,
      search: query,
      size,
      unpaged,
    },
    credentials: "include",
    baseURL: useKomgaServerUrl().origin,
  });

  return data.value?.content ?? [];
}

export async function komgaSearchCollections(
  query: string,
  size: number = 10,
  unpaged: boolean = false
): Promise<KomgaComponents["schemas"]["CollectionDto"][]> {
  const { data } = await useKomgaFetch("/api/v1/collections", {
    query: {
      search: query,
      size,
      unpaged,
    },
    credentials: "include",
    baseURL: useKomgaServerUrl().origin,
  });

  return data.value?.content ?? [];
}

export async function komgaSearchReadLists(
  query: string,
  size: number = 10,
  unpaged: boolean = false
): Promise<KomgaComponents["schemas"]["ReadListDto"][]> {
  const { data } = await useKomgaFetch("/api/v1/readlists", {
    query: {
      search: query,
      size,
      unpaged,
    },
    credentials: "include",
    baseURL: useKomgaServerUrl().origin,
  });

  return data.value?.content ?? [];
}
