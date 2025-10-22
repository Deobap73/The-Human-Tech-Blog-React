// /src/features/projects/components/ProjectCard.tsx
'use strict';

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Project } from '../../../shared/types/Project';
import ProjectTypeTag from './ProjectTypeTag';
import '../styles/ProjectCard.scss';

interface Props {
  project: Project;
}

/**
 * ProjectCard
 * - Shows cover, title, excerpt, tags and a type/source chip
 * - Primary CTA navigates to the local detail route `/:lang/projects/:slug`
 * - External links remain available as secondary actions
 */
const ProjectCard: React.FC<Props> = ({ project }) => {
  const { lang } = useParams<{ lang: string }>();
  const { coverImage, title, excerpt, tags, links, slug, type, source } = project;

  const detailHref = `/${lang || 'en'}/projects/${slug}`;

  // Contextual CTA label (keeps it subtle; main action is details page)
  const primaryCta = 'View details';

  return (
    <article className='projectCard'>
      <Link to={detailHref} className='projectCard__image-wrapper' aria-label={`Open ${title}`}>
        {coverImage ? (
          <img src={coverImage} alt={title} className='projectCard__image' />
        ) : (
          <div className='projectCard__image projectCard__image--placeholder' />
        )}
      </Link>

      <div className='projectCard__content'>
        <div className='projectCard__header'>
          <ProjectTypeTag type={type} source={source} />
        </div>

        <h3 className='projectCard__title'>
          <Link to={detailHref} className='projectCard__title-link'>
            {title}
          </Link>
        </h3>

        {excerpt && <p className='projectCard__description'>{excerpt}</p>}

        {tags && tags.length > 0 && (
          <ul className='projectCard__tags'>
            {tags.map((tag) => (
              <li key={tag} className='projectCard__tag'>
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className='projectCard__cta'>
          <Link to={detailHref} className='projectCard__button'>
            {primaryCta}
          </Link>
        </div>

        <div className='projectCard__links'>
          {links?.github && (
            <a
              href={links.github}
              className='projectCard__link projectCard__link--github'
              target='_blank'
              rel='noopener noreferrer'>
              GitHub
            </a>
          )}
          {links?.figma && (
            <a
              href={links.figma}
              className='projectCard__link projectCard__link--figma'
              target='_blank'
              rel='noopener noreferrer'>
              Figma
            </a>
          )}
          {links?.live && (
            <a
              href={links.live}
              className='projectCard__link projectCard__link--live'
              target='_blank'
              rel='noopener noreferrer'>
              Live
            </a>
          )}
          {links?.blog && (
            <a
              href={links.blog}
              className='projectCard__link projectCard__link--article'
              target='_blank'
              rel='noopener noreferrer'>
              Article
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
