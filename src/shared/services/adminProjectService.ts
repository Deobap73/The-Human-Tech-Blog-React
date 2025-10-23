// /src/shared/services/adminProjectService.ts
'use strict';

/**
 * Admin Project Service
 * - Normalizes create payload to match backend schema strictly.
 * - Handles CSRF preflight and credentials.
 * - Provides sync endpoints with 404 fallback (admin route → public route).
 * - All imports are relative, TypeScript strict friendly, and comments in English.
 */

import api from '../../shared/utils/axios';
import type { PaginatedResponse } from './projectService';
import type { Project } from '../types/Project';
import { ensureCsrf } from '../services/csrfService';

/**
 * Local strict type for creation payload from the Admin UI.
 * Accepts friendly aliases and extra optional fields the form may produce.
 */
export type CreateProjectPayloadLoose = {
  // Required by schema (excerpt can be auto-derived)
  title: string;
  excerpt?: string;
  source?: string; // we will normalize to 'figma' | 'github' | 'mixed'
  type?: string; // we will normalize to 'frontend-ui' | 'ux-figma' | 'full'

  // Optional/friendly inputs coming from the form
  tags?: string[] | string; // allow comma-separated strings, we'll normalize
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

  // Optional translations (UI can send at least one)
  translations?: Array<{
    lang: 'en' | 'pt' | 'de' | 'es';
    title: string;
    excerpt: string;
    slug?: string;
  }>;

  // Extra fields we may use to derive excerpt if not provided
  description?: string;
  summary?: string;
  shortDescription?: string;

  // Visibility
  isPublic?: boolean | string; // accept "true"/"false" and normalize to boolean
};

export interface ListAdminProjectsParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

/* ============================
 * Normalizers & helpers
 * ============================ */

/** Normalize whitespace and lowercase */
function normalizeToken(v?: string): string {
  return (v ?? '').toString().trim().toLowerCase();
}

/** Map many friendly variants to strict Project.source enum */
function normalizeSource(
  input?: string,
  links?: { github?: string; figma?: string }
): 'figma' | 'github' | 'mixed' | undefined {
  const v = normalizeToken(input);

  if (v === 'figma' || v === 'github' || v === 'mixed') return v;

  // Friendly aliases
  if (['gh', 'git', 'repo', 'repository', 'github.com'].includes(v)) return 'github';
  if (['fig', 'design', 'ui', 'ux', 'figma.com'].includes(v)) return 'figma';
  if (['mix', 'hybrid', 'both', 'figma+github', 'github+figma'].includes(v)) return 'mixed';

  // Derive from links if not explicitly set
  const hasGitHub = !!links?.github;
  const hasFigma = !!links?.figma;
  if (hasGitHub && hasFigma) return 'mixed';
  if (hasGitHub) return 'github';
  if (hasFigma) return 'figma';

  return undefined;
}

/** Map many friendly variants to strict Project.type enum */
function normalizeType(input?: string): 'frontend-ui' | 'ux-figma' | 'full' | undefined {
  const v = normalizeToken(input);

  // Exact
  if (v === 'frontend-ui' || v === 'ux-figma' || v === 'full') return v;

  // Friendly aliases
  if (['frontend', 'ui', 'fe', 'ui-only', 'ui-kit'].includes(v)) return 'frontend-ui';
  if (['ux', 'design', 'figma', 'ux-fig', 'ux_figma'].includes(v)) return 'ux-figma';
  if (['full-project', 'fullstack', 'app', 'full_project', 'full stack'].includes(v)) return 'full';

  return undefined;
}

