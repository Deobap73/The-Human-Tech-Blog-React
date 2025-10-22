// /src/features/projects/pages/ProjectsFilterBar.tsx
'use strict';

import React, { useEffect, useState } from 'react';
import type { Project } from '../../../shared/types/Project';
import '../styles/ProjectsFilterBar.scss';

export type ProjectTab = Project['type'];

interface ProjectsFilterBarProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * ProjectsFilterBar
 * - Tabs to filter by project type (frontend-ui, ux-figma, full)
 * - Search input to filter by title/tags (delegated to backend via query param)
 */
const ProjectsFilterBar: React.FC<ProjectsFilterBarProps> = ({
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
    <div className='projectsFilter'>
      <div className='projectsFilter__tabs' role='tablist' aria-label='Project types'>
        {tabs.map((t) => (
          <button
            key={t.key}
            role='tab'
            aria-selected={activeTab === t.key}
            className={`projectsFilter__tab${
              activeTab === t.key ? ' projectsFilter__tab--active' : ''
            }`}
            onClick={() => onTabChange(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className='projectsFilter__search'>
        <label htmlFor='projectsFilter__input' className='projectsFilter__label'>
          Search
        </label>
        <input
          id='projectsFilter__input'
          type='search'
          className='projectsFilter__input'
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
          className='projectsFilter__button'
          aria-label='Apply search'
          onClick={() => onSearchChange(query.trim())}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default ProjectsFilterBar;
