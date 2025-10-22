// /src/features/admin/pages/AdminProjectsPage.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import {
  listAdminProjects,
  syncFigma,
  syncGitHub,
  createProject,
} from '../../../shared/services/adminProjectService';
import type { Project } from '../../../shared/types/Project';
import AdminProjectsFilterBar from '../components/projects/AdminProjectsFilterBar';
import AdminProjectTable from '../components/projects/AdminProjectTable';
import '../../admin/styles/AdminProjectsPage.scss';
import '../styles/AdminProjectsPage.scss';

import Pagination from '../../ui/Pagination';
import { useToast } from '../../../shared/hooks/useToast';
import AdminProjectCreateModal, {
  CreateProjectPayload,
} from '../components/projects/AdminProjectCreateModal';

const LIMIT = 10;

const AdminProjectsPage: React.FC = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [type, setType] = useState<'frontend-ui' | 'ux-figma' | 'full'>('frontend-ui');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  // Toast helpers (success/error) from your existing hook
  const { success: toastSuccess, error: toastError } = useToast();

  // Simple debounce without extra hook
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(id);
  }, [search]);

  function toggleSelection(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const clearSelection = () => setSelected(new Set());

  async function load() {
    const res = await listAdminProjects({
      type,
      search: debouncedSearch,
      page,
      limit: LIMIT,
    });
    setItems(res.items);
    setTotalPages(Math.max(1, Math.ceil(res.total / res.limit)));
  }

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, debouncedSearch, page]);

  // Reset page when filters change
  useEffect(() => setPage(1), [type, debouncedSearch]);

  async function bulkSyncGitHub() {
    if (selected.size === 0) return;
    if (!window.confirm(`Sync GitHub for ${selected.size} project(s)?`)) return;

    try {
      setLoading(true);
      const ids = Array.from(selected);
      await Promise.all(ids.map((id) => syncGitHub(id).catch(() => ({ ok: false }))));
      toastSuccess('Bulk GitHub sync executed');
      clearSelection();
      await load();
    } catch {
      toastError('Bulk GitHub sync failed');
    } finally {
      setLoading(false);
    }
  }

  async function bulkSyncFigma() {
    if (selected.size === 0) return;
    if (!window.confirm(`Sync Figma for ${selected.size} project(s)?`)) return;

    try {
      setLoading(true);
      const ids = Array.from(selected);
      await Promise.all(ids.map((id) => syncFigma(id).catch(() => ({ ok: false }))));
      toastSuccess('Bulk Figma sync executed');
      clearSelection();
      await load();
    } catch {
      toastError('Bulk Figma sync failed');
    } finally {
      setLoading(false);
    }
  }

  const selectionCount = useMemo(() => selected.size, [selected]);

  async function handleCreate(payload: CreateProjectPayload) {
    try {
      setLoading(true);
      // 1) Create project
      const created = await createProject(payload);

      // 2) Optional syncs based on provided inputs
      const wantsGitHub = Boolean(payload.meta?.github?.repo || payload.links?.github);
      const wantsFigma = Boolean(payload.meta?.figma?.fileKey || payload.links?.figma);

      if (wantsGitHub) {
        await syncGitHub(created._id, { repo: payload.meta?.github?.repo });
      }
      if (wantsFigma) {
        await syncFigma(created._id, {
          figmaPublicUrl: payload.links?.figma,
          figmaFileKey: payload.meta?.figma?.fileKey,
        });
      }

      toastSuccess('Project created successfully');
      // Reload current listing
      await load();
      // Ensure the correct tab is selected (in case type differs)
      setType(created.type as 'frontend-ui' | 'ux-figma' | 'full');
      setPage(1);
    } catch (e) {
      toastError('Failed to create project');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='adminProjects'>
      <div className='adminProjects__header'>
        <div>
          <h2 className='adminProjects__title'>Projects</h2>
          <p className='adminProjects__subtitle'>Manage integrations, freshness and bulk sync</p>
        </div>
        <div>
          <button
            className='adminProjects__bulk-btn'
            onClick={() => setCreateOpen(true)}
            aria-label='Create new project'>
            + New Project
          </button>
        </div>
      </div>

      <AdminProjectsFilterBar
        type={type}
        onTypeChange={setType}
        search={search}
        onSearchChange={setSearch}
        onBulkSyncGitHub={bulkSyncGitHub}
        onBulkSyncFigma={bulkSyncFigma}
        selectionCount={selectionCount}
      />

      <div className='adminProjects__tableWrap' aria-busy={loading}>
        <AdminProjectTable
          items={items}
          selected={selected}
          onToggle={toggleSelection}
          onReload={async () => {
            await load();
          }}
        />
      </div>

      {totalPages > 1 && (
        <div className='adminProjects__pagination'>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <AdminProjectCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </section>
  );
};

export default AdminProjectsPage;
