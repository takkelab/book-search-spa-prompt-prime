import type { Book } from '@app/shared/types';

interface BookCardProps {
  book: Book;
}

function truncateDescription(description: string | null): string {
  if (description === null) return '';
  if (description.length <= 150) return description;
  return description.slice(0, 150) + '...';
}

function BookCard({ book }: BookCardProps) {
  const authorsText =
    book.authors.length > 0 ? book.authors.join(', ') : '不明';
  const publisherText = book.publisher ?? '不明';
  const publishedDateText = book.publishedDate ?? '不明';
  const descriptionText = truncateDescription(book.description);

  return (
    <article className="book-card">
      <div className="book-thumbnail">
        {book.thumbnailUrl !== null ? (
          <img src={book.thumbnailUrl} alt={book.title} />
        ) : (
          <div className="no-image" aria-label="No Image">
            No Image
          </div>
        )}
      </div>
      <div className="book-info">
        <h2 className="book-title">{book.title}</h2>
        <dl className="book-details">
          <dt>著者</dt>
          <dd>{authorsText}</dd>
          <dt>出版社</dt>
          <dd>{publisherText}</dd>
          <dt>出版日</dt>
          <dd>{publishedDateText}</dd>
        </dl>
        {descriptionText !== '' && (
          <p className="book-description">{descriptionText}</p>
        )}
      </div>
    </article>
  );
}

export default BookCard;
