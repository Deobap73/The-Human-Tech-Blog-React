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
const DEFAULT_LIMIT = 3;

// UI tags -> backend type (ajusta se precisares)
const TYPE_TAGS: Record<string, Project['type']> = {
  'Frontend UI': 'frontend-ui',
  'UX · Figma': 'ux-figma',
  'Full Projects': 'full',
};

const AVAILABLE_TAGS = Object.keys(TYPE_TAGS);

/**
 * ProjectsPage
 * - Reproduz o layout “Figma to code”: grid 3 col + paginação centrada.
 * - Se o backend NÃO paginar corretamente, paginamos no cliente (fallback).
 * - Se o backend paginar, usamos os dados tal como vêm.
 */
const ProjectsPage: React.FC = () => {
  // ======= STATE =======
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
  const activeType: Project['type'] =
    (activeTags.find((t) => TYPE_TAGS[t as keyof typeof TYPE_TAGS]) &&
      TYPE_TAGS[activeTags.find((t) => TYPE_TAGS[t as keyof typeof TYPE_TAGS]) as string]) ||
    'frontend-ui';

  const toggleTag = (tag: string): void => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  // Reset page nos filtros
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
        const data = await fetchProjects(
          activeType,
          page,
          DEFAULT_LIMIT,
          debouncedQ,
          controller.signal
        );

        // Ordenação client-side estável (fallback se não houver campo temporal)
        const list = [...data.items].sort((a, b) => {
          if (sort === 'az') return a.title.localeCompare(b.title);
          if (sort === 'za') return b.title.localeCompare(a.title);
          const aTs = (a as { updatedAt?: string }).updatedAt
            ? Date.parse((a as { updatedAt?: string }).updatedAt as string)
            : 0;
          const bTs = (b as { updatedAt?: string }).updatedAt
            ? Date.parse((b as { updatedAt?: string }).updatedAt as string)
            : 0;
          if (aTs && bTs) return sort === 'newest' ? bTs - aTs : aTs - bTs;
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
   * DETEÇÃO ROBUSTA DE PAGINAÇÃO DO BACKEND
   * Só consideramos "paginado pelo servidor" quando:
   *  - total e limit são válidos
   *  - total > limit (há mais do que uma página)
   *  - items devolvidos <= limit (o servidor fez slice)
   */
  const backendPaginated =
    serverTotal !== null &&
    serverLimit !== null &&
    serverLimit > 0 &&
    (serverTotal as number) > (serverLimit as number) &&
    itemsRaw.length <= (serverLimit as number);

  // nº de páginas
  const totalPages = backendPaginated
    ? Math.max(1, Math.ceil((serverTotal as number) / (serverLimit as number)))
    : Math.max(1, Math.ceil(itemsRaw.length / DEFAULT_LIMIT));

  // Itens a renderizar nesta página
  const visibleItems: Project[] = backendPaginated
    ? itemsRaw // servidor já paginou
    : itemsRaw.slice((page - 1) * DEFAULT_LIMIT, (page - 1) * DEFAULT_LIMIT + DEFAULT_LIMIT);

  // Transform para o grid de cartões
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
