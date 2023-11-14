function thumbnailURL(id: string, type: string, thumbId?: string) {
  const { origin } = useKomgaServerUrl();

  if (thumbId) {
    return `${origin}/api/v1/${type}/${id}/thumbnails/${thumbId}`;
  }

  return `${origin}/api/v1/${type}/${id}/thumbnail`;
}

function downloadUrl(id: string, type: string) {
  const { origin } = useKomgaServerUrl();

  return `${origin}/api/v1/${type}/${id}/file`;
}

export function bookThumbnailURL(id: string, thumbId?: string) {
  return thumbnailURL(id, "books", thumbId);
}

export function seriesThumbnailURL(id: string, thumbId?: string) {
  return thumbnailURL(id, "series", thumbId);
}

export function collectionThumbnailURL(id: string, thumbId?: string) {
  return thumbnailURL(id, "collections", thumbId);
}

export function readListThumbnailURL(id: string, thumbId?: string) {
  return thumbnailURL(id, "readlists", thumbId);
}

export function bookFileURL(id: string) {
  return downloadUrl(id, "books");
}

export function seriesFileURL(id: string) {
  return downloadUrl(id, "series");
}

export function bookPageUrl(bookId: string, page: number, convertTo?: string, thumbnail?: boolean): string {
  const { origin } = useKomgaServerUrl();

  let url = `${origin}/api/v1/books/${bookId}/pages/${page}`;

  if (thumbnail) {
    return `${url}/thumbnail`;
  }

  if (convertTo && !thumbnail) {
    url += `?convert=${convertTo}`;
  }

  return url;
}
