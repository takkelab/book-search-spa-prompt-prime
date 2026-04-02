import type { Book, SearchResponse } from '@app/shared/types';

// ---- 型ガード（バックエンドAPIレスポンスの実行時バリデーション） ----

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is string => typeof item === 'string')
  );
}

function isBook(value: unknown): value is Book {
  if (!isRecord(value)) return false;
  return (
    isString(value['id']) &&
    isString(value['title']) &&
    isStringArray(value['authors']) &&
    isNullableString(value['publisher']) &&
    isNullableString(value['publishedDate']) &&
    isNullableString(value['description']) &&
    isNullableString(value['thumbnailUrl'])
  );
}

export function isSearchResponse(value: unknown): value is SearchResponse {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value['books']) &&
    value['books'].every(isBook) &&
    isNumber(value['totalItems'])
  );
}
