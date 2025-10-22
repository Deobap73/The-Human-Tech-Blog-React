// /src/features/admin/components/projects/AdminProjectsFilterBar.tsx
'use strict';

import React from 'react';
import '../../styles/AdminProjectsPage.scss';

interface Props {
  type: 'frontend-ui' | 'ux-figma' | 'full';
  onTypeChange: (t: 'frontend-ui' | 'ux-figma' | 'full') => void;
  search: string;
  onSearchChange: (v: string) => void;
  onBulkSyncGitHub: () => void;
  onBulkSyncFigma: () => void;
  selectionCount: number;
}

/**
 * AdminProjectsFilterBar
 * - Simple filter bar: tabs for type + search input
 * - Bulk actions enabled when selectionCount > 0
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
  return (
    <div className='adminProjects__filter'>
      <div className='adminProjects__tabs' role='tablist' aria-label='Project Type'>
        {(['frontend-ui', 'ux-figma', 'full'] as const).map((t) => (
          <button
            key={t}
            role='tab'
            aria-selected={type === t}
            className={`adminProjects__tab${type === t ? ' adminProjects__tab--active' : ''}`}
            onClick={() => onTypeChange(t)}>
            {t === 'frontend-ui' ? 'Frontend UI' : t === 'ux-figma' ? 'UX · Figma' : 'Full'}
          </button>
        ))}
      </div>

      <div className='adminProjects__search'>
        <input
          type='text'
          className='adminProjects__search-input'
          placeholder='Search by title or tag...'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label='Search projects'
        />
      </div>

      <div className='adminProjects__bulk'>
        <button
          className='adminProjects__bulk-btn adminProjects__bulk-btn--github'
          disabled={selectionCount === 0}
          onClick={onBulkSyncGitHub}
          aria-disabled={selectionCount === 0}>
          Bulk Sync GitHub ({selectionCount})
        </button>
        <button
          className='adminProjects__bulk-btn adminProjects__bulk-btn--figma'
          disabled={selectionCount === 0}
          onClick={onBulkSyncFigma}
          aria-disabled={selectionCount === 0}>
          Bulk Sync Figma ({selectionCount})
        </button>
      </div>
    </div>
  );
};

export default AdminProjectsFilterBar;
