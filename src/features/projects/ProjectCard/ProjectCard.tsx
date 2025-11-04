// src/features/projects/ProjectCard/ProjectCard.tsx

'use strict';

import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            <LinkBtn
              href={links.live}
              label={t('projectsPage.live')}
              variant='primary'
              aria={t('projectsPage.live')}
            />
          )}
          {links?.repo && (
            <LinkBtn
              href={links.repo}
              label={t('projectsPage.github')}
              variant='secondary'
              aria={t('projectsPage.github')}
            />
          )}
          {links?.details && (
            <LinkBtn
              href={links.details}
              label={t('projectsPage.details')}
              variant='ghost'
              aria={t('projectsPage.details')}
            />
          )}
        </footer>
      )}
    </article>
  );
};

export default ProjectCard;
