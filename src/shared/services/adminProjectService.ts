// /src/shared/services/adminProjectService.ts
'use strict';

import api from '../../shared/utils/axios';
import type { PaginatedResponse } from './projectService';
import type { Project } from '../types/Project';
import type { CreateProjectPayload } from '../../features/admin/components/projects/AdminProjectCreateModal';

export interface ListAdminProjectsParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

/**
 * listAdminProjects
 * - Reuses public /projects listing for now.
 */
export async function listAdminProjects(
  params: ListAdminProjectsParams
): Promise<PaginatedResponse<Project>> {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.search) qs.set('search', params.search.trim());
  qs.set('page', String(params.page ?? 1));
  qs.set('limit', String(params.limit ?? 10));

  const res = await api.get<PaginatedResponse<Project>>(`/projects?${qs.toString()}`, {
    signal: params.signal,
  });
  return res.data;
}

/**
 * createProject
 * - POST /api/projects
 */
export async function createProject(payload: CreateProjectPayload) {
  const res = await api.post<Project>('/projects', payload);
  return res.data;
}

/**
 * syncGitHub
 * - POST /api/projects/sync/github/:id
 */
export async function syncGitHub(id: string, body?: { repo?: string }) {
  const res = await api.post(`/projects/sync/github/${encodeURIComponent(id)}`, body ?? {});
  return res.data as { ok: boolean; message?: string };
}

/**
 * syncFigma
 * - POST /api/projects/sync/figma/:id
 */
export async function syncFigma(
  id: string,
  body?: { figmaPublicUrl?: string; figmaFileKey?: string }
) {
  const res = await api.post(`/projects/sync/figma/${encodeURIComponent(id)}`, body ?? {});
  return res.data as { ok: boolean; message?: string };
}
