// /src/features/admin/components/projects/AdminProjectsFilterBar.tsx
'use strict';

import React from 'react';
import type { ProjectType } from '../../../../shared/types/Project';
import '../../styles/AdminProjectsPage.scss';

interface Props {
  type: ProjectType;
  onTypeChange: (t: ProjectType) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onBulkSyncGitHub: () => void;
  onBulkSyncFigma: () => void;
  selectionCount: number;
}

/**
 * AdminProjectsFilterBar
 * - Tabs to switch project type + search input
 * - Bulk actions (GitHub / Figma) enabled only if selectionCount > 0
 * - Uses AdminProjectsPage.scss styles to keep visual consistency
 */
const AdminProjectsFilterBar: React.FC<Props> = ({
  type,
  onTypeChange,
  search,
  onSearchChange,
  onBulkSyncGitHub,
  onBulkSyncFigma,
  selectionCount,
}) => {
  const TABS: Readonly<ProjectType[]> = ['frontend-ui', 'ux-figma', 'full', 'automation'] as const;

  const getTabLabel = (t: ProjectType): string =>
    t === 'frontend-ui'
      ? 'Frontend UI'
      : t === 'ux-figma'
        ? 'UX · Figma'
        : t === 'automation'
          ? 'Automation'
          : 'Full';

  const disabled = selectionCount === 0;

  return (
    <div className='adminProjects__filter'>
      <div className='adminProjects__tabs' role='tablist' aria-label='Project type'>
        {TABS.map((t) => {
          const active = type === t;
          return (
            <button
              key={t}
              type='button'
              role='tab'
              aria-selected={active}
              className={`adminProjects__tab${active ? ' adminProjects__tab--active' : ''}`}
              onClick={() => onTypeChange(t)}>
              {getTabLabel(t)}
            </button>
          );
        })}
      </div>

      <div className='adminProjects__search'>
        <label htmlFor='adminProjectsSearch' className='visually-hidden'>
          Search projects
        </label>
        <input
          id='adminProjectsSearch'
          type='text'
          className='adminProjects__search-input'
          placeholder='Search by title or tag...'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label='Search projects'
          autoComplete='off'
        />
      </div>

      <div className='adminProjects__bulk' role='group' aria-label='Bulk actions'>
        <button
          type='button'
          className='adminProjects__bulk-btn adminProjects__bulk-btn--github'
          disabled={disabled}
          onClick={onBulkSyncGitHub}
          aria-disabled={disabled}
          title={disabled ? 'Select at least one project' : 'Sync selected projects with GitHub'}>
          Bulk Sync GitHub ({selectionCount})
        </button>
        <button
          type='button'
          className='adminProjects__bulk-btn adminProjects__bulk-btn--figma'
          disabled={disabled}
          onClick={onBulkSyncFigma}
          aria-disabled={disabled}
          title={disabled ? 'Select at least one project' : 'Sync selected projects with Figma'}>
          Bulk Sync Figma ({selectionCount})
        </button>
      </div>
    </div>
  );
};

export default AdminProjectsFilterBar;
