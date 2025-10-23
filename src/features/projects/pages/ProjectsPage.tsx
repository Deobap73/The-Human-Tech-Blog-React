// /src/features/projects/pages/ProjectsPage.tsx
'use strict';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProjectsTabs from '../components/ProjectsTabs';
import ProjectCard from '../components/ProjectCard';
import ProjectsFilterBar from './ProjectsFilterBar';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ProjectsEmptyState from '../components/ProjectsEmptyState';

import '../styles/ProjectsPage.scss';
import '../styles/ProjectsGrid.scss';

import { fetchProjects } from '../../../shared/services/projectService';
import type { Project } from '../../../shared/types/Project';
import Pagination from '../../ui/Pagination';

import { useQueryParams } from '../../../shared/hooks/useQueryParams';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useProjectsCache } from '../hooks/useProjectsCache';
import { makeProjectsKey } from '../utils/queryKeys';

const DEFAULT_LIMIT = 9;

/**
 * ProjectsPage
 * - Displays paginated projects by type and optional search.
 * - Uses in-memory cache, cancellation and debounce to avoid flashing & loops.
 */
const ProjectsPage: React.FC = () => {
  const { get, setMany } = useQueryParams();

  // Read initial values from querystring
  const initialTab = (get('type') as 'frontend-ui' | 'ux-figma' | 'full') || 'frontend-ui';
  const initialPage = Math.max(1, Number(get('page') || 1));
  const initialSearch = get('search') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'frontend-ui' | 'ux-figma' | 'full'>(initialTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>(initialSearch);

  const debouncedSearch = useDebouncedValue(search, 450);

  // Cache
  const cache = useProjectsCache<{
    items: Project[];
    total: number;
    page: number;
    limit: number;
  }>();
  const cacheHitRef = useRef<boolean>(false);

  // Stable cache key
  const key = useMemo(
    () => makeProjectsKey({ type: activeTab, search: debouncedSearch, page, limit: DEFAULT_LIMIT }),
    [activeTab, debouncedSearch, page]
  );

  // Sync URL (replace to avoid history noise while typing)
  useEffect(() => {
    setMany(
      {
        type: activeTab,
        page,
        search: debouncedSearch || undefined,
      },
      true
    );
  }, [activeTab, page, debouncedSearch, setMany]);

  // Reset page to 1 on filters (only if needed)
  useEffect(() => {
    setPage((prev) => (prev !== 1 ? 1 : prev));
  }, [activeTab, debouncedSearch]);

  // Load with cache + cancellation + guard
  useEffect(() => {
    const controller = new AbortController();

    const load = async (): Promise<void> => {
      setError('');

      // Try cache first
      const cached = cache.get(key);
      if (cached) {
        cacheHitRef.current = true;
        setProjects(cached.items);
        setTotalPages(Math.max(1, Math.ceil(cached.total / cached.limit)));
      } else {
        cacheHitRef.current = false;
      }

      try {
        if (!cacheHitRef.current) setLoading(true);

        const data = await fetchProjects(
          activeTab,
          page,
          DEFAULT_LIMIT,
          debouncedSearch,
          controller.signal
        );

        setProjects(data.items);
        setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
        cache.set(key, data);
      } catch (err: any) {
        // Ignore canceled requests silently
        if (err?.name === 'AbortError') return;
        console.error(err);
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [key, activeTab, page, debouncedSearch, cache]);

  // Prefetch next page (silent, ignored on cancel)
  useEffect(() => {
    const controller = new AbortController();

    const prefetch = async (): Promise<void> => {
      if (page < totalPages) {
        const nextKey = makeProjectsKey({
          type: activeTab,
          search: debouncedSearch,
          page: page + 1,
          limit: DEFAULT_LIMIT,
        });

        if (!cache.has(nextKey)) {
          try {
            const data = await fetchProjects(
              activeTab,
              page + 1,
              DEFAULT_LIMIT,
              debouncedSearch,
              controller.signal
            );
            cache.set(nextKey, data);
          } catch (err: any) {
            if (err?.name === 'AbortError') return;
          }
        }
      }
    };

    void prefetch();
    return () => controller.abort();
  }, [activeTab, page, totalPages, debouncedSearch, cache]);

  const clearFilters = useMemo(
    () => () => {
      setSearch('');
      setActiveTab('frontend-ui');
      setPage(1);
    },
    []
  );

  return (
    <section className='projectsPage'>
      <div className='projectsPage__container'>
        <h1 className='projectsPage__title'>Projects</h1>

        <ProjectsTabs activeTab={activeTab} onChange={setActiveTab} />

        <ProjectsFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        {error && <p className='projectsPage__error'>{error}</p>}

        {loading && !error && !cacheHitRef.current && (
          <div className='projectsGrid'>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <ProjectsEmptyState onClear={clearFilters} />
        )}

        {!error && projects.length > 0 && (
          <>
            <div className='projectsGrid'>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;
