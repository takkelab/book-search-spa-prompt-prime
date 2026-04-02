export interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  thumbnailUrl: string | null;
}

export interface SearchResponse {
  books: Book[];
  totalItems: number;
}
