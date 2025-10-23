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

import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

const DEFAULT_LIMIT = 9;

/**
 * ProjectsPage (lean)
 * - Estado local simples (sem sincronizar URL)
 * - Debounce na pesquisa
 * - Um único useEffect com AbortController
 * - Sem prefetch nem cache in-memory (menos moving parts)
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

  // Reset page para 1 quando muda tab/pesquisa
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  // Chave só para debug/estabilidade (não é usada noutros sítios)
  const key = useMemo(
    () => `${activeTab}::${debouncedSearch || ''}::${page}::${DEFAULT_LIMIT}`,
    [activeTab, debouncedSearch, page]
  );

  // Ref para ignorar setState após unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch simples com cancelamento
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
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
      } catch (err: any) {
        // Ignorar cancelamentos silenciosamente
        const canceled =
          err?.name === 'AbortError' ||
          err?.name === 'CanceledError' ||
          err?.code === 'ERR_CANCELED';
        if (!canceled) {
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

  const clearFilters = () => {
    setSearch('');
    setActiveTab('frontend-ui');
    setPage(1);
  };

  return (
    <section className='projectsPage'>
      <div className='projectsPage__container'>
        <h1 className='projectsPage__title'>Projects</h1>

        {/*  <ProjectsTabs activeTab={activeTab} onChange={setActiveTab} /> */}

        <ProjectsFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        {error && <p className='projectsPage__error'>{error}</p>}

        {/* Skeletons durante o carregamento */}
        {loading && !error && (
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
