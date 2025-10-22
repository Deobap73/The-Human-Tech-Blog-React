// /src/features/projects/components/ProjectsEmptyState.tsx
'use strict';

import React from 'react';
import '../styles/ProjectsEmptyState.scss';

interface Props {
  onClear?: () => void;
  message?: string;
}

/**
 * ProjectsEmptyState
 * - Friendly empty state for "no results".
 */
const ProjectsEmptyState: React.FC<Props> = ({ onClear, message }) => {
  return (
    <div className='projectsEmpty'>
      <h3 className='projectsEmpty__title'>{message ?? 'No projects found for this filter.'}</h3>
      <p className='projectsEmpty__hint'>Try removing filters or changing the search terms.</p>
      {onClear && (
        <button className='projectsEmpty__button' onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
};

export default ProjectsEmptyState;
