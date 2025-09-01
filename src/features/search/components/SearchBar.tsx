// src/features/search/components/SearchBar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import '../styles/SearchBar.scss';

const SearchBar = () => {
  // Local UI state
  const [query, setQuery] = useState<string>('');
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false);

  // Router + i18n
  const navigate = useNavigate();
  const params = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation();

  // Derive current lang from URL param (preferred), otherwise from i18n, fallback 'en'
  const currentLang: string = (params.lang || i18n.language || 'en').split('-')[0];

  // Ref for the main search bar container
  const searchBarRef = useRef<HTMLDivElement>(null);

  /**
   * Handles submit of the search form.
   * Always closes the input and clears query after submit click,
   * regardless of whether a search was performed.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const trimmed = query.trim();
    if (trimmed.length > 0) {
      // IMPORTANT: respect multilanguage routes -> '/:lang/search?q=...'
      navigate(`/${encodeURIComponent(currentLang)}/search?q=${encodeURIComponent(trimmed)}`);
    }

    // Reset UI state after handling submit
    setQuery('');
    setIsInputOpen(false);
  };

  /**
   * Toggles the visibility of the input.
   * When explicitly closing, we clear the current query.
   */
  const toggleInput = (): void => {
    setIsInputOpen((prev) => {
      if (prev === true) {
        setQuery('');
      }
      return !prev;
    });
  };

  /**
   * Close the input if user clicks outside of the searchBar container.
   * Excludes clicks on the main GoSearch icon.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!isInputOpen) return;

      const container = searchBarRef.current;
      const target = event.target as Node | null;

      const clickedMainIcon = target instanceof SVGElement && !!target.closest('.search-bar__icon');

      if (container && target && !container.contains(target) && !clickedMainIcon) {
        setIsInputOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInputOpen]);

  return (
    <div
      className={`search-bar ${isInputOpen ? 'search-bar--open' : ''}`}
      ref={searchBarRef}
      role='search'
      aria-label={t('searchBar.ariaLabel', { defaultValue: 'Site search' })}>
      {/* Magnifier icon toggles input visibility */}
      <GoSearch
        className='search-bar__icon'
        onClick={toggleInput}
        size={20}
        aria-label={t('searchBar.open', { defaultValue: 'Open search' })}
      />

      {/* Collapsible search form */}
      <form className='search-bar__form' onSubmit={handleSubmit}>
        <input
          className='search-bar__input'
          type='text'
          placeholder={t('searchBar.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={isInputOpen}
          aria-label={t('searchBar.input', { defaultValue: 'Search query' })}
        />
        <button
          className='search-bar__icon'
          type='submit'
          aria-label={t('searchBar.submit', { defaultValue: 'Search' })}>
          <GoSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
