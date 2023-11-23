<template>
  <VHover>
    <template #default="{ isHovering }">
      <VCard variant="tonal" :ripple="false">
        <VImg
          :src="wrapItem.thumbnailUrl + `?t${cacheBust}`"
          :lazy-src="thumbError ? coverBase64 : undefined"
          aspect-ratio="0.7071"
          @error="thumbError = true"
          @load="thumbError = false"
        >
          <div v-if="isUnread" class="unread-tick" />
          <span v-if="unreadCount" class="text-white pa-1 px-2 text-subtitle-2 cseries-unread-tick">
            {{ unreadCount }}
          </span>

          <VFadeTransition>
            <VOverlay
              v-if="isHovering || selected || actionMenuState"
              absolute
              :style="{
                opacity: isHovering || actionMenuState ? 0.3 : 0,
              }"
              :class="`${
                isHovering || actionMenuState
                  ? 'item-border-darken'
                  : selected
                  ? 'item-border'
                  : 'item-border-transparent'
              } overlay-full`"
            >
              <!-- Selection -->
              <VIcon
                v-if="$attrs?.onSelected"
                :color="selected ? 'secondary' : ''"
                :style="{
                  position: 'absolute',
                  top: '5px',
                  right: $vuetify.locale.isRtl ? 'unset' : '10px',
                  left: !$vuetify.locale.isRtl ? '10px' : 'unset',
                }"
                @click="$emit('selected', item)"
              >
                {{
                  selected || isHovering ? "mdi-checkbox-marked-circle" : "mdi-checkbox-blank-circle-outline"
                }}
              </VIcon>

              <!-- FAB icon (Reading) -->
              <VBtn
                v-if="bookReady && !selected && user.canRead && wrapItem.fabTo"
                size="x-large"
                color="accent"
                variant="elevated"
                icon="mdi-book-open-page-variant"
                :to="wrapItem.fabTo"
                :style="{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-36px',
                  marginTop: '-36px',
                }"
              />

              <!-- Pen Icon -->
              <VBtn
                v-if="!selected && $attrs?.onEdit"
                icon
                :style="{
                  position: 'absolute',
                  top: '5px',
                  right: $vuetify.locale.isRtl ? 'unset' : '5px',
                  left: !$vuetify.locale.isRtl ? '5px' : 'unset',
                }"
                @click="$emit('edit', item)"
              >
                <VIcon>mdi-pencil</VIcon>
              </VBtn>

              <!-- Menu -->
              <div
                v-if="!selected && actionMenu"
                :style="{
                  position: 'absolute',
                  top: '5px',
                  right: !$vuetify.locale.isRtl ? 'unset' : '5px',
                  left: $vuetify.locale.isRtl ? '5px' : 'unset',
                }"
              >
                <MenusBookSeriesAction
                  v-if="wrapItem.type === 'book' && wrapItem.item.oneshot"
                  v-model="actionMenuState"
                  :book="wrapItem.item"
                />
                <MenusBookSeriesAction
                  v-else-if="wrapItem.type === 'book' || wrapItem.type === 'series'"
                  v-model="actionMenuState"
                  :series="wrapItem.type === 'series' ? wrapItem.item : undefined"
                  :book="wrapItem.type === 'book' ? wrapItem.item : undefined"
                />
                <MenusReadCollectionAction
                  v-else-if="wrapItem.type === 'readlist' || wrapItem.type === 'collection'"
                  v-model="actionMenuState"
                  :item="item"
                />
              </div>
            </VOverlay>
          </VFadeTransition>
          <VProgressLinear
            v-if="showProgress && readProgressPercent >= 0"
            color="orange"
            height="6"
            :style="{
              position: 'absolute',
              bottom: 0,
            }"
          />
        </VImg>

        <!-- Description -->
        <template v-if="!thumbnailOnly && wrapItemTitle.length > 0">
          <NuxtLink v-if="wrapItemTitle.length < 2" :to="wrapItemTitle[0].targetUrl" class="link-underline">
            <VCardSubtitle
              class="clamp-line clamped-subtitle pa-2 pb-1 text-primary"
              :title="wrapItemTitle[0].title"
            >
              {{ wrapItemTitle[0].title }}
            </VCardSubtitle>
          </NuxtLink>
          <VCardSubtitle v-else class="clamp-line clamped-subtitle pa-2 pb-1 text-primary">
            <NuxtLink
              v-for="(t, i) in wrapItemTitle"
              :key="t.targetUrl"
              :to="t.targetUrl"
              class="link-underline text-truncate"
              style="display: block"
              :title="t.title"
              :class="{
                'font-weight-light': i !== 0,
              }"
            >
              {{ t.title }}
            </NuxtLink>
          </VCardSubtitle>
          <VCardText class="px-2 pt-0 font-weight-light">
            <CardItemBodyBook v-if="wrapItem.type === 'book'" :item="wrapItem" :context="context" />
            <CardItemBodySeries v-else-if="wrapItem.type === 'series'" :item="wrapItem" :context="context" />
            <span v-else-if="wrapItem.type === 'collection'">
              {{ $tc("dialog.add_to_collection.card_collection_subtitle", wrapItem.item.seriesIds.length) }}
            </span>
            <span v-else-if="wrapItem.type === 'readlist'">
              {{ $tc("dialog.add_to_readlist.card_readlist_subtitle", wrapItem.item.bookIds.length) }}
            </span>
          </VCardText>
        </template>
      </VCard>
    </template>
  </VHover>
</template>

<script setup lang="ts">
import { ItemShowContext, type KomgaItemWrapped } from "#imports";

const props = defineProps<{
  item: KomgaItemWrapped;
  context?: ItemShowContext[];
  selected?: boolean;
  actionMenu?: boolean;
  thumbnailOnly?: boolean;
  showProgress?: boolean;
}>();

defineEmits<{
  (e: "selected", value: KomgaItemWrapped): void;
  (e: "edit", series: KomgaItemWrapped): void;
}>();

const { $komgaSSE } = useNuxtApp();
const user = useKomgaUser();

const wrapItem = computed(() => {
  if (props.item.type === "series" || props.item.type === "book") {
    const library = useKomgaLibrary(props.item.result.libraryId);

    if (library.library?.unavailable) {
      const newItem = {
        result: { ...props.item.result, deleted: true },
        type: props.item.type,
      } as KomgaItemWrapped;

      return makeItemData(newItem);
    }
  }

  return makeItemData(props.item);
});
const wrapItemTitle = computed(() => {
  return wrapItem.value.title(props.context);
});

// Cache busting mechanism
const cacheBust = ref(Date.now());
const actionMenuState = ref(false);
const thumbError = ref(false);
const isUnread = computed(() => {
  if (wrapItem.value.type === "series" && wrapItem.value.item.oneshot) {
    return wrapItem.value.item.booksUnreadCount + wrapItem.value.item.booksUnreadCount > 0;
  } else if (wrapItem.value.type === "book") {
    return wrapItem.value.item.readProgress === undefined;
  }

  return false;
});
const unreadCount = computed(() => {
  if (wrapItem.value.type === "series") {
    return wrapItem.value.item.booksUnreadCount + wrapItem.value.item.booksInProgressCount;
  }

  return;
});
const readProgressPercent = computed(() => {
  if (wrapItem.value.type === "book" && wrapItem.value.item.readProgress) {
    return wrapItem.value.item.readProgress.completed
      ? 100
      : (wrapItem.value.item.readProgress?.page / wrapItem.value.item.media.pagesCount) * 100;
  }

  return -1;
});
const bookReady = computed(() => {
  return wrapItem.value.type === "book" ? wrapItem.value.item.media.status === "READY" : false;
});

function onThumbnailSeriesChange(event: CustomEvent<KSSEThumbnailSeries>) {
  if (event.detail.selected && event.detail.seriesId === wrapItem.value.item.id) {
    cacheBust.value = Date.now();
  }
}

function onThumbnailBookChange(event: CustomEvent<KSSEThumbnailBook>) {
  if (event.detail.selected && event.detail.bookId === wrapItem.value.item.id) {
    cacheBust.value = Date.now();
  }
}

function onThumbnailCollectionChange(event: CustomEvent<KSSEThumbnailCollection>) {
  if (event.detail.selected && event.detail.collectionId === wrapItem.value.item.id) {
    cacheBust.value = Date.now();
  }
}

function onThumbnailReadListChange(event: CustomEvent<KSSEThumbnailReadList>) {
  if (event.detail.selected && event.detail.readListId === wrapItem.value.item.id) {
    cacheBust.value = Date.now();
  }
}

onMounted(() => {
  $komgaSSE.on<KSSEThumbnailSeries>(THUMBNAIL_SERIES_ADDED, onThumbnailSeriesChange);
  $komgaSSE.on<KSSEThumbnailSeries>(THUMBNAIL_SERIES_DELETED, onThumbnailSeriesChange);
  $komgaSSE.on<KSSEThumbnailBook>(THUMBNAIL_BOOK_ADDED, onThumbnailBookChange);
  $komgaSSE.on<KSSEThumbnailBook>(THUMBNAIL_BOOK_DELETED, onThumbnailBookChange);
  $komgaSSE.on<KSSEThumbnailCollection>(THUMBNAIL_COLLECTION_ADDED, onThumbnailCollectionChange);
  $komgaSSE.on<KSSEThumbnailCollection>(THUMBNAIL_COLLECTION_DELETED, onThumbnailCollectionChange);
  $komgaSSE.on<KSSEThumbnailReadList>(THUMBNAIL_READ_LIST_ADDED, onThumbnailReadListChange);
  $komgaSSE.on<KSSEThumbnailReadList>(THUMBNAIL_READ_LIST_DELETED, onThumbnailReadListChange);
});

tryOnBeforeUnmount(() => {
  $komgaSSE.off<KSSEThumbnailSeries>(THUMBNAIL_SERIES_ADDED, onThumbnailSeriesChange);
  $komgaSSE.off<KSSEThumbnailSeries>(THUMBNAIL_SERIES_DELETED, onThumbnailSeriesChange);
  $komgaSSE.off<KSSEThumbnailBook>(THUMBNAIL_BOOK_ADDED, onThumbnailBookChange);
  $komgaSSE.off<KSSEThumbnailBook>(THUMBNAIL_BOOK_DELETED, onThumbnailBookChange);
  $komgaSSE.off<KSSEThumbnailCollection>(THUMBNAIL_COLLECTION_ADDED, onThumbnailCollectionChange);
  $komgaSSE.off<KSSEThumbnailCollection>(THUMBNAIL_COLLECTION_DELETED, onThumbnailCollectionChange);
  $komgaSSE.off<KSSEThumbnailReadList>(THUMBNAIL_READ_LIST_ADDED, onThumbnailReadListChange);
  $komgaSSE.off<KSSEThumbnailReadList>(THUMBNAIL_READ_LIST_DELETED, onThumbnailReadListChange);
});
</script>

<style scoped lang="scss">
.cseries-unread-tick {
  background-color: orange;
  position: absolute;
  right: 0;
}
.clamped-subtitle {
  -webkit-line-clamp: 2;
  word-break: normal !important;
  height: 4em;
}
</style>
