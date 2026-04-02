import { useState, useCallback } from 'react';
import type { Book } from '@app/shared/types';
import { searchBooks, NetworkError, ServerError } from '../api/bookApi';

interface BookSearchState {
  books: Book[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

interface UseBookSearchReturn extends BookSearchState {
  search: (query: string) => Promise<void>;
}

export function useBookSearch(): UseBookSearchReturn {
  const [state, setState] = useState<BookSearchState>({
    books: [],
    totalItems: 0,
    loading: false,
    error: null,
    hasSearched: false,
  });

  const search = useCallback(async (query: string): Promise<void> => {
    if (query.trim() === '') return;

    setState({
      books: [],
      totalItems: 0,
      loading: true,
      error: null,
      hasSearched: true,
    });

    try {
      const result = await searchBooks(query.trim());
      setState({
        books: result.books,
        totalItems: result.totalItems,
        loading: false,
        error: null,
        hasSearched: true,
      });
    } catch (err) {
      let errorMessage: string;

      if (err instanceof NetworkError) {
        errorMessage =
          '通信エラーが発生しました。ネットワーク接続を確認してください。';
      } else if (err instanceof ServerError) {
        errorMessage =
          'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。';
      } else {
        errorMessage = '予期しないエラーが発生しました。';
      }

      setState({
        books: [],
        totalItems: 0,
        loading: false,
        error: errorMessage,
        hasSearched: true,
      });
    }
  }, []);

  return { ...state, search };
}
