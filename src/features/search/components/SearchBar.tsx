// The-Human-Tech-Blog-React/src/features/search/components/SearchBar.tsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import '../styles/SearchBar.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isInputOpen, setIsInputOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const searchBarRef = useRef<HTMLDivElement>(null); // Ref for the main search bar div

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (query.trim()) {
      // Only navigate if there's a valid query
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    // ALWAYS close the input and clear the query after the submit button is clicked,
    // regardless of whether a search was performed or if the input was empty.
    setQuery('');
    setIsInputOpen(false);
  };

  const toggleInput = () => {
    setIsInputOpen((prev) => !prev);
    if (isInputOpen) {
      // If it was open and is now closing
      setQuery(''); // Clear the query when explicitly closing
    }
  };

  // Effect to handle clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the search bar is open AND the click is outside the searchBarRef element
      // AND the click target is NOT the initial GoSearch icon
      if (
        isInputOpen &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        !(event.target instanceof SVGElement && event.target.closest('.search-bar__icon')) // Exclude the main icon click itself
      ) {
        setIsInputOpen(false); // Close the input
        setQuery(''); // Clear the query
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInputOpen]); // Re-run effect when isInputOpen changes

  return (
    <div className={`search-bar ${isInputOpen ? 'search-bar--open' : ''}`} ref={searchBarRef}>
      {/* Ícone de lupa que alterna a visibilidade do input */}
      <GoSearch className='search-bar__icon' onClick={toggleInput} size={20} />

      {/* Formulário com input e botão que aparece/desaparece */}
      <form className='search-bar__form' onSubmit={handleSubmit}>
        <input
          className='search-bar__input'
          type='text'
          placeholder={t('searchBar.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={isInputOpen} // Auto-focus when it opens
        />
        {/* Submit button with GoSearch icon */}
        <button className='search-bar__icon' type='submit'>
          <GoSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
