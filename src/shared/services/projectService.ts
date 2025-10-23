// /src/shared/services/projectService.ts
'use strict';

import axios from 'axios';
import api from '../../shared/utils/axios';
import type { Project } from '../types/Project';

/**
 * Paginated API response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Local memory cache for in-flight requests to prevent duplication
 */
const inflight = new Map<string, Promise<PaginatedResponse<Project>>>();

/**
 * Build a cache key for a given query
 */
function makeKey(type?: string, page = 1, limit = 9, search?: string, noCache?: boolean): string {
  return JSON.stringify({ type, page, limit, search, noCache });
}

/**
 * GET /projects
 * - Supports filtering by type and optional text search.
 * - Uses Axios cancel token for proper cleanup.
 * - Uses in-flight de-duplication to prevent repeated requests.
 * - "noCache" adds a timestamp param to bust caches if needed.
 * - ⚠️ NOTE: backend expects query param `q` (not `search`).
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
  if (search && search.trim().length > 0) params.append('q', search.trim()); // fixed key
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (noCache) params.append('_ts', String(Date.now()));

  const key = makeKey(type, page, limit, search, noCache);

  // Deduplicate identical concurrent requests
  if (inflight.has(key)) return inflight.get(key)!;

  const promise = (async () => {
    try {
      const response = await api.get<PaginatedResponse<Project>>(`/projects?${params.toString()}`, {
        signal,
      });
      return response.data;
    } catch (err: any) {
      // Ignore cancellations cleanly
      if (axios.isCancel?.(err) || err?.code === 'ERR_CANCELED') {
        throw new DOMException('Request canceled', 'AbortError');
      }
      // Any other case = genuine failure
      throw new Error('Failed to fetch projects.');
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
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
  } catch (err: any) {
    if (axios.isCancel?.(err) || err?.code === 'ERR_CANCELED') {
      throw new DOMException('Request canceled', 'AbortError');
    }
    throw new Error('Failed to fetch project by slug.');
  }
}
