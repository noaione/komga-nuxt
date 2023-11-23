import { partial as partialFilesize } from "filesize";
import type { KomgaComponents } from "#imports";
import type { TypedPathParameter } from "#build/typed-router/__paths";

export enum ItemShowContext {
  RELEASE_DATE = "RELEASE_DATE",
  DATE_ADDED = "DATE_ADDED",
  DATE_UPDATED = "DATE_UPDATED",
  FILE_SIZE = "FILE_SIZE",
  SHOW_SERIES = "SHOW_SERIES",
  READ_DATE = "READ_DATE",
}

export type KomgaBookWrapped = {
  type: "book";
  result: KomgaComponents["schemas"]["BookDto"];
};

export type KomgaSeriesWrapped = {
  type: "series";
  result: KomgaComponents["schemas"]["SeriesDto"];
};

export type KomgaCollectionWrapped = {
  type: "collection";
  result: KomgaComponents["schemas"]["CollectionDto"];
};

export type KomgaReadListWrapped = {
  type: "readlist";
  result: KomgaComponents["schemas"]["ReadListDto"];
};

type KomgaItem =
  | KomgaBookWrapped["result"]
  | KomgaSeriesWrapped["result"]
  | KomgaCollectionWrapped["result"]
  | KomgaReadListWrapped["result"];

export type KomgaItemWrapped =
  | KomgaBookWrapped
  | KomgaSeriesWrapped
  | KomgaCollectionWrapped
  | KomgaReadListWrapped;

export type KomgaSearchWrapped = {
  type: "search";
  result: {
    id: "SEARCH_ALL";
    name: string;
  };
};

export type KomgaSearchHeaderWrapped = {
  type: "header";
  result: {
    id: string;
    name: string;
  };
};

export interface ExtendedKomgaItemWrapped<
  I extends KomgaItem,
  T extends KomgaItemWrapped["type"],
  S extends string,
> {
  type: T;
  item: I;
  targetUrl: TypedPathParameter<S>;
  thumbnailUrl: string;
  title: (item: I, context?: ItemShowContext[]) => string;
}

export interface ItemTitleContext<S extends string> {
  title: string;
  targetUrl: TypedPathParameter<S>;
}

export abstract class ItemData<T extends KomgaItem, I extends KomgaItemWrapped["type"], S extends string> {
  item: T;
  type: I;

  constructor(item: T, type: I) {
    this.item = item;
    this.type = type;
  }

  abstract get thumbnailUrl(): string;
  abstract title(context?: ItemShowContext[]): ItemTitleContext<S>[];
  abstract get to(): TypedPathParameter<S>;
  abstract get fabTo(): TypedPathParameter<S> | undefined;
}

export class ItemBookData extends ItemData<
  KomgaBookWrapped["result"],
  "book",
  `/book/${string}` | `/series/${string}` | `/oneshot/${string}` | `/book/${string}/read`
> {
  get thumbnailUrl(): string {
    return this.item.oneshot ? seriesThumbnailURL(this.item.seriesId) : bookThumbnailURL(this.item.id);
  }

  get to(): TypedPathParameter<`/book/${string}` | `/oneshot/${string}`> {
    return this.item.oneshot ? `/oneshot/${this.item.id}` : `/book/${this.item.id}`;
  }

  get fabTo(): TypedPathParameter<`/book/${string}/read`> {
    return `/book/${this.item.id}/read`;
  }

  title(
    context?: ItemShowContext[] | undefined
  ): ItemTitleContext<`/book/${string}` | `/series/${string}` | `/oneshot/${string}`>[] {
    if (this.item.oneshot) {
      return [
        {
          title: this.item.metadata.title,
          targetUrl: this.to,
        },
      ];
    }

    if (context && context.includes(ItemShowContext.SHOW_SERIES)) {
      return [
        {
          title: this.item.seriesTitle,
          targetUrl: `/series/${this.item.seriesId}`,
        },
        {
          title: `${this.item.metadata.number} - ${this.item.metadata.title}`,
          targetUrl: this.to,
        },
      ];
    }

    return [
      {
        title: `${this.item.metadata.number} - ${this.item.metadata.title}`,
        targetUrl: this.to,
      },
    ];
  }
}

export class ItemSeriesData extends ItemData<
  KomgaSeriesWrapped["result"],
  "series",
  `/series/${string}` | `/oneshot/${string}`
> {
  get thumbnailUrl(): string {
    return seriesThumbnailURL(this.item.id);
  }

  get to(): TypedPathParameter<`/series/${string}` | `/oneshot/${string}`> {
    return this.item.oneshot ? `/oneshot/${this.item.id}` : `/series/${this.item.id}`;
  }

  get fabTo(): undefined {
    return;
  }

  title(): ItemTitleContext<`/series/${string}` | `/oneshot/${string}`>[] {
    return [
      {
        title: this.item.metadata.title,
        targetUrl: this.to,
      },
    ];
  }
}

export class ItemCollectionData extends ItemData<
  KomgaCollectionWrapped["result"],
  "collection",
  `/collection/${string}`
> {
  get thumbnailUrl(): string {
    return collectionThumbnailURL(this.item.id);
  }

  get to(): TypedPathParameter<`/collection/${string}`> {
    return `/collection/${this.item.id}`;
  }

  get fabTo(): undefined {
    return;
  }

  title(): ItemTitleContext<`/collection/${string}`>[] {
    return [
      {
        title: this.item.name,
        targetUrl: this.to,
      },
    ];
  }
}

export class ItemReadListData extends ItemData<
  KomgaReadListWrapped["result"],
  "readlist",
  `/readlist/${string}`
> {
  get thumbnailUrl(): string {
    return readListThumbnailURL(this.item.id);
  }

  get to(): TypedPathParameter<`/readlist/${string}`> {
    return `/readlist/${this.item.id}`;
  }

  get fabTo(): undefined {
    return;
  }

  title(): ItemTitleContext<`/readlist/${string}`>[] {
    return [
      {
        title: this.item.name,
        targetUrl: this.to,
      },
    ];
  }
}

export function makeItemData(item: KomgaItemWrapped) {
  switch (item.type) {
    case "book": {
      return new ItemBookData(item.result, item.type);
    }
    case "series": {
      return new ItemSeriesData(item.result, item.type);
    }
    case "collection": {
      return new ItemCollectionData(item.result, item.type);
    }
    case "readlist": {
      return new ItemReadListData(item.result, item.type);
    }
  }
}

const fsFormat = partialFilesize({ round: 1, standard: "si" });

export function formatFileSize(size?: number) {
  if (!size) {
    return "0 B";
  }

  return fsFormat(size);
}
