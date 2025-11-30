// /src/features/projects/pages/ProjectsPage.tsx

'use strict';

import React from 'react';
import { useTranslation } from 'react-i18next';
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

const DEFAULT_LIMIT = 3;

// UI tags -> backend type
const TYPE_TAGS: Record<string, Project['type']> = {
  'Frontend UI': 'frontend-ui',
  'UX · Figma': 'ux-figma',
  'Full Projects': 'full',
};

const AVAILABLE_TAGS = Object.keys(TYPE_TAGS);

/**
 * ProjectsPage
 * - Layout: grid 3 columns + centered pagination.
 * - Shows ALL projects by default, ordered from newest to oldest.
 * - When a tag is active, filters by that type.
 * - If no tag is active, no `type` filter is sent to the backend.
 */
const ProjectsPage: React.FC = () => {
  // ======= STATE =======
  const { t } = useTranslation();
  const [q, setQ] = React.useState<string>('');
  const [sort, setSort] = React.useState<SortOption>('newest');
  const [activeTags, setActiveTags] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [compact, setCompact] = React.useState<boolean>(false);

  // Data state
  const [itemsRaw, setItemsRaw] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [serverTotal, setServerTotal] = React.useState<number | null>(null);
  const [serverLimit, setServerLimit] = React.useState<number | null>(null);

  const debouncedQ = useDebouncedValue(q, 450);

  // ======= TAG FILTER HANDLING (derive backend type) =======
  // If no tag is active, we do NOT send "type" to the backend.
  // If one or more tags are active, we use the first known mapping.
  const primaryTag = activeTags.find((tag) => TYPE_TAGS[tag as keyof typeof TYPE_TAGS]);
  const activeType: Project['type'] | undefined = primaryTag
    ? TYPE_TAGS[primaryTag as keyof typeof TYPE_TAGS]
    : undefined;

  const toggleTag = (tag: string): void => {
    setActiveTags((prev) => {
      const isActive = prev.includes(tag);
      if (isActive) {
        // Clicking an active tag removes it and goes back to "all projects"
        return prev.filter((t) => t !== tag);
      }
      // Optional: keep it as "single selection" by replacing the array
      return [tag];
    });
  };

  // Reset page when filters or search or sort change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedQ, activeType, sort]);

  // ======= FETCH =======
  React.useEffect(() => {
    const controller = new AbortController();

    const load = async (): Promise<void> => {
      setError('');
      setLoading(true);
      try {
        // When "activeType" is undefined, fetchProjects will NOT send "type"
        // and the backend should return all projects.
        const data = await fetchProjects(
          activeType,
          page,
          DEFAULT_LIMIT,
          debouncedQ,
          controller.signal
        );

        // Client-side sorting, stable and predictable.
        const list = [...data.items].sort((a, b) => {
          if (sort === 'az') return a.title.localeCompare(b.title);
          if (sort === 'za') return b.title.localeCompare(a.title);

          const aTs = a.updatedAt ? Date.parse(a.updatedAt) : 0;
          const bTs = b.updatedAt ? Date.parse(b.updatedAt) : 0;

          if (aTs && bTs) {
            return sort === 'newest' ? bTs - aTs : aTs - bTs;
          }

          // Fallback: alphabetical if we do not have dates
          return sort === 'newest'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        });

        setItemsRaw(list);
        setServerTotal(typeof data.total === 'number' ? data.total : null);
        setServerLimit(typeof data.limit === 'number' ? data.limit : null);
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

  /**
   * Backend pagination detection
   * We only consider "server paginated" when:
   *  - total and limit are valid
   *  - total > limit (there is more than one page)
   *  - items length <= limit (server performed the slice)
   */
  const backendPaginated =
    serverTotal !== null &&
    serverLimit !== null &&
    serverLimit > 0 &&
    (serverTotal as number) > (serverLimit as number) &&
    itemsRaw.length <= (serverLimit as number);

  const totalPages = backendPaginated
    ? Math.max(1, Math.ceil((serverTotal as number) / (serverLimit as number)))
    : Math.max(1, Math.ceil(itemsRaw.length / DEFAULT_LIMIT));

  const visibleItems: Project[] = backendPaginated
    ? itemsRaw
    : itemsRaw.slice((page - 1) * DEFAULT_LIMIT, (page - 1) * DEFAULT_LIMIT + DEFAULT_LIMIT);

  const pageItems: ProjectGridItem[] = visibleItems.map((p) => ({
    id: p._id,
    title: p.title,
    subtitle: p.type ? p.type : undefined,
    excerpt: p.excerpt,
    imageSrc: p.coverImage,
    imageAlt: p.title || 'Project cover',
    tags: p.tags || [],
    links: {
      details: `/${(p as { lang?: string }).lang || 'en'}/projects/${p.slug}`,
      repo: p.links?.github,
      live: p.links?.live,
    },
  }));

  return (
    <main aria-labelledby='ProjectsPage-title' className='projectsPage'>
      <FiltersBar
        search={q}
        onSearch={setQ}
        sort={sort}
        onSort={setSort}
        tags={AVAILABLE_TAGS}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        compact={compact}
        onToggleCompact={setCompact}
      />

      {error && <p className='projectsPage__error'>{error}</p>}

      {loading && !error && <ProjectsEmptyState message='Loading projects…' />}

      {!loading && !error && pageItems.length === 0 && (
        <ProjectsEmptyState message='No projects found for the current filter.' />
      )}

      {!error && pageItems.length > 0 && (
        <>
          <ProjectsGrid
            items={pageItems}
            compact={compact}
            emptyText='Nenhum projeto encontrado.'
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            compact={compact}
          />
        </>
      )}

      <CtaBand
        title={t('projectsPage.ctaTitle')}
        text={t('projectsPage.ctaText')}
        primary={{ label: t('projectsPage.ctaPrimary'), href: '/contact' }}
        secondary={{
          label: t('projectsPage.ctaSecondary'),
          href: 'https://www.linkedin.com/in/deolindobaptista/',
          target: '_blank',
        }}
        align='center'
        tone='accent'
      />
    </main>
  );
};

export default ProjectsPage;
