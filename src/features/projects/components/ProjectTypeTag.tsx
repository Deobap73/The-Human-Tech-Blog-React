// /src/features/projects/components/ProjectTypeTag.tsx
'use strict';

import React from 'react';
import type { Project } from '../../../shared/types/Project';
import '../styles/ProjectTypeTag.scss';

interface ProjectTypeTagProps {
  type: Project['type'];
  source?: Project['source'];
}

/**
 * ProjectTypeTag
 * - Tiny visual chip that displays the project type ("frontend-ui", "ux-figma", "full")
 * - Optionally shows the source ("figma" | "github" | "mixed") next to the type
 * - Keeps labels minimal for a clean card header
 */
const ProjectTypeTag: React.FC<ProjectTypeTagProps> = ({ type, source }) => {
  const typeLabel =
    type === 'frontend-ui'
      ? 'Frontend UI'
      : type === 'ux-figma'
        ? 'UX · Figma'
        : type === 'automation'
          ? 'Automation'
          : 'Full Project';

  const sourceLabel =
    source === 'figma'
      ? 'Figma'
      : source === 'github'
        ? 'GitHub'
        : source === 'mixed'
          ? 'Mixed'
          : null;

  return (
    <div className='projectTypeTag' aria-label='Project type'>
      <span className={`projectTypeTag__pill projectTypeTag__pill--${type}`}>{typeLabel}</span>
      {sourceLabel && <span className='projectTypeTag__source'>· {sourceLabel}</span>}
    </div>
  );
};

export default ProjectTypeTag;
