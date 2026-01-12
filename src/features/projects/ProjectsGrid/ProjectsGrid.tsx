// /src/features/projects/ProjectsGrid/ProjectsGrid.tsx
'use strict';

import React from 'react';
import './ProjectsGrid.scss';
import ProjectCard, { ProjectCardProps } from '../ProjectCard/ProjectCard';

export interface ProjectGridItem extends Omit<ProjectCardProps, 'className'> {
  id: string;
}

export interface ProjectsGridProps {
  items: ProjectGridItem[];
  emptyText?: string;
  className?: string;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  items,
  emptyText = 'Sem projetos para mostrar com os filtros atuais.',
  className = '',
}) => {
  const rootCls = ['projGrid', 'projGrid--compact', className].filter(Boolean).join(' ');

  if (!items || items.length === 0) {
    return (
      <section className={rootCls} aria-live='polite'>
        <div className='projGrid__empty' role='status'>
          <p className='projGrid__emptyText'>{emptyText}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={rootCls} aria-label='Lista de projetos'>
      <div className='projGrid__grid'>
        {items.map(({ id, ...card }) => (
          <div key={id} className='projGrid__cell'>
            <ProjectCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsGrid;
