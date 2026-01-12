// /src/features/projects/FeaturedProjects/FeaturedProjects.tsx
'use strict';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ProjectsGrid from '../ProjectsGrid/ProjectsGrid';
import type { ProjectGridItem } from '../ProjectsGrid/ProjectsGrid';
import './FeaturedProjects.scss';

type Props = {
  items: ProjectGridItem[];
  compact?: boolean;
};

const FeaturedProjects: React.FC<Props> = ({ items, compact = false }) => {
  const { t } = useTranslation();
  if (!items || items.length === 0) return null;

  return (
    <section
      className='featuredProjects'
      aria-label={t('projectsBrand.featured', 'Featured projects')}>
      <div className='featuredProjects__head'>
        <h2 className='featuredProjects__title'>
          {t('projectsBrand.featuredTitle', 'Featured projects')}
        </h2>
        <p className='featuredProjects__subtitle'>
          {t('projectsBrand.featuredSubtitle', 'A few projects that describe the brand well.')}
        </p>
      </div>

      <ProjectsGrid
        items={items}
        compact={compact}
        className='featuredProjects__grid'
        emptyText={t('projectsBrand.noFeatured', 'No featured projects right now.')}
      />
    </section>
  );
};

export default FeaturedProjects;
