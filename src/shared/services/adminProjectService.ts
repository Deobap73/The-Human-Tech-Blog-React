// /src/shared/services/adminProjectService.ts

'use strict';

/**
 * Admin Project Service
 * - Normalizes create/update payloads to match backend schema strictly.
 * - Handles CSRF preflight and credentials.
 * - Provides sync endpoints with 404 fallback.
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
  title: string;
  excerpt?: string;
  source?: string;
  type?: string;
  tags?: string[] | string;
  coverUrl?: string;
  coverImage?: string;

  repoUrl?: string;
  figmaUrl?: string;
  liveUrl?: string;
  blogUrl?: string;

  links?: {
    figma?: string;
    figmaEmbedUrl?: string;
    github?: string;
    live?: string;
    blog?: string;
  };

  translations?: Array<{
    lang: 'en' | 'pt' | 'de' | 'es';
    title: string;
    excerpt: string;
    slug?: string;
  }>;

  description?: string;
  summary?: string;
  shortDescription?: string;
  isPublic?: boolean | string;

  // Meta is used mainly for GitHub and Figma sync helpers.
  meta?: {
    github?: { repo?: string };
    figma?: { fileKey?: string };
  };
};

/**
 * Loose payload for update.
 * Same shape as create, plus optional slug.
 */
export type UpdateProjectPayloadLoose = CreateProjectPayloadLoose & {
  slug?: string;
};

export interface ListAdminProjectsParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

/* ============================
 * Normalizers and helpers
 * ============================ */

function normalizeToken(v?: string): string {
  return (v ?? '').toString().trim().toLowerCase();
}

/** Extract owner/repo from a GitHub URL. */
function parseGithubRepoSlug(url?: string): string | null {
  if (!url) return null;

  try {
    const u = new URL(url);

    if (!/github\.com$/i.test(u.hostname)) return null;

    const [owner, repo] = u.pathname.replace(/^\/+/, '').split('/');

    if (!owner || !repo) return null;

    return `${owner}/${repo.replace(/\.git$/i, '')}`;
  } catch {
    return null;
  }
}

/** GitHub OpenGraph image. */
function githubOgImageFromSlug(slug: string): string {
  return `https://opengraph.githubassets.com/1/${slug}`;
}

/** Cloudinary fetch helpers. */
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();

const DEFAULT_TRANSFORM =
  import.meta.env.VITE_CLOUDINARY_FETCH_TRANSFORM?.trim() || 'f_auto,q_auto,c_fill,w_1200,h_630';

function isCloudinaryUrl(url?: string): boolean {
  if (!url) return false;

  try {
    const u = new URL(url);
    return /res\.cloudinary\.com$/i.test(u.hostname);
  } catch {
    return false;
  }
}

