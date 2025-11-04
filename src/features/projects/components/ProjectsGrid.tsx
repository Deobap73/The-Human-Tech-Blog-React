'use strict';

/**
 * Path: /src/features/projects/components/ProjectsGrid.tsx
 */

import React, { PropsWithChildren } from 'react';
import '../styles/ProjectsGrid.scss';

interface ProjectsGridProps extends PropsWithChildren {
  labelledById?: string;
}

/**
 * ProjectsGrid
 * - Simple semantic wrapper for project cards grid.
 * - Keeps the same class used by previous styles: "projectsGrid".
 */
const ProjectsGrid: React.FC<ProjectsGridProps> = ({ children, labelledById }) => {
  return (
    <div className='projectsGrid' role='grid' aria-labelledby={labelledById}>
      {children}
    </div>
  );
};

export default ProjectsGrid;
