// /src/features/admin/pages/AdminProjectsPage.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import {
  listAdminProjects,
  syncFigma,
  syncGitHub,
} from '../../../shared/services/adminProjectService';
import type { Project } from '../../../shared/types/Project';
import AdminProjectsFilterBar from '../components/projects/AdminProjectsFilterBar';
import AdminProjectTable from '../components/projects/AdminProjectTable';
import '../../admin/styles/AdminProjectsPage.scss';
import '../styles/AdminProjectsPage.scss';

import Pagination from '../../ui/Pagination';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useToast } from '../../../shared/hooks/useToast';

const LIMIT = 10;

const AdminProjectsPage: React.FC = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [type, setType] = useState<'frontend-ui' | 'ux-figma' | 'full'>('frontend-ui');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const debouncedSearch = useDebouncedValue(search, 400);

  // useToast exposes success/error/info…, not showToast
  const { success: toastSuccess, error: toastError } = useToast();

  function toggleSelection(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const clearSelection = () => setSelected(new Set());

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await listAdminProjects({
          type,
          search: debouncedSearch,
          page,
          limit: LIMIT,
          signal: controller.signal,
        });
        setItems(res.items);
        setTotalPages(Math.max(1, Math.ceil(res.total / res.limit)));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
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
      const res = await listAdminProjects({ type, search: debouncedSearch, page, limit: LIMIT });
      setItems(res.items);
      setTotalPages(Math.max(1, Math.ceil(res.total / res.limit)));
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
      const res = await listAdminProjects({ type, search: debouncedSearch, page, limit: LIMIT });
      setItems(res.items);
      setTotalPages(Math.max(1, Math.ceil(res.total / res.limit)));
    } catch {
      toastError('Bulk Figma sync failed');
    } finally {
      setLoading(false);
    }
  }

  const selectionCount = useMemo(() => selected.size, [selected]);

  return (
    <section className='adminProjects'>
      <div className='adminProjects__header'>
        <h2 className='adminProjects__title'>Projects</h2>
        <p className='adminProjects__subtitle'>Manage integrations, freshness and bulk sync</p>
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
            const res = await listAdminProjects({
              type,
              search: debouncedSearch,
              page,
              limit: LIMIT,
            });
            setItems(res.items);
            setTotalPages(Math.max(1, Math.ceil(res.total / res.limit)));
          }}
        />
      </div>

      {totalPages > 1 && (
        <div className='adminProjects__pagination'>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
};

export default AdminProjectsPage;
