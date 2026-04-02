import type { Book } from '@app/shared/types';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
}

function BookList({ books }: BookListProps) {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;
