export const LIBRARY_ADDED = "LibraryAdded";
export const LIBRARY_UPDATED = "LibraryChanged";
export const LIBRARY_DELETED = "LibraryDeleted";

export const SERIES_ADDED = "SeriesAdded";
export const SERIES_UPDATED = "SeriesChanged";
export const SERIES_DELETED = "SeriesDeleted";

export const BOOK_ADDED = "BookAdded";
export const BOOK_UPDATED = "BookChanged";
export const BOOK_DELETED = "BookDeleted";
export const BOOK_IMPORTED = "BookImported";

export const COLLECTION_ADDED = "CollectionAdded";
export const COLLECTION_UPDATED = "CollectionChanged";
export const COLLECTION_DELETED = "CollectionDeleted";

export const READ_LIST_ADDED = "ReadListAdded";
export const READ_LIST_UPDATED = "ReadListChanged";
export const READ_LIST_DELETED = "ReadListDeleted";

export const READ_PROGRESS_UPDATED = "ReadProgressChanged";
export const READ_PROGRESS_DELETED = "ReadProgressDeleted";
export const READ_PROGRESS_SERIES_UPDATED = "ReadProgressSeriesChanged";
export const READ_PROGRESS_SERIES_DELETED = "ReadProgressSeriesDeleted";

export const THUMBNAIL_BOOK_ADDED = "ThumbnailBookAdded";
export const THUMBNAIL_BOOK_DELETED = "ThumbnailBookDeleted";
export const THUMBNAIL_SERIES_ADDED = "ThumbnailSeriesAdded";
export const THUMBNAIL_SERIES_DELETED = "ThumbnailSeriesDeleted";
export const THUMBNAIL_COLLECTION_ADDED = "ThumbnailSeriesCollectionAdded";
export const THUMBNAIL_COLLECTION_DELETED = "ThumbnailSeriesCollectionDeleted";
export const THUMBNAIL_READ_LIST_ADDED = "ThumbnailReadListAdded";
export const THUMBNAIL_READ_LIST_DELETED = "ThumbnailReadListDeleted";

export const TASK_QUEUE_STATUS = "TaskQueueStatus";
export const SESSION_EXPIRED = "SessionExpired";

export interface KSSELibrary {
  libraryId: string;
}

export interface KSSESeries extends KSSELibrary {
  seriesId: string;
}

export interface KSSEBook extends KSSESeries {
  bookId: string;
}

export interface KSSEBookImport {
  bookId?: string | null;
  sourceFile: string;
  success: boolean;
  message: string | null;
}

export interface KSSECollection {
  collectionId: string;
  seriesIds: string[];
}

export interface KSSEReadList {
  readListId: string;
  bookIds: string[];
}

export interface KSSEReadProgress {
  bookId: string;
  userId: string;
}

export interface KSSEReadProgressSeries {
  seriesId: string;
  userId: string;
}

export interface KSSEThumbnailBook {
  bookId: string;
  seriesId: string;
  selected: boolean;
}

export interface KSSEThumbnailSeries {
  seriesId: string;
  selected: boolean;
}

export interface KSSEThumbnailCollection {
  collectionId: string;
  selected: boolean;
}

export interface KSSEThumbnailReadList {
  readListId: string;
  selected: boolean;
}

export interface KSSETaskQueue {
  count: number;
  countByType: Record<string, number>;
}

export interface KSSESessionExpired {
  userId: string;
}