/** Convert comma-separated string to tags array, trimming empties */
function normalizeTags(input?: string[] | string): string[] {
  if (Array.isArray(input)) {
    return input.map((t) => t.trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

/** Build a short excerpt from a longer text or title */
function toExcerpt(source?: string, fallbackTitle?: string): string | undefined {
  const text = (source ?? '').replace(/\s+/g, ' ').trim() || (fallbackTitle ?? '').trim();
  if (!text) return undefined;
  const MAX = 180;
  return text.length > MAX ? `${text.slice(0, MAX).trim()}…` : text;
}

/* ============================
 * Normalization core
 * ============================ */

/**
 * Normalize a loose payload from the Admin UI into the backend-expected shape.
 * - Maps coverUrl -> coverImage
 * - Maps repoUrl/figmaUrl/liveUrl/blogUrl -> links.github/figma/live/blog
 * - Derives excerpt when missing (from translations/summary/description/title)
 * - Normalizes enums (source/type) and deduces source from links when absent
 * - Normalizes tags (comma-separated strings accepted)
 * - Normalizes isPublic from string/boolean
 */
function normalizeCreatePayload(input: CreateProjectPayloadLoose) {
  const links = {
    figma: input.links?.figma ?? input.figmaUrl ?? undefined,
    figmaEmbedUrl: input.links?.figmaEmbedUrl ?? undefined,
    github: input.links?.github ?? input.repoUrl ?? undefined,
    live: input.links?.live ?? input.liveUrl ?? undefined,
    blog: input.links?.blog ?? input.blogUrl ?? undefined,
  };

  const excerpt =
    input.excerpt?.trim() ||
    input.translations?.[0]?.excerpt?.trim() ||
    toExcerpt(input.summary, input.title) ||
    toExcerpt(input.description, input.title) ||
    toExcerpt(input.shortDescription, input.title) ||
    toExcerpt(undefined, input.title); // final fallback from title

  // Normalize enums (accept friendly values and infer from links)
  const normalizedSource = normalizeSource(input.source, {
    github: links.github,
    figma: links.figma,
  });
  const normalizedType = normalizeType(input.type);

  // Normalize visibility flag
  const isPublic =
    typeof input.isPublic === 'string'
      ? input.isPublic.trim().toLowerCase() !== 'false'
      : typeof input.isPublic === 'boolean'
      ? input.isPublic
      : true;

  const normalized = {
    title: input.title?.trim(),
    excerpt,
    source: normalizedSource, // may be undefined here; we'll check before POST
    type: normalizedType, // may be undefined here; we'll check before POST
    tags: normalizeTags(input.tags),
    coverImage: input.coverImage ?? input.coverUrl ?? undefined,
    links,
    translations: Array.isArray(input.translations) ? input.translations : [],
    isPublic,
  };

  return normalized;
}

/* ============================
 * Public API
 * ============================ */

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
 * - Normalizes the payload to match backend schema and enums.
 */
export async function createProject(payload: CreateProjectPayloadLoose) {
  const token = await ensureCsrf();
  const body = normalizeCreatePayload(payload);

  // Client-side assertions (friendly messages). We avoid blocking on excerpt because we derive it.
  if (!body?.title) throw new Error('Title is required.');

  // If source/type still undefined after normalization, guide the user with allowed values.
  if (!body?.source) {
    throw new Error('Source must be one of: figma | github | mixed.');
  }
  if (!body?.type) {
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

/* =========================================
 * Sync endpoints with 404 admin/public fallback
 * ========================================= */

/**
 * Try a POST and if the route doesn't exist (404), retry an alternative path.
 */
async function postWith404Fallback<T>(
  primaryPath: string,
  fallbackPath: string,
  body: Record<string, unknown> | undefined,
  token: string
): Promise<T> {
  try {
    const res = await api.post<T>(primaryPath, body ?? {}, {
      headers: { 'X-CSRF-Token': token, 'X-XSRF-TOKEN': token },
      withCredentials: true,
    });
    return res.data;
  } catch (err: unknown) {
    const status = (err as any)?.response?.status ?? 0;
    if (status !== 404) throw err;

    const res = await api.post<T>(fallbackPath, body ?? {}, {
      headers: { 'X-CSRF-Token': token, 'X-XSRF-TOKEN': token },
      withCredentials: true,
    });
    return res.data;
  }
}

/**
 * syncGitHub
 * - Prefer admin route, fallback to public route if not found.
 */
export async function syncGitHub(id: string, body?: { repo?: string }) {
  const token = await ensureCsrf();

  // Prefer admin-only route (mounted at /api via projectSyncAdminRoutes)
  const primary = `/admin/projects/sync/github/${encodeURIComponent(id)}`;

  // Fallback to public/projects-mounted route (mounted at /api/projects via projectSyncRoutes)
  const fallback = `/projects/sync/github/${encodeURIComponent(id)}`;

  return postWith404Fallback<{ ok: boolean; message?: string }>(primary, fallback, body, token);
}

/**
 * syncFigma
 * - Prefer admin route, fallback to public route if not found.
 */
export async function syncFigma(
  id: string,
  body?: { figmaPublicUrl?: string; figmaFileKey?: string }
) {
  const token = await ensureCsrf();

  const primary = `/admin/projects/sync/figma/${encodeURIComponent(id)}`;
  const fallback = `/projects/sync/figma/${encodeURIComponent(id)}`;

  return postWith404Fallback<{ ok: boolean; message?: string }>(primary, fallback, body, token);
}
