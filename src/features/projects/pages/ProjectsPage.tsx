// /src/features/projects/pages/ProjectsPage.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import ProjectsTabs from '../components/ProjectsTabs';
import ProjectCard from '../components/ProjectCard';
import ProjectsFilterBar from './ProjectsFilterBar';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ProjectsEmptyState from '../components/ProjectsEmptyState';

import '../styles/ProjectsPage.scss';
import '../styles/ProjectsGrid.scss';

import { fetchProjects } from '../../../shared/services/projectService';
import type { Project } from '../../../shared/types/Project';
import Loader from '../../../shared/components/Loader';
import Pagination from '../../ui/Pagination';

import { useQueryParams } from '../../../shared/hooks/useQueryParams';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

const DEFAULT_LIMIT = 9;

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

  // Debounced search to reduce API calls
  const debouncedSearch = useDebouncedValue(search, 450);

  // Sync URL whenever tab/search/page change (debounced search governs)
  useEffect(() => {
    setMany(
      {
        type: activeTab,
        page,
        search: debouncedSearch || undefined,
      },
      true // replace to avoid polluting history with each keystroke
    );
  }, [activeTab, page, debouncedSearch, setMany]);

  // Reset page to 1 whenever tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  // Load projects with cancellation
  useEffect(() => {
    const controller = new AbortController();

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchProjects(
          activeTab,
          page,
          DEFAULT_LIMIT,
          debouncedSearch,
          controller.signal
        );
        setProjects(data.items);
        setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
      } catch (err) {
        if ((err as Error).name !== 'CanceledError') {
          console.error(err);
          setError('Failed to load projects.');
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [activeTab, page, debouncedSearch]);

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

        {/* Existing tabs for continuity */}
        <ProjectsTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Filter bar with search */}
        <ProjectsFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Error state */}
        {error && <p className='projectsPage__error'>{error}</p>}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className='projectsGrid'>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <ProjectsEmptyState onClear={clearFilters} />
        )}

        {/* Results */}
        {!loading && !error && projects.length > 0 && (
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
