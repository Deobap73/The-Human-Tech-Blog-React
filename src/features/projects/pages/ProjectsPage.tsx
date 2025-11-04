'use strict';

/**
 * Path: /src/features/projects/pages/ProjectsPage.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
// Components
import ProjectsTabs from '../components/ProjectsTabs';
import ProjectCard from '../components/ProjectCard';
import ProjectsEmptyState from '../components/ProjectsEmptyState';
import CtaBand from '../components/CtaBand';
import FiltersBar from '../components/FiltersBar';
import ProjectsGrid from '../components/ProjectsGrid';
import Pagination from '../components/Pagination';

// Styles
import '../styles/ProjectsPage.scss';
import '../styles/ProjectsGrid.scss';
import '../styles/FiltersBar.scss';
import '../styles/Pagination.scss';
import '../styles/CtaBand.scss';

import { fetchProjects } from '../../../shared/services/projectService';
import type { Project } from '../../../shared/types/Project';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

const DEFAULT_LIMIT = 9;

/**
 * ProjectsPage (lean)
 * - Local state only (no URL sync)
 * - Debounced search
 * - Single useEffect with AbortController
 * - No prefetch/cache (keep moving parts minimal)
 */
const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'frontend-ui' | 'ux-figma' | 'full'>('frontend-ui');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const debouncedSearch = useDebouncedValue(search, 450);

  // Reset page to 1 when tab/search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const key = useMemo(
    () => `${activeTab}::${debouncedSearch || ''}::${page}::${DEFAULT_LIMIT}`,
    [activeTab, debouncedSearch, page]
  );

  // Guard against setState after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch with cancellation
  useEffect(() => {
    const controller = new AbortController();

    const load = async (): Promise<void> => {
      setError('');
      setLoading(true);
      try {
        const data = await fetchProjects(
          activeTab,
          page,
          DEFAULT_LIMIT,
          debouncedSearch,
          controller.signal
        );
        if (!mountedRef.current) return;

        setProjects(data.items);
        setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
      } catch (err: unknown) {
        // Ignore silent cancellations
        const e = err as { name?: string; code?: string };
        const canceled =
          e?.name === 'AbortError' || e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED';
        if (!canceled) {
          // eslint-disable-next-line no-console
          console.error('[ProjectsPage][load]', key, err);
          setError('Failed to load projects.');
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [key, activeTab, page, debouncedSearch]);

  const clearFilters = (): void => {
    setSearch('');
    setActiveTab('frontend-ui');
    setPage(1);
  };

  return (
    <section className='projectsPage'>
      <div className='projectsPage__container'>
        <h1 id='projects-title' className='projectsPage__title'>
          Projects
        </h1>

        {/* CTA band (optional, helps UX and parity with "Figma to code") */}
        <CtaBand />

        {/* Unified FiltersBar (moved from /pages to /components) */}
        <FiltersBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        {error && <p className='projectsPage__error'>{error}</p>}

        {/* Skeletons while loading */}
        {loading && !error && (
          <ProjectsGrid labelledById='projects-title'>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </ProjectsGrid>
        )}

        {!loading && !error && projects.length === 0 && (
          <ProjectsEmptyState onClear={clearFilters} />
        )}

        {!error && projects.length > 0 && (
          <>
            <ProjectsGrid labelledById='projects-title'>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </ProjectsGrid>

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
