<template>
  <div v-if="item.item.deleted" class="text-truncate text-error">{{ $t("common.unavailable") }}</div>
  <div else :title="withContext.title">{{ withContext.text }}</div>
</template>

<script setup lang="ts">
import { type ItemSeriesData, ItemShowContext } from "#imports";

type WithContextReturn = {
  title?: string;
  text: string;
};

const props = defineProps<{
  item: ItemSeriesData;
  context?: ItemShowContext[];
}>();

const { t, locale } = useI18n();

function createAndUseFormatter(date: string | number | Date, options?: Intl.DateTimeFormatOptions) {
  const formatter = new Intl.DateTimeFormat(locale.value.replace("_", "-"), options);

  return formatter.format(new Date(date));
}

const withContext = computed((): WithContextReturn => {
  const { item } = props.item;
  const context = props.context ?? [];

  if (context.includes(ItemShowContext.RELEASE_DATE)) {
    return {
      text: item.booksMetadata.releaseDate
        ? createAndUseFormatter(item.booksMetadata.releaseDate, {
            dateStyle: "medium",
            timeZone: "UTC",
          })
        : t("book_card.no_release_date"),
    };
  } else if (context.includes(ItemShowContext.DATE_ADDED)) {
    return {
      text: createAndUseFormatter(item.created, {
        dateStyle: "medium",
      }),
      title: createAndUseFormatter(item.created, {
        dateStyle: "long",
        timeStyle: "medium",
      }),
    };
  } else if (context.includes(ItemShowContext.DATE_UPDATED)) {
    return {
      text: createAndUseFormatter(item.lastModified, {
        dateStyle: "medium",
      }),
      title: createAndUseFormatter(item.lastModified, {
        dateStyle: "long",
        timeStyle: "medium",
      }),
    };
  } else if (item.oneshot) {
    return { text: t("common.oneshot") };
  }

  return {
    title: undefined,
    text: t("common.books_n", item.booksCount),
  };
});
</script>
