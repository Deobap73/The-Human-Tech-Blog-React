// /src/features/projects/pages/ProjectDetailPage.tsx

'use strict';

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProjectDetailPage.scss'; // ← caminho corrigido
import type { Project as BaseProject } from '../../../shared/types/Project';
import { fetchProjectBySlug } from '../../../shared/services/projectService';
import Loader from '../../../shared/components/Loader';
import FigmaEmbed from '../components/FigmaEmbed';
import GitHubMeta from '../components/GitHubMeta';

// Extende o tipo do frontend com os campos opcionais vindos do backend
type ProjectDetail = BaseProject & {
  source?: 'figma' | 'github' | 'mixed';
  meta?: {
    github?: {
      repo?: string;
      stars?: number;
      lastCommitAt?: string;
      topics?: string[];
      description?: string;
    };
  };
};

const ProjectDetailPage: React.FC = () => {
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (!slug) return;
        setLoading(true);
        setError('');
        const data = await fetchProjectBySlug(slug);
        if (isMounted) setProject(data as ProjectDetail);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load project.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <section className='projectDetail'>
        <div className='projectDetail__container'>
          <p className='projectDetail__error'>{error}</p>
          <div className='projectDetail__back'>
            <Link to={`/${lang || 'en'}/projects`} className='projectDetail__back-link'>
              ← Back to projects
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className='projectDetail'>
        <div className='projectDetail__container'>
          <p className='projectDetail__empty'>Project not found.</p>
          <div className='projectDetail__back'>
            <Link to={`/${lang || 'en'}/projects`} className='projectDetail__back-link'>
              ← Back to projects
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { coverImage, title, excerpt, tags, links, type, meta, source } = project;

  // Fallback caso o backend não envie "source"
  const sourceLabel =
    source ||
    (links?.figma && links?.github
      ? 'mixed'
      : links?.figma
      ? 'figma'
      : links?.github
      ? 'github'
      : undefined);

  return (
    <section className='projectDetail'>
      <div className='projectDetail__container'>
        <div className='projectDetail__header'>
          <div className='projectDetail__info'>
            <h1 className='projectDetail__title'>{title}</h1>
            {excerpt && <p className='projectDetail__excerpt'>{excerpt}</p>}

            <div className='projectDetail__meta'>
              {type && (
                <span className='projectDetail__badge projectDetail__badge--type'>{type}</span>
              )}
              {sourceLabel && (
                <span className='projectDetail__badge projectDetail__badge--source'>
                  {sourceLabel}
                </span>
              )}
            </div>

            {tags && tags.length > 0 && (
              <ul className='projectDetail__tags'>
                {tags.map((tag) => (
                  <li key={tag} className='projectDetail__tag'>
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <div className='projectDetail__links'>
              {links?.github && (
                <a
                  href={links.github}
                  className='projectDetail__link projectDetail__link--github'
                  target='_blank'
                  rel='noopener noreferrer'>
                  GitHub
                </a>
              )}
              {links?.figma && (
                <a
                  href={links.figma}
                  className='projectDetail__link projectDetail__link--figma'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Figma
                </a>
              )}
              {links?.live && (
                <a
                  href={links.live}
                  className='projectDetail__link projectDetail__link--live'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Live
                </a>
              )}
              {links?.blog && (
                <a
                  href={links.blog}
                  className='projectDetail__link projectDetail__link--article'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Article
                </a>
              )}
            </div>

            <div className='projectDetail__back'>
              <Link to={`/${lang || 'en'}/projects`} className='projectDetail__back-link'>
                ← Back to projects
              </Link>
            </div>
          </div>

          {coverImage && (
            <div className='projectDetail__cover'>
              <img src={coverImage} alt={title} className='projectDetail__cover-image' />
            </div>
          )}
        </div>

        {/* Figma embed (if present) */}
        {links?.figmaEmbedUrl && (
          <div className='projectDetail__block'>
            <h2 className='projectDetail__section-title'>Figma Preview</h2>
            <FigmaEmbed embedUrl={links.figmaEmbedUrl} />
          </div>
        )}

        {/* GitHub metadata (if present) */}
        {meta?.github && (
          <div className='projectDetail__block'>
            <h2 className='projectDetail__section-title'>GitHub</h2>
            <GitHubMeta meta={meta.github} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectDetailPage;
