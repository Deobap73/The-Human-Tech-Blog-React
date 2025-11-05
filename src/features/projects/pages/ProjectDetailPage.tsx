// /src/features/projects/pages/ProjectDetailPage.tsx
'use strict';

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProjectDetailPage.scss';

// Services & types
import type { Project } from '../../../shared/types/Project';
import { fetchProjectBySlug } from '../../../shared/services/projectService';

/**
 * ProjectDetailPage
 * - Displays a single project with image, description, links, and metadata.
 * - Fetches data dynamically from backend using slug.
 * - Handles loading, error, and not-found states gracefully.
 */
const ProjectDetailPage: React.FC = () => {
  const { slug, lang } = useParams<{ slug: string; lang?: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  // ===== Fetch project by slug =====
  React.useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();
    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchProjectBySlug(slug, controller.signal);
        setProject(data);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('[ProjectDetailPage] Error fetching project', err);
        setError('Failed to load project.');
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [slug]);

  // ===== UI: Loading / Error / Not Found =====
  if (loading) {
    return (
      <main className='projDetail'>
        <p className='projDetail__stateText'>{t('route.loading', 'Loading...')}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className='projDetail'>
        <p className='projDetail__stateText'>
          {t('projectsDetail.error', 'Failed to load project.')}
        </p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className='projDetail'>
        <p className='projDetail__stateText'>
          {t('projectsDetail.notFound', 'Project not found.')}
        </p>
      </main>
    );
  }

  // ===== UI: Render project content =====
  return (
    <main className='projDetail'>
      {/* Breadcrumbs */}
      <nav className='projDetail__crumbs' aria-label='breadcrumb'>
        <ol className='projDetail__crumbList'>
          <li>
            <Link to={`/${currentLang}`}>{t('navbar.home', 'Home')}</Link>
          </li>
          <li>
            <Link to={`/${currentLang}/projects`}>{t('navbar.projects', 'Projects')}</Link>
          </li>
          <li aria-current='page'>{project.title}</li>
        </ol>
      </nav>

      {/* Back button */}
      <button
        type='button'
        className='projDetail__back'
        onClick={() => navigate(-1)}
        aria-label={t('projectsDetail.back', 'Back')}>
        ← {t('projectsDetail.back', 'Back')}
      </button>

      {/* Image */}
      {project.coverImage && (
        <figure className='projDetail__hero'>
          <img
            className='projDetail__heroImg'
            src={project.coverImage}
            alt={project.title || 'Project cover'}
          />
        </figure>
      )}

      {/* Title and Meta */}
      <header className='projDetail__header'>
        <h1 className='projDetail__title'>{project.title}</h1>
        <div className='projDetail__meta'>
          {project.type && (
            <span className={`projDetail__type projDetail__type--${project.type}`}>
              {project.type === 'frontend-ui'
                ? t('projects.type.frontendUi', 'Frontend UI')
                : project.type === 'ux-figma'
                ? t('projects.type.uxFigma', 'UX · Figma')
                : t('projects.type.full', 'Full Projects')}
            </span>
          )}
          {project.updatedAt && (
            <time className='projDetail__updated' dateTime={project.updatedAt}>
              {t('projectsDetail.updated', 'Updated')}:{' '}
              {new Date(project.updatedAt).toLocaleDateString()}
            </time>
          )}
        </div>
        {project.excerpt && <p className='projDetail__excerpt'>{project.excerpt}</p>}
      </header>

      {/* Links */}
      <div
        className='projDetail__actions'
        role='group'
        aria-label={t('projectsDetail.actions', 'Actions')}>
        {project.links?.live && (
          <a
            href={project.links.live}
            target='_blank'
            rel='noopener noreferrer'
            className='projDetail__btn projDetail__btn--primary'>
            {t('projects.external.live', 'Live')}
          </a>
        )}
        {project.links?.github && (
          <a
            href={project.links.github}
            target='_blank'
            rel='noopener noreferrer'
            className='projDetail__btn projDetail__btn--secondary'>
            {t('projects.external.github', 'GitHub')}
          </a>
        )}
        {project.links?.figma && (
          <a
            href={project.links.figma}
            target='_blank'
            rel='noopener noreferrer'
            className='projDetail__btn projDetail__btn--ghost'>
            {t('projects.external.figma', 'Figma')}
          </a>
        )}
        {project.links?.article && (
          <a
            href={project.links.article}
            target='_blank'
            rel='noopener noreferrer'
            className='projDetail__btn projDetail__btn--ghost'>
            {t('projects.external.article', 'Article')}
          </a>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <ul className='projDetail__tags' aria-label={t('projects.tags', 'Tags')}>
          {project.tags.map((tag) => (
            <li key={tag} className='projDetail__tag'>
              {tag}
            </li>
          ))}
        </ul>
      )}

      {/* Description */}
      {project.description && (
        <section className='projDetail__section'>
          <h2 className='projDetail__sectionTitle'>
            {t('projectsDetail.about', 'About this project')}
          </h2>
          <div className='projDetail__content'>{project.description}</div>
        </section>
      )}

      {/* Figma embed */}
      {(project.meta?.figma?.fileKey || project.links?.figma) && (
        <section className='projDetail__section'>
          <h2 className='projDetail__sectionTitle'>{t('projects.external.figma', 'Figma')}</h2>
          <div className='projDetail__figmaWrap'>
            <iframe
              className='projDetail__figma'
              src={
                project.meta?.figma?.fileKey
                  ? `https://www.figma.com/embed?embed_host=thehumantechblog&url=https://www.figma.com/file/${project.meta.figma.fileKey}`
                  : project.links!.figma!
              }
              title='Figma preview'
              allowFullScreen
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default ProjectDetailPage;
