<template>
  <div>
    <VAutocomplete
      ref="searchbox"
      v-model="selectedItem"
      :placeholder="$t('search.search')"
      :no-data-text="$t('search.no_results')"
      :loading="loading"
      :items="mergedResults"
      :hide-no-data="mergedResults === undefined"
      clearable
      no-filter
      return-object
      hide-details
      hide-selected
      single-line
      item-title="result.name"
      item-value="result.id"
      variant="solo"
      bg-color="background"
      color="primary"
      class="px-2"
      density="compact"
      :menu-props="{
        maxHeight: $vuetify.display.height * 0.9,
        minWidth: $vuetify.display.mdAndUp ? $vuetify.display.width * 0.4 : $vuetify.display.width * 0.8,
      }"
      @update:focused="focused = $event"
      @update:search="debouncedSearch"
    >
      <template #prepend-inner>
        <VIcon :color="focused ? 'primary' : 'on-primary'">mdi-magnify</VIcon>
      </template>
      <template #selection />

      <template #item="{ item, props }">
        <VListItem v-bind="props" :disabled="item.raw.type === 'header'">
          <template #title>
            <VListItemTitle v-if="item.raw.type === 'search'">{{ $t("searchbox.search_all") }}</VListItemTitle>
            <VListItemSubtitle v-if="item.raw.type === 'header'">{{ item.raw.result.name }}</VListItemSubtitle>
            <SearchResultSeries v-else-if="item.raw.type === 'series'" :data="item.raw.result" />
            <SearchResultBook v-else-if="item.raw.type === 'book'" :data="item.raw.result" />
            <SearchResultReadCollection
              v-else-if="item.raw.type === 'collection' || item.raw.type === 'readlist'"
              :data="item.raw.result"
              :type="item.raw.type"
            />
          </template>
          <template #subtitle />
        </VListItem>
      </template>
    </VAutocomplete>
  </div>
</template>

<script setup lang="ts">
import type { components as KomgaComponents } from "#build/types/nuxt-open-fetch/komga";
import SearchResultBook from "./SearchResultBook.vue";
import SearchResultReadCollection from "./SearchResultReadCollection.vue";
import SearchResultSeries from "./SearchResultSeries.vue";

type KomgaBookWrapped = {
  type: "book";
  result: KomgaComponents["schemas"]["BookDto"];
};

type KomgaSeriesWrapped = {
  type: "series";
  result: KomgaComponents["schemas"]["SeriesDto"];
};

type KomgaCollectionWrapped = {
  type: "collection";
  result: KomgaComponents["schemas"]["CollectionDto"];
};

type KomgaReadListWrapped = {
  type: "readlist";
  result: KomgaComponents["schemas"]["ReadListDto"];
};

type KomgaSearchTemp = {
  type: "search";
  result: {
    id: "SEARCH_ALL";
    name: string;
  };
};

type KomgaSearchHeader = {
  type: "header";
  result: {
    id: string;
    name: string;
  };
};

type KomgaSearchResultWrapped =
  | KomgaBookWrapped
  | KomgaSeriesWrapped
  | KomgaCollectionWrapped
  | KomgaReadListWrapped
  | KomgaSearchTemp
  | KomgaSearchHeader;

const searchbox = ref();
const selectedItem = ref<KomgaSearchResultWrapped>();

const router = useRouter();
const { t } = useI18n();

const _searchString = ref("");
const _booksResults = ref<KomgaComponents["schemas"]["BookDto"][]>();
const _seriesResults = ref<KomgaComponents["schemas"]["SeriesDto"][]>();
const _collectionsResults = ref<KomgaComponents["schemas"]["CollectionDto"][]>();
const _readlistsResults = ref<KomgaComponents["schemas"]["ReadListDto"][]>();

const mergedResults = computed(() => {
  // check if all results are undefined
  if (
    _booksResults.value === undefined &&
    _seriesResults.value === undefined &&
    _collectionsResults.value === undefined &&
    _readlistsResults.value === undefined
  ) {
    return;
  }

  const series = (_seriesResults.value ?? []).map((series) => ({
    type: "series",
    result: series,
  })) as KomgaSeriesWrapped[];
  const books = (_booksResults.value ?? []).map((book) => ({ type: "book", result: book })) as KomgaBookWrapped[];
  const collections = (_collectionsResults.value ?? []).map((collection) => ({
    type: "collection",
    result: collection,
  })) as KomgaCollectionWrapped[];
  const readlists = (_readlistsResults.value ?? []).map((readlist) => ({
    type: "readlist",
    result: readlist,
  })) as KomgaReadListWrapped[];

  const allData: KomgaSearchResultWrapped[] = [
    { type: "search", result: { id: "SEARCH_ALL", name: t("searchbox.search_all") } },
  ];

  if (series.length > 0) {
    allData.push(
      { type: "header", result: { id: "SERIES_HEADER", name: t("common.series", series.length) } },
      ...series
    );
  }

  if (books.length > 0) {
    allData.push({ type: "header", result: { id: "BOOKS_HEADER", name: t("common.books") } }, ...books);
  }

  if (collections.length > 0) {
    allData.push(
      {
        type: "header",
        result: { id: "COLLECTIONS_HEADER", name: t("common.collections") },
      },
      ...collections
    );
  }

  if (readlists.length > 0) {
    allData.push(
      {
        type: "header",
        result: { id: "READLISTS_HEADER", name: t("common.readlists") },
      },
      ...readlists
    );
  }

  return allData;
});

const focused = ref(false);

const loading = ref(false);

function onItemSelected(data: KomgaSearchResultWrapped) {
  switch (data.type) {
    case "book": {
      if (data.result.oneshot) {
        router.push(`/oneshot/${data.result.seriesId}`);
      } else {
        router.push(`/book/${data.result.id}`);
      }

      break;
    }
    case "series": {
      router.push(`/${data.result.oneshot ? "oneshot" : "series"}/${data.result.id}`);
      break;
    }
    case "collection": {
      router.push(`/collection/${data.result.id}`);
      break;
    }
    case "readlist": {
      router.push(`/readlist/${data.result.id}`);
      break;
    }
    case "search": {
      router.push(`/search?q=${_searchString}`);
      break;
    }
  }

  searchbox.value?.blur();
}

async function performSearch(queryString: string) {
  _searchString.value = queryString;

  if (!queryString) {
    _booksResults.value = undefined;
    _seriesResults.value = undefined;
    _collectionsResults.value = undefined;
    _readlistsResults.value = undefined;

    return;
  }

  loading.value = true;

  _booksResults.value = await komgaSearchBook(queryString, 10);
  _seriesResults.value = await komgaSearchSeries(queryString, 10);
  _collectionsResults.value = await komgaSearchCollections(queryString, 10);
  _readlistsResults.value = await komgaSearchReadLists(queryString, 10);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
}

watch(
  () => selectedItem.value,
  (data) => {
    nextTick(() => {
      selectedItem.value = undefined;
    });

    if (data) {
      onItemSelected(data);
    }
  }
);

const debouncedSearch = useDebounceFn(performSearch, 500);
</script>
