// /src/features/projects/pages/ProjectsPage.tsx
'use strict';

import React, { useEffect, useState } from 'react';
import ProjectsTabs from '../components/ProjectsTabs';
import ProjectCard from '../components/ProjectCard';
import ProjectsFilterBar from './ProjectsFilterBar';
import '../styles/ProjectsPage.scss';
import '../styles/ProjectsGrid.scss';
import { fetchProjects } from '../../../shared/services/projectService';
import type { Project } from '../../../shared/types/Project';
import Loader from '../../../shared/components/Loader';
import Pagination from '../../ui/Pagination';

const DEFAULT_LIMIT = 9;

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'frontend-ui' | 'ux-figma' | 'full'>('frontend-ui');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  // Reset page to 1 whenever tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchProjects(activeTab, page, DEFAULT_LIMIT, search);
        setProjects(data.items);
        setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
      } catch (err) {
        console.error(err);
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [activeTab, page, search]);

  return (
    <section className='projectsPage'>
      <div className='projectsPage__container'>
        <h1 className='projectsPage__title'>Projects</h1>

        {/* Keep existing tabs for familiarity */}
        <ProjectsTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* New filter bar adds search; tabs are duplicated intentionally for layout flexibility */}
        <ProjectsFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        {loading && <Loader />}
        {error && <p className='projectsPage__error'>{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <p className='projectsPage__empty'>No projects found for this category.</p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className='projectsGrid'>
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;