function toCloudinaryFetch(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  if (!CLOUD) return rawUrl;
  if (isCloudinaryUrl(rawUrl)) return rawUrl;

  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${DEFAULT_TRANSFORM}/${encodeURIComponent(
    rawUrl,
  )}`;
}

/** Normalize Project.source. */
function normalizeSource(
  input?: string,
  links?: { github?: string; figma?: string },
): 'figma' | 'github' | 'mixed' | undefined {
  const v = normalizeToken(input);

  if (v === 'figma' || v === 'github' || v === 'mixed') return v;
  if (['gh', 'git', 'repo', 'repository', 'github.com'].includes(v)) return 'github';
  if (['fig', 'design', 'ui', 'ux', 'figma.com'].includes(v)) return 'figma';
  if (['mix', 'hybrid', 'both', 'figma+github', 'github+figma'].includes(v)) return 'mixed';

  const hasGitHub = !!links?.github;
  const hasFigma = !!links?.figma;

  if (hasGitHub && hasFigma) return 'mixed';
  if (hasGitHub) return 'github';
  if (hasFigma) return 'figma';

  return undefined;
}

/** Normalize Project.type. */
function normalizeType(input?: string): 'frontend-ui' | 'ux-figma' | 'full' | undefined {
  const v = normalizeToken(input);

  if (v === 'frontend-ui' || v === 'ux-figma' || v === 'full') return v;
  if (['frontend', 'ui', 'fe', 'ui-only', 'ui-kit'].includes(v)) return 'frontend-ui';
  if (['ux', 'design', 'figma', 'ux-fig', 'ux_figma'].includes(v)) return 'ux-figma';
  if (['full-project', 'fullstack', 'app', 'full_project', 'full stack'].includes(v)) return 'full';

  return undefined;
}

/** Normalize tags. */
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

/** Build a short excerpt. */
function toExcerpt(source?: string, fallbackTitle?: string): string | undefined {
  const text = (source ?? '').replace(/\s+/g, ' ').trim() || (fallbackTitle ?? '').trim();

  if (!text) return undefined;

  const MAX = 180;

  return text.length > MAX ? `${text.slice(0, MAX).trim()}…` : text;
}

/* ============================
 * Normalization core, CREATE
 * ============================ */

function normalizeCreatePayload(input: CreateProjectPayloadLoose) {
  const links = {
    figma: input.links?.figma ?? input.figmaUrl ?? undefined,
    figmaEmbedUrl: input.links?.figmaEmbedUrl ?? undefined,
    github: input.links?.github ?? input.repoUrl ?? undefined,
    live: input.links?.live ?? input.liveUrl ?? undefined,
    blog: input.links?.blog ?? input.blogUrl ?? undefined,
  };

  const description =
    input.description?.trim() ||
    input.summary?.trim() ||
    input.shortDescription?.trim() ||
    undefined;

  const excerpt =
    input.excerpt?.trim() ||
    input.translations?.[0]?.excerpt?.trim() ||
    toExcerpt(input.summary, input.title) ||
    toExcerpt(description, input.title) ||
    toExcerpt(input.shortDescription, input.title) ||
    toExcerpt(undefined, input.title);

  const normalizedSource = normalizeSource(input.source, {
    github: links.github,
    figma: links.figma,
  });

  const normalizedType = normalizeType(input.type);

  const isPublic =
    typeof input.isPublic === 'string'
      ? input.isPublic.trim().toLowerCase() !== 'false'
      : typeof input.isPublic === 'boolean'
        ? input.isPublic
        : true;

  let coverCandidate = input.coverImage ?? input.coverUrl;

  if (!coverCandidate && (normalizedSource === 'github' || links.github)) {
    const slug = parseGithubRepoSlug(links.github);

    if (slug) {
      coverCandidate = githubOgImageFromSlug(slug);
      input.meta = input.meta ?? {};
      input.meta.github = input.meta.github ?? {};
      input.meta.github.repo = input.meta.github.repo ?? slug;
    }
  }

  const coverImage = toCloudinaryFetch(coverCandidate) || coverCandidate;

  const normalized = {
    title: input.title?.trim(),
    excerpt,
    description,
    source: normalizedSource,
    type: normalizedType,
    tags: normalizeTags(input.tags),
    coverImage,
    links,
    translations: Array.isArray(input.translations) ? input.translations : [],
    isPublic,
    ...(input.meta ? { meta: input.meta } : {}),
  };

  return normalized;
}

/* ============================
 * Normalization core, UPDATE
 * ============================ */

function normalizeUpdatePayload(input: UpdateProjectPayloadLoose): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (typeof input.title === 'string') {
    body.title = input.title.trim();
  }

  if (typeof input.slug === 'string' && input.slug.trim().length > 0) {
    body.slug = input.slug.trim();
  }

  const tags = normalizeTags(input.tags);

  if (tags.length > 0) {
    body.tags = tags;
  }

  const links = {
    figma: input.links?.figma ?? input.figmaUrl ?? undefined,
    figmaEmbedUrl: input.links?.figmaEmbedUrl ?? undefined,
    github: input.links?.github ?? input.repoUrl ?? undefined,
    live: input.links?.live ?? input.liveUrl ?? undefined,
    blog: input.links?.blog ?? input.blogUrl ?? undefined,
  };

  const hasAnyLink = Object.values(links).some(Boolean);

  if (hasAnyLink) {
    body.links = links;
  }

  if (typeof input.description === 'string') {
    const description = input.description.trim();

    body.description = description;

    if (typeof input.excerpt !== 'string' || input.excerpt.trim().length === 0) {
      body.excerpt = toExcerpt(description, input.title);
    }
  }

  if (typeof input.excerpt === 'string' && input.excerpt.trim().length > 0) {
    body.excerpt = input.excerpt.trim();
  }

  const normalizedSource = normalizeSource(input.source, {
    github: links.github,
    figma: links.figma,
  });

  if (normalizedSource) {
    body.source = normalizedSource;
  }

  const normalizedType = normalizeType(input.type);

  if (normalizedType) {
    body.type = normalizedType;
  }

  if (typeof input.isPublic !== 'undefined') {
    const isPublic =
      typeof input.isPublic === 'string'
        ? input.isPublic.trim().toLowerCase() !== 'false'
        : typeof input.isPublic === 'boolean'
          ? input.isPublic
          : undefined;

    if (typeof isPublic === 'boolean') {
      body.isPublic = isPublic;
    }
  }

  const meta: {
    github?: { repo?: string };
    figma?: { fileKey?: string };
  } = {};

  if (input.meta?.github?.repo) {
    meta.github = { repo: input.meta.github.repo };
  }

  if (input.meta?.figma?.fileKey) {
    meta.figma = { fileKey: input.meta.figma.fileKey };
  }

  let coverCandidate = input.coverImage ?? input.coverUrl;

  if (!coverCandidate && (normalizedSource === 'github' || links.github)) {
    const slug = parseGithubRepoSlug(links.github);

    if (slug) {
      coverCandidate = githubOgImageFromSlug(slug);

      if (!meta.github) {
        meta.github = { repo: slug };
      } else if (!meta.github.repo) {
        meta.github.repo = slug;
      }
    }
  }

  const coverImage = toCloudinaryFetch(coverCandidate) || coverCandidate;

  if (coverImage) {
    body.coverImage = coverImage;
  }

  if (meta.github || meta.figma) {
    body.meta = meta;
  }

  return body;
}

/* ============================
 * Public API
 * ============================ */

export async function listAdminProjects(
  params: ListAdminProjectsParams,
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

export async function createProject(payload: CreateProjectPayloadLoose) {
  const token = await ensureCsrf();
  const body = normalizeCreatePayload(payload);

  if (!body?.title) throw new Error('Title is required.');
  if (!body?.source) throw new Error('Source must be one of: figma, github, mixed.');
  if (!body?.type) throw new Error('Type must be one of: frontend-ui, ux-figma, full.');

  const res = await api.post<Project>('/projects', body, {
    headers: { 'X-CSRF-Token': token, 'X-XSRF-TOKEN': token },
    withCredentials: true,
  });

  return res.data;
}

/**
 * Update project by id.
 * Uses PUT /projects/:id protected by JWT and admin.
 * Sends only the fields that make sense to update.
 */
export async function updateProject(id: string, payload: UpdateProjectPayloadLoose) {
  const token = await ensureCsrf();
  const body = normalizeUpdatePayload(payload);

  const res = await api.put<Project>(`/projects/${encodeURIComponent(id)}`, body, {
    headers: { 'X-CSRF-Token': token, 'X-XSRF-TOKEN': token },
    withCredentials: true,
  });

  return res.data;
}

/* =========================================
 * Sync endpoints with 404 admin/public fallback
 * ========================================= */

async function postWith404Fallback<T>(
  primaryPath: string,
  fallbackPath: string,
  body: Record<string, unknown> | undefined,
  token: string,
): Promise<T> {
  try {
    const res = await api.post<T>(primaryPath, body ?? {}, {
      headers: { 'X-CSRF-Token': token, 'X-XSRF-TOKEN': token },
      withCredentials: true,
    });

    return res.data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status ?? 0;

    if (status !== 404) throw err;

    const res = await api.post<T>(fallbackPath, body ?? {}, {
      headers: { 'X-CSRF-Token': token, 'X-XSRF-TOKEN': token },
      withCredentials: true,
    });

    return res.data;
  }
}

export async function syncGitHub(id: string, body?: { repo?: string }) {
  const token = await ensureCsrf();
  const primary = `/admin/projects/sync/github/${encodeURIComponent(id)}`;
  const fallback = `/projects/sync/github/${encodeURIComponent(id)}`;

  return postWith404Fallback<{ ok: boolean; message?: string }>(primary, fallback, body, token);
}

export async function syncFigma(
  id: string,
  body?: { figmaPublicUrl?: string; figmaFileKey?: string },
) {
  const token = await ensureCsrf();
  const primary = `/admin/projects/sync/figma/${encodeURIComponent(id)}`;
  const fallback = `/projects/sync/figma/${encodeURIComponent(id)}`;

  return postWith404Fallback<{ ok: boolean; message?: string }>(primary, fallback, body, token);
}
