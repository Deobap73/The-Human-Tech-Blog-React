// /src/shared/services/adminProjectService.ts
'use strict';

import api from '../../shared/utils/axios';
import type { PaginatedResponse } from './projectService';
import type { Project } from '../types/Project';
import { ensureCsrf } from '../services/csrfService';

/**
 * Local strict type for creation payload from the Admin UI.
 * We accept both "friendly" field names (repoUrl, figmaUrl, liveUrl, coverUrl)
 * and the backend-expected structure (coverImage, links.{...}).
 */
export type CreateProjectPayloadLoose = {
  // Required by schema
  title: string;
  excerpt: string;
  source: 'figma' | 'github' | 'mixed';
  type: 'frontend-ui' | 'ux-figma' | 'full';

  // Optional/friendly inputs coming from the form
  tags?: string[];
  coverUrl?: string; // friendly alias
  coverImage?: string; // backend-expected

  // Flat link inputs (friendly aliases)
  repoUrl?: string;
  figmaUrl?: string;
  liveUrl?: string;
  blogUrl?: string;

  // Or nested links (backend-expected)
  links?: {
    figma?: string;
    figmaEmbedUrl?: string;
    github?: string;
    live?: string;
    blog?: string;
  };

  // Optional translations
  translations?: Array<{
    lang: 'en' | 'pt' | 'de' | 'es';
    title: string;
    excerpt: string;
    slug?: string;
  }>;

  // Visibility
  isPublic?: boolean;
};

export interface ListAdminProjectsParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

/**
 * Normalize a loose payload from the Admin UI into the backend-expected shape.
 * - Maps coverUrl -> coverImage
 * - Maps repoUrl/figmaUrl/liveUrl/blogUrl -> links.github/figma/live/blog
 * - Preserves already-correct structures if provided.
 */
function normalizeCreatePayload(input: CreateProjectPayloadLoose) {
  const links = {
    figma: input.links?.figma ?? input.figmaUrl ?? undefined,
    figmaEmbedUrl: input.links?.figmaEmbedUrl ?? undefined,
    github: input.links?.github ?? input.repoUrl ?? undefined,
    live: input.links?.live ?? input.liveUrl ?? undefined,
    blog: input.links?.blog ?? input.blogUrl ?? undefined,
  };

  const normalized = {
    title: input.title?.trim(),
    excerpt: input.excerpt?.trim(),
    source: input.source,
    type: input.type,
    tags: Array.isArray(input.tags) ? input.tags : [],
    coverImage: input.coverImage ?? input.coverUrl ?? undefined,
    links,
    translations: Array.isArray(input.translations) ? input.translations : [],
    isPublic: typeof input.isPublic === 'boolean' ? input.isPublic : true,
  };

  return normalized;
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
 * - Ensures CSRF token and injects required headers.
 * - Normalizes the payload to match backend schema.
 */
export async function createProject(payload: CreateProjectPayloadLoose) {
  const token = await ensureCsrf();
  const body = normalizeCreatePayload(payload);

  // Basic client-side assertions to fail fast with friendly messages.
  if (!body.title) throw new Error('Title is required.');
  if (!body.excerpt) throw new Error('Excerpt is required.');
  if (!['figma', 'github', 'mixed'].includes(body.source)) {
    throw new Error('Source must be one of: figma | github | mixed.');
  }
  if (!['frontend-ui', 'ux-figma', 'full'].includes(body.type)) {
    throw new Error('Type must be one of: frontend-ui | ux-figma | full.');
  }

  const res = await api.post<Project>('/projects', body, {
    headers: {
      'X-CSRF-Token': token,
      'X-XSRF-TOKEN': token, // accepted by backend CORS
    },
    withCredentials: true,
  });
  return res.data;
}

/**
 * syncGitHub
 * - POST /api/projects/sync/github/:id
 */
export async function syncGitHub(id: string, body?: { repo?: string }) {
  const token = await ensureCsrf();
  const res = await api.post(`/projects/sync/github/${encodeURIComponent(id)}`, body ?? {}, {
    headers: {
      'X-CSRF-Token': token,
      'X-XSRF-TOKEN': token,
    },
    withCredentials: true,
  });
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
  const token = await ensureCsrf();
  const res = await api.post(`/projects/sync/figma/${encodeURIComponent(id)}`, body ?? {}, {
    headers: {
      'X-CSRF-Token': token,
      'X-XSRF-TOKEN': token,
    },
    withCredentials: true,
  });
  return res.data as { ok: boolean; message?: string };
}
