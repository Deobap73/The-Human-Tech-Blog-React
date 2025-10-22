// /src/shared/services/projectService.ts
'use strict';

import api from '../../shared/utils/axios';
import type { Project } from '../types/Project';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface FetchListOptions {
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
  signal?: AbortSignal;
  noCache?: boolean; // allows bypassing any intermediate caches (interceptors/CDNs)
}

/**
 * GET /projects
 * - Supports filtering by type and optional text search.
 * - Accepts optional AbortSignal for proper cancellation.
 * - "noCache" adds a timestamp param to bust caches if needed.
 */
export async function fetchProjects(
  type?: string,
  page = 1,
  limit = 9,
  search?: string,
  signal?: AbortSignal,
  noCache?: boolean
): Promise<PaginatedResponse<Project>> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (search && search.trim().length > 0) params.append('search', search.trim());
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (noCache) params.append('_ts', String(Date.now()));

  try {
    const response = await api.get<PaginatedResponse<Project>>(`/projects?${params.toString()}`, {
      signal,
    });
    return response.data;
  } catch {
    throw new Error('Failed to fetch projects.');
  }
}

/**
 * GET /projects/:slug
 * - Returns a single Project; throws on failure.
 */
export async function fetchProjectBySlug(
  slug: string,
  signal?: AbortSignal,
  noCache?: boolean
): Promise<Project> {
  try {
    const url = new URL(`/projects/${encodeURIComponent(slug)}`, window.location.origin);
    if (noCache) url.searchParams.set('_ts', String(Date.now()));
    const response = await api.get<Project>(`${url.pathname}${url.search}`, { signal });
    return response.data;
  } catch {
    throw new Error('Failed to fetch project by slug.');
  }
}
