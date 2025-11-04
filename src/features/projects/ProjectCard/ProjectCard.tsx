// src/features/projects/ProjectCard/ProjectCard.tsx

'use strict';

import React from 'react';
import './ProjectCard.scss';

export interface ProjectLinks {
  live?: string;
  repo?: string;
  details?: string;
}

export interface ProjectCardProps {
  title: string;
  subtitle?: string;
  excerpt?: string;
  imageSrc?: string;
  imageAlt?: string;
  tags?: string[];
  links?: ProjectLinks;
  ariaLabel?: string;
  className?: string;
}

/**
 * ProjectCard
 * - Standalone card with internal link buttons, no external Button dependency.
 * - 16:9 image wrapper, tags list, and footer actions.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  subtitle,
  excerpt,
  imageSrc,
  imageAlt = '',
  tags = [],
  links,
  ariaLabel,
  className = '',
}) => {
  const rootCls = ['projectCard', className].filter(Boolean).join(' ');

  const Title: React.FC = () =>
    links?.details ? (
      <h3 className='projectCard__title'>
        <a className='projectCard__titleLink' href={links.details}>
          {title}
        </a>
      </h3>
    ) : (
      <h3 className='projectCard__title'>{title}</h3>
    );

  const LinkBtn: React.FC<{
    href: string;
    label: string;
    variant: 'primary' | 'secondary' | 'ghost';
    aria: string;
  }> = ({ href, label, variant, aria }) => (
    <a className={`projectCard__btn projectCard__btn--${variant}`} href={href} aria-label={aria}>
      {label}
    </a>
  );

  return (
    <article className={rootCls} aria-label={ariaLabel || title}>
      {imageSrc && (
        <figure className='projectCard__media'>
          <img className='projectCard__img' src={imageSrc} alt={imageAlt} />
        </figure>
      )}

      <div className='projectCard__body'>
        <header className='projectCard__header'>
          <Title />
          {subtitle && <p className='projectCard__subtitle'>{subtitle}</p>}
        </header>

        {excerpt && <p className='projectCard__excerpt'>{excerpt}</p>}

        {tags.length > 0 && (
          <ul className='projectCard__tags' aria-label='Tecnologias utilizadas'>
            {tags.map((tag) => (
              <li key={tag} className='projectCard__tag'>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(links?.live || links?.repo || links?.details) && (
        <footer className='projectCard__footer' aria-label='Ações do projeto'>
          {links?.live && (
            <LinkBtn href={links.live} label='Live' variant='primary' aria='Abrir demonstração' />
          )}
          {links?.repo && (
            <LinkBtn
              href={links.repo}
              label='GitHub'
              variant='secondary'
              aria='Abrir repositório'
            />
          )}
          {links?.details && (
            <LinkBtn href={links.details} label='Detalhes' variant='ghost' aria='Ver detalhes' />
          )}
        </footer>
      )}
    </article>
  );
};

export default ProjectCard;
