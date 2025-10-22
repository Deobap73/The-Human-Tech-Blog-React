// /src/features/projects/components/ProjectCard.tsx
'use strict';

import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Project } from '../../../shared/types/Project';
import ProjectTypeTag from './ProjectTypeTag';
import '../styles/ProjectCard.scss';
import { fetchProjectBySlug } from '../../../shared/services/projectService';

interface Props {
  project: Project;
}

/**
 * ProjectCard
 * - Adds a tiny prefetch on hover/focus to warm browser/cache for detail.
 */
const ProjectCard: React.FC<Props> = ({ project }) => {
  const { lang } = useParams<{ lang: string }>();
  const { coverImage, title, excerpt, tags, links, slug, type, source } = project;
  const detailHref = `/${lang || 'en'}/projects/${slug}`;
  const abortRef = useRef<AbortController | null>(null);

  const prefetch = (): void => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      // Fire and forget; ignore errors
      void fetchProjectBySlug(slug, controller.signal);
    } catch {
      // ignore
    }
  };

  return (
    <article className='projectCard' onMouseEnter={prefetch} onFocus={prefetch}>
      <Link to={detailHref} className='projectCard__image-wrapper' aria-label={`Open ${title}`}>
        {coverImage ? (
          <img
            src={coverImage}
            alt={title || 'Project cover'}
            className='projectCard__image'
            loading='lazy'
            decoding='async'
          />
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
          <ul className='projectCard__tags' aria-label='Project tags'>
            {tags.map((tag) => (
              <li key={tag} className='projectCard__tag'>
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className='projectCard__cta'>
          <Link to={detailHref} className='projectCard__button'>
            View details
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
