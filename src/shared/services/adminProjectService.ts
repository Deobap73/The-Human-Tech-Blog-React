// /src/shared/services/adminProjectService.ts
'use strict';

import api from '../../shared/utils/axios';
import type { PaginatedResponse } from './projectService';
import type { Project } from '../types/Project';

export interface ListAdminProjectsParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

/**
 * listAdminProjects
 * - Uses the public /projects listing for now (server returns public items).
 * - If/when a private admin endpoint exists, replace this implementation.
 */
export async function listAdminProjects(
  params: ListAdminProjectsParams
): Promise<PaginatedResponse<Project>> {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.search) qs.set('search', params.search.trim());
  qs.set('page', String(params.page ?? 1));
  qs.set('limit', String(params.limit ?? 10));
  const url = `/projects?${qs.toString()}`;

  const res = await api.get<PaginatedResponse<Project>>(url, { signal: params.signal });
  return res.data;
}

/**
 * syncGitHub
 * - POST /api/admin/projects/sync/github/:id
 */
export async function syncGitHub(id: string, body?: { repo?: string }) {
  const res = await api.post(`/admin/projects/sync/github/${encodeURIComponent(id)}`, body ?? {});
  return res.data as { ok: boolean; message?: string };
}

/**
 * syncFigma
 * - POST /api/admin/projects/sync/figma/:id
 */
export async function syncFigma(
  id: string,
  body?: { figmaPublicUrl?: string; figmaFileKey?: string }
) {
  const res = await api.post(`/admin/projects/sync/figma/${encodeURIComponent(id)}`, body ?? {});
  return res.data as { ok: boolean; message?: string };
}
