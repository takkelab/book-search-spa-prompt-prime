import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useBookSearch } from './hooks/useBookSearch';

function App() {
  const { books, loading, error, hasSearched, search } = useBookSearch();

  return (
    <div className="app">
      <header className="header">
        <h1>書籍検索</h1>
      </header>
      <main className="main">
        <SearchBar onSearch={search} disabled={loading} />
        <section aria-live="polite">
          {loading && <LoadingSpinner />}
          {!loading && error !== null && <ErrorMessage message={error} />}
          {!loading && error === null && hasSearched && books.length === 0 && (
            <p className="empty-message">該当する書籍が見つかりませんでした</p>
          )}
          {!loading && error === null && books.length > 0 && (
            <BookList books={books} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
