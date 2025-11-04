// /src/features/projects/pages/ProjectsPage.tsx

'use strict';

import React from 'react';
import './ProjectsPage.scss';

// Local pieces
import FiltersBar, { SortOption } from '../FiltersBar/FiltersBar';
import ProjectsGrid, { ProjectGridItem } from '../ProjectsGrid/ProjectsGrid';
import Pagination from '../Pagination/Pagination';
import CtaBand from '../CtaBand/CtaBand';

// Reuse existing components if needed
import ProjectsEmptyState from '../components/ProjectsEmptyState';

// Backend types/services
import type { Project } from '../../../shared/types/Project';
import { fetchProjects } from '../../../shared/services/projectService';

// Helpers
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

/**
 * ProjectsPage
 * - Keeps dynamic fetching to backend with optional "type" derived from tags.
 * - If no type-tag is active, defaults to 'frontend-ui' to preserve current behavior.
 */
const DEFAULT_LIMIT = 9;

// map UI tags to backend type
const TYPE_TAGS: Record<string, Project['type']> = {
  'Frontend UI': 'frontend-ui',
  'UX · Figma': 'ux-figma',
  'Full Projects': 'full',
};

const AVAILABLE_TAGS = Object.keys(TYPE_TAGS); // we can add more non-type tags in the future

const ProjectsPage: React.FC = () => {
  // ======= STATE =======
  const [q, setQ] = React.useState<string>('');
  const [sort, setSort] = React.useState<SortOption>('newest');
  const [activeTags, setActiveTags] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(1);

  // Data state
  const [items, setItems] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [totalPages, setTotalPages] = React.useState<number>(1);

  const debouncedQ = useDebouncedValue(q, 450);

  // ======= TAG FILTER HANDLING (extract backend type) =======
  const activeType: Project['type'] =
    (activeTags.find((t) => TYPE_TAGS[t as keyof typeof TYPE_TAGS]) &&
      TYPE_TAGS[activeTags.find((t) => TYPE_TAGS[t as keyof typeof TYPE_TAGS]) as string]) ||
    'frontend-ui';

  const toggleTag = (tag: string): void => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  // Reset page on filters change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedQ, activeType, sort]);

  // ======= FETCH (backend) =======
  React.useEffect(() => {
    const controller = new AbortController();

    const load = async (): Promise<void> => {
      setError('');
      setLoading(true);
      try {
        const data = await fetchProjects(
          activeType,
          page,
          DEFAULT_LIMIT,
          debouncedQ,
          controller.signal
        );
        setItems(data.items);

        // client-side sort (title-based); backend can be extended later
        const sorted = [...data.items].sort((a, b) => {
          if (sort === 'az') return a.title.localeCompare(b.title);
          if (sort === 'za') return b.title.localeCompare(a.title);
          // newest/oldest fallback based on updatedAt if present else by title
          const aT = (a as any).updatedAt ? Date.parse((a as any).updatedAt) : 0;
          const bT = (b as any).updatedAt ? Date.parse((b as any).updatedAt) : 0;
          if (aT && bT) return sort === 'newest' ? bT - aT : aT - bT;
          return sort === 'newest'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        });

        const totalPagesCalc = Math.max(1, Math.ceil(data.total / data.limit));
        setTotalPages(totalPagesCalc);
        setItems(sorted);
      } catch (err) {
        if ((err as { name?: string }).name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error('[ProjectsPage] load error', err);
          setError('Failed to load projects.');
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [activeType, page, debouncedQ, sort]);

  // Transform to grid items
  const pageItems: ProjectGridItem[] = items.map((p) => ({
    id: p._id,
    title: p.title,
    subtitle: p.type ? p.type : undefined,
    excerpt: p.excerpt,
    imageSrc: p.coverImage,
    imageAlt: p.title || 'Project cover',
    tags: p.tags || [],
    links: {
      details: `/${(p as any).lang || 'en'}/projects/${p.slug}`,
      repo: p.links?.github,
      live: p.links?.live,
    },
  }));

  return (
    <main aria-labelledby='ProjectsPage-title' className='projectsPage'>
      <h1 id='ProjectsPage-title' className='projectsPage__title'>
        Projects
      </h1>

      <FiltersBar
        search={q}
        onSearch={setQ}
        sort={sort}
        onSort={setSort}
        tags={AVAILABLE_TAGS}
        activeTags={activeTags}
        onToggleTag={toggleTag}
      />

      {error && <p className='projectsPage__error'>{error}</p>}

      {loading && !error && <ProjectsEmptyState message='Loading projects…' />}

      {!loading && !error && pageItems.length === 0 && (
        <ProjectsEmptyState message='No projects found for the current filter.' />
      )}

      {!error && pageItems.length > 0 && (
        <>
          <ProjectsGrid items={pageItems} emptyText='Nenhum projeto encontrado.' />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <CtaBand
        title='Tem um projeto em mente?'
        text='Fale comigo para desenharmos juntos a melhor solução — com qualidade, acessibilidade e foco no detalhe.'
        primary={{ label: 'Contactar', href: '/contact' }}
        secondary={{
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/palmirasolochi/',
          target: '_blank',
        }}
        align='center'
        tone='accent'
      />
    </main>
  );
};

export default ProjectsPage;
