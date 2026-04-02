import { useState } from 'react';
import type { FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  disabled: boolean;
}

function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed === '') return;
    onSearch(trimmed);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="search-label">
        キーワードで書籍を検索
      </label>
      <div className="search-controls">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワードを入力..."
          disabled={disabled}
          className="search-input"
        />
        <button
          type="submit"
          disabled={disabled || query.trim() === ''}
          className="search-button"
        >
          検索
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
