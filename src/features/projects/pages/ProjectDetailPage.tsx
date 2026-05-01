// /src/features/projects/pages/ProjectDetailPage.tsx

'use strict';

import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProjectDetailPage.scss';

import type { Project } from '../../../shared/types/Project';
import { fetchProjectBySlug } from '../../../shared/services/projectService';

import ProjectMetaHead from '../components/ProjectMetaHead';

const ProjectDetailPage: React.FC = () => {
  const { slug, lang } = useParams<{ slug: string; lang?: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const currentLang = lang || i18n.language.split('_')[0].split('-')[0] || 'en';

  React.useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError('');

        const data = await fetchProjectBySlug(slug, controller.signal);
        setProject(data);
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return;

        console.error('[ProjectDetailPage] Error fetching project', err);
        setError('Failed to load project.');
      } finally {
        setLoading(false);
      }
    };

    void load();

    return () => controller.abort();
  }, [slug]);

  const canonical =
    typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : '';

  if (loading) {
    return (
      <main className='projDetail'>
        <p className='projDetail__stateText'>{t('projectsDetail.loading', 'Loading…')}</p>
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

  const detailSummary = project.excerpt || project.description || '';

  return (
    <main className='projDetail'>
      <ProjectMetaHead
        title={project.title}
        excerpt={detailSummary || undefined}
        coverImage={project.coverImage || undefined}
        canonical={canonical}
        lang={currentLang}
      />

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

      <button
        type='button'
        className='projDetail__back'
        onClick={() => navigate(-1)}
        aria-label={t('projectsDetail.back', 'Back')}>
        ← {t('projectsDetail.back', 'Back')}
      </button>

      {project.coverImage && (
        <figure className='projDetail__hero'>
          <img
            className='projDetail__heroImg'
            src={project.coverImage}
            alt={project.title || 'Project cover'}
          />
        </figure>
      )}

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

        {detailSummary && <p className='projDetail__excerpt'>{detailSummary}</p>}
      </header>

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

      {project.tags && project.tags.length > 0 && (
        <ul className='projDetail__tags' aria-label={t('projects.tags', 'Tags')}>
          {project.tags.map((tag) => (
            <li key={tag} className='projDetail__tag'>
              {tag}
            </li>
          ))}
        </ul>
      )}

      {project.description && (
        <section className='projDetail__section'>
          <h2 className='projDetail__sectionTitle'>
            {t('projectsDetail.about', 'About this project')}
          </h2>
          <div className='projDetail__content'>{project.description}</div>
        </section>
      )}

      {(project.meta?.figma?.fileKey || project.links?.figma) && (
        <section className='projDetail__section'>
          <h2 className='projDetail__sectionTitle'>{t('projects.external.figma', 'Figma')}</h2>

          <div className='projDetail__figmaWrap'>
            <iframe
              className='projDetail__figma'
              src={
                project.meta?.figma?.fileKey
                  ? `https://www.figma.com/embed?embed_host=thehumantechblog&url=https://www.figma.com/file/${project.meta.figma.fileKey}`
                  : (project.links?.figma as string)
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
