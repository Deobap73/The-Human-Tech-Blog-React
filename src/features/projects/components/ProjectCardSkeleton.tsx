// /src/features/projects/components/ProjectCardSkeleton.tsx
'use strict';

import React from 'react';
import '../styles/ProjectCardSkeleton.scss';

/**
 * ProjectCardSkeleton
 * - Simple skeleton block to avoid content flashes while loading.
 */
const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className='projectCardSkeleton' aria-hidden='true'>
      <div className='projectCardSkeleton__image' />
      <div className='projectCardSkeleton__line projectCardSkeleton__line--title' />
      <div className='projectCardSkeleton__line' />
      <div className='projectCardSkeleton__tags'>
        <span className='projectCardSkeleton__tag' />
        <span className='projectCardSkeleton__tag' />
        <span className='projectCardSkeleton__tag' />
      </div>
      <div className='projectCardSkeleton__line projectCardSkeleton__line--button' />
    </div>
  );
};

export default ProjectCardSkeleton;
