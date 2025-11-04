// /src/features/projects/FiltersBar/FiltersBar.tsx

'use strict';

import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import './FiltersBar.scss';

export type SortOption = 'newest' | 'oldest' | 'az' | 'za';

export interface FiltersBarProps {
  search: string;
  onSearch: (value: string) => void;
  sort: SortOption;
  onSort: (value: SortOption) => void;
  tags?: string[];
  activeTags?: string[];
  onToggleTag?: (tag: string) => void;
  compact: boolean;
  onToggleCompact: (value: boolean) => void;
}

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
  const { t } = useTranslation();

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
            {t('projectsPage.filter')}
          </legend>

          {/* Search */}
          <div className='filters__row'>
            <label htmlFor={`${formId}-q`} className='filters__label'>
              {t('projectsPage.search')}
            </label>
            <div className='filters__searchWrap'>
              <input
                id={`${formId}-q`}
                className='filters__search'
                type='search'
                inputMode='search'
                placeholder={t('projectsPage.searchPlaceholder')}
                value={search}
                onChange={handleSearchChange}
                aria-describedby={`${formId}-q-hint`}
              />
              {search.length > 0 && (
                <button
                  type='button'
                  className='filters__clear'
                  aria-label={t('common.clear') || 'Clear'}
                  onClick={() => onSearch('')}>
                  ×
                </button>
              )}
            </div>
            <small id={`${formId}-q-hint`} className='filters__hint'>
              {t('projectsPage.searchHint')}
            </small>
          </div>

          {/* Sort */}
          <div className='filters__row'>
            <label htmlFor={`${formId}-sort`} className='filters__label'>
              {t('projectsPage.order')}
            </label>
            <select
              id={`${formId}-sort`}
              className='filters__select'
              value={sort}
              onChange={handleSortChange}>
              <option value='newest'>{t('projectsPage.newest')}</option>
              <option value='oldest'>{t('projectsPage.oldest')}</option>
              <option value='az'>{t('projectsPage.az')}</option>
              <option value='za'>{t('projectsPage.za')}</option>
            </select>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className='filters__row'>
              <span className='filters__label'>{t('projectsPage.tags')}</span>
              <div className='filters__tags' role='group' aria-label={t('projectsPage.tags')}>
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
            <span className='filters__label'>{t('projectsPage.layout')}</span>
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
                {t('projectsPage.compact')}
              </label>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default FiltersBar;
