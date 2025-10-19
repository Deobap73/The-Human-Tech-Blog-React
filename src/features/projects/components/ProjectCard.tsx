// /src/features/projects/components/ProjectCard.tsx
'use strict';

import React from 'react';
import type { Project } from '../../../shared/types/Project';
import '../styles/ProjectCard.scss';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const { coverImage, title, excerpt, tags, links } = project;

  return (
    <div className='projectCard'>
      {coverImage && (
        <div className='projectCard__image-wrapper'>
          <img src={coverImage} alt={title} className='projectCard__image' />
        </div>
      )}

      <div className='projectCard__content'>
        <h3 className='projectCard__title'>{title}</h3>
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
    </div>
  );
};

export default ProjectCard;
