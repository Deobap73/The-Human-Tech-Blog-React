// /src/features/projects/pages/ProjectDetailPage.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProjectDetailPage.scss';
import type { Project as BaseProject } from '../../../shared/types/Project';
import { fetchProjectBySlug } from '../../../shared/services/projectService';
import Loader from '../../../shared/components/Loader';
import FigmaEmbed from '../components/FigmaEmbed';
import GitHubMeta from '../components/GitHubMeta';
import { useGitHubMeta } from '../hooks/useGitHubMeta';

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
    const controller = new AbortController();

    const load = async () => {
      try {
        if (!slug) return;
        setLoading(true);
        setError('');
        const data = await fetchProjectBySlug(slug, controller.signal);
        setProject(data as ProjectDetail);
      } catch (err) {
        if ((err as Error).name !== 'CanceledError') {
          console.error(err);
          setError('Failed to load project.');
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [slug]);

  const { meta: liveGitMeta } = useGitHubMeta(project?.meta?.github?.repo, {
    stars: project?.meta?.github?.stars,
    lastCommitAt: project?.meta?.github?.lastCommitAt,
    description: project?.meta?.github?.description,
    topics: project?.meta?.github?.topics,
  });

  const jsonLd = useMemo(() => {
    if (!project) return null;
    const base: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      about: project.excerpt,
      inLanguage: lang || 'en',
      dateCreated: project.createdAt,
      dateModified: project.updatedAt,
      thumbnailUrl: project.coverImage,
      genre: project.type,
      keywords: project.tags?.join(', '),
      isAccessibleForFree: true,
    };

    if (project.links?.github || project.meta?.github?.repo) {
      base['codeRepository'] =
        project.links?.github ?? `https://github.com/${project.meta?.github?.repo}`;
    }
    if (project.links?.live) base['mainEntityOfPage'] = project.links.live;

    return JSON.stringify(base);
  }, [project, lang]);

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

  const sourceLabel =
    project.source ||
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
        {/* JSON-LD for SEO */}
        {jsonLd && (
          <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: jsonLd }} />
        )}

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
              <ul className='projectDetail__tags' aria-label='Project tags'>
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
              <img
                src={coverImage}
                alt={title || 'Project cover'}
                className='projectDetail__cover-image'
                loading='lazy'
                decoding='async'
              />
            </div>
          )}
        </div>

        {/* Figma embed (if present) */}
        {links?.figmaEmbedUrl && (
          <div className='projectDetail__block'>
            <h2 className='projectDetail__section-title'>Figma Preview</h2>
            <FigmaEmbed embedUrl={links.figmaEmbedUrl} ratio={56.25} />
          </div>
        )}

        {/* GitHub metadata (if present) */}
        {(meta?.github || liveGitMeta) && (
          <div className='projectDetail__block'>
            <h2 className='projectDetail__section-title'>GitHub</h2>
            <GitHubMeta
              meta={{
                repo: meta?.github?.repo,
                stars: liveGitMeta?.stars ?? meta?.github?.stars,
                lastCommitAt: liveGitMeta?.lastCommitAt ?? meta?.github?.lastCommitAt,
                topics: liveGitMeta?.topics ?? meta?.github?.topics,
                description: liveGitMeta?.description ?? meta?.github?.description,
              }}
              live
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectDetailPage;
