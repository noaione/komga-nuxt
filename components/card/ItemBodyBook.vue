<template>
  <div v-if="item.item.deleted" class="text-truncate text-error">{{ $t("common.unavailable") }}</div>
  <template v-else>
    <div v-if="item.item.media.status === MediaStatus.ERROR">{{ $t("book_card.error") }}</div>
    <div v-else-if="item.item.media.status === MediaStatus.UNSUPPORTED">
      {{ $t("book_card.unsupported") }}
    </div>
    <div v-else-if="item.item.media.status === MediaStatus.UNKNOWN">{{ $t("book_card.unknown") }}</div>
    <div else :title="withContext.title">{{ withContext.text }}</div>
  </template>
</template>

<script setup lang="ts">
import { type ItemBookData, ItemShowContext } from "#imports";
import { formatFileSize } from "~/utils/items";

type WithContextReturn = {
  title?: string;
  text: string;
};

const props = defineProps<{
  item: ItemBookData;
  context?: ItemShowContext[];
}>();

const { t, locale } = useI18n();

enum MediaStatus {
  READY = "READY",
  UNKNOWN = "UNKNOWN",
  ERROR = "ERROR",
  UNSUPPORTED = "UNSUPPORTED",
  OUTDATED = "OUTDATED",
}

function createAndUseFormatter(date: string | number | Date, options?: Intl.DateTimeFormatOptions) {
  const formatter = new Intl.DateTimeFormat(locale.value.replace("_", "-"), options);

  return formatter.format(new Date(date));
}

const withContext = computed((): WithContextReturn => {
  const { item } = props.item;
  const context = props.context ?? [];

  if (context.includes(ItemShowContext.RELEASE_DATE)) {
    return {
      text: item.metadata.releaseDate
        ? createAndUseFormatter(item.metadata.releaseDate, {
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
  } else if (context.includes(ItemShowContext.READ_DATE)) {
    return {
      text: item.readProgress?.readDate
        ? createAndUseFormatter(item.readProgress.readDate, {
            dateStyle: "medium",
          })
        : t("book_card.unread"),
      title: item.readProgress?.readDate
        ? createAndUseFormatter(item.readProgress.readDate, {
            dateStyle: "long",
            timeStyle: "medium",
          })
        : undefined,
    };
  } else if (context.includes(ItemShowContext.FILE_SIZE)) {
    return {
      text: formatFileSize(item.sizeBytes),
    };
  }

  return {
    title: undefined,
    text: t("common.pages_n", item.media.pagesCount),
  };
});
</script>
