'use strict';

/**
 * Path: /src/features/projects/components/FiltersBar.tsx
 */

import React, { useEffect, useState } from 'react';
import type { Project } from '../../../shared/types/Project';
import '../styles/FiltersBar.scss';

export type ProjectTab = Project['type'];

interface FiltersBarProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * FiltersBar
 * - Tabs for project type + Search input.
 * - Extracted from the original ProjectsFilterBar (pages) to components.
 * - Visuals aligned to "Figma to code" bar, but using blog tokens.
 */
const FiltersBar: React.FC<FiltersBarProps> = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}) => {
  const [query, setQuery] = useState<string>(search);

  // Sync local state if external search changes
  useEffect(() => {
    setQuery(search);
  }, [search]);

  const tabs: Array<{ key: ProjectTab; label: string }> = [
    { key: 'frontend-ui', label: 'Frontend UI' },
    { key: 'ux-figma', label: 'UX · Figma' },
    { key: 'full', label: 'Full Projects' },
  ];

  return (
    <div className='filtersBar' role='region' aria-label='Projects filters'>
      <div className='filtersBar__tabs' role='tablist' aria-label='Project types'>
        {tabs.map((t) => (
          <button
            key={t.key}
            role='tab'
            aria-selected={activeTab === t.key}
            className={`filtersBar__tab${activeTab === t.key ? ' filtersBar__tab--active' : ''}`}
            onClick={() => onTabChange(t.key)}
            type='button'>
            {t.label}
          </button>
        ))}
      </div>

      <div className='filtersBar__search'>
        <label htmlFor='filtersBar__input' className='filtersBar__label'>
          Search
        </label>
        <input
          id='filtersBar__input'
          type='search'
          className='filtersBar__input'
          placeholder='Search by title or tag…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchChange(query.trim());
            }
          }}
        />
        <button
          className='filtersBar__button'
          aria-label='Apply search'
          type='button'
          onClick={() => onSearchChange(query.trim())}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FiltersBar;
