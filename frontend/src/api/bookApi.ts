import type { SearchResponse } from '@app/shared/types';
import { isSearchResponse } from './validators';

// ---- カスタムエラークラス ----

export class NetworkError extends Error {
  constructor() {
    super('NetworkError');
    this.name = 'NetworkError';
  }
}

export class ServerError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number) {
    super(`ServerError: ${statusCode}`);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// ---- API クライアント ----

export async function searchBooks(query: string): Promise<SearchResponse> {
  let response: Response;

  try {
    response = await fetch(
      `/api/books/search?q=${encodeURIComponent(query)}`,
    );
  } catch {
    // fetch() 自体が失敗した場合はネットワークエラー
    throw new NetworkError();
  }

  if (response.status >= 500) {
    throw new ServerError(response.status);
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!isSearchResponse(data)) {
    throw new Error('サーバーから予期しない形式のレスポンスを受け取りました');
  }

  return data;
}
