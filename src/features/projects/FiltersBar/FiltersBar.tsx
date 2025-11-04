// /src/features/projects/FiltersBar/FiltersBar.tsx

'use strict';

import React, { useId } from 'react';
import './FiltersBar.scss';

export type SortOption = 'newest' | 'oldest' | 'az' | 'za';

export interface FiltersBarProps {
  search: string;
  onSearch: (value: string) => void;

  sort: SortOption;
  onSort: (value: SortOption) => void;

  /** Available tags to show */
  tags?: string[];
  /** Currently active tags */
  activeTags?: string[];
  /** Toggle one tag in/out of the selection */
  onToggleTag?: (tag: string) => void;

  /** Compact grid toggle (true => denser grid/cards/pagination) */
  compact: boolean;
  onToggleCompact: (value: boolean) => void;
}

/**
 * FiltersBar
 * - Stack on mobile, inline ≥768px.
 * - Accessible: labels, legends, aria-pressed for tags.
 * - Adds a "Compact grid" toggle to control density.
 */
const FiltersBar: React.FC<FiltersBarProps> = ({
  search,
  onSearch,
  sort,
  onSort,
  tags = [],
  activeTags = [],
  onToggleTag,
  compact,
  onToggleCompact,
}) => {
  const formId = useId();
  const legendId = `${formId}-legend`;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearch(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSort(e.target.value as SortOption);
  };

  return (
    <section className='filters' aria-labelledby={legendId}>
      <form className='filters__form' role='search' onSubmit={(e) => e.preventDefault()}>
        <fieldset className='filters__set'>
          <legend id={legendId} className='filters__legend'>
            Filtrar projetos
          </legend>

          {/* Search */}
          <div className='filters__row'>
            <label htmlFor={`${formId}-q`} className='filters__label'>
              Procurar
            </label>
            <div className='filters__searchWrap'>
              <input
                id={`${formId}-q`}
                className='filters__search'
                type='search'
                inputMode='search'
                placeholder='Pesquisar por título, stack…'
                value={search}
                onChange={handleSearchChange}
                aria-describedby={`${formId}-q-hint`}
              />
              {search.length > 0 && (
                <button
                  type='button'
                  className='filters__clear'
                  aria-label='Limpar pesquisa'
                  onClick={() => onSearch('')}>
                  ×
                </button>
              )}
            </div>
            <small id={`${formId}-q-hint`} className='filters__hint'>
              Pressione Enter para confirmar ou use as opções de ordenação.
            </small>
          </div>

          {/* Sort */}
          <div className='filters__row'>
            <label htmlFor={`${formId}-sort`} className='filters__label'>
              Ordenar
            </label>
            <select
              id={`${formId}-sort`}
              className='filters__select'
              value={sort}
              onChange={handleSortChange}>
              <option value='newest'>Mais recentes</option>
              <option value='oldest'>Mais antigos</option>
              <option value='az'>A–Z</option>
              <option value='za'>Z–A</option>
            </select>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className='filters__row'>
              <span className='filters__label'>Tags</span>
              <div className='filters__tags' role='group' aria-label='Filtrar por tags'>
                {tags.map((tag) => {
                  const active = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type='button'
                      className={`filters__tag ${active ? 'filters__tag--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => onToggleTag?.(tag)}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compact toggle */}
          <div className='filters__row'>
            <span className='filters__label'>Layout</span>
            <div className='filters__toggle'>
              <input
                id={`${formId}-compact`}
                className='filters__switch'
                type='checkbox'
                role='switch'
                aria-checked={compact}
                checked={compact}
                onChange={(e) => onToggleCompact(e.target.checked)}
              />
              <label htmlFor={`${formId}-compact`} className='filters__switchLabel'>
                Compact grid
              </label>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default FiltersBar;
