import type { Book, SearchResponse } from '@app/shared/types';

// ---- 型ガード（実行時バリデーション用） ----

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is string => typeof item === 'string')
  );
}

// ---- HTMLタグ除去（XSS対策） ----

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

// ---- Google Books API レスポンスのパース ----

function parseVolumeInfo(
  volumeInfo: Record<string, unknown>,
): Omit<Book, 'id'> {
  const title = isString(volumeInfo['title']) ? volumeInfo['title'] : 'タイトル不明';

  const authors: string[] = isStringArray(volumeInfo['authors'])
    ? volumeInfo['authors']
    : [];

  const publisher: string | null = isString(volumeInfo['publisher'])
    ? volumeInfo['publisher']
    : null;

  const publishedDate: string | null = isString(volumeInfo['publishedDate'])
    ? volumeInfo['publishedDate']
    : null;

  let description: string | null = null;
  if (isString(volumeInfo['description'])) {
    description = stripHtmlTags(volumeInfo['description']);
  }

  let thumbnailUrl: string | null = null;
  const imageLinks = volumeInfo['imageLinks'];
  if (isRecord(imageLinks) && isString(imageLinks['thumbnail'])) {
    thumbnailUrl = imageLinks['thumbnail'];
  }

  return { title, authors, publisher, publishedDate, description, thumbnailUrl };
}

function parseGoogleBooksResponse(data: unknown): SearchResponse {
  if (!isRecord(data)) {
    throw new Error('Invalid response: expected an object');
  }

  const totalItems = data['totalItems'];
  if (!isNumber(totalItems)) {
    throw new Error('Invalid response: totalItems is missing or not a number');
  }

  const items = data['items'];
  const books: Book[] = [];

  if (Array.isArray(items)) {
    for (const item of items) {
      if (!isRecord(item)) continue;

      const id = item['id'];
      if (!isString(id)) continue;

      const volumeInfo = item['volumeInfo'];
      if (!isRecord(volumeInfo)) continue;

      books.push({ id, ...parseVolumeInfo(volumeInfo) });
    }
  }

  return { books, totalItems };
}

// ---- Service 公開関数 ----

export async function searchBooks(
  query: string,
  apiKey: string,
): Promise<SearchResponse> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', '10');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `Google Books API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  return parseGoogleBooksResponse(data);
}
