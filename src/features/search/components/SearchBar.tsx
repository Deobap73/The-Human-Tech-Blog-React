// The-Human-Tech-Blog-React/src/features/search/components/SearchBar.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className='search-bar' onSubmit={handleSubmit}>
      <input
        className='search-bar__input'
        type='text'
        placeholder='Search posts...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className='search-bar__button' type='submit'>
        🔍
      </button>
    </form>
  );
};

export default SearchBar;
