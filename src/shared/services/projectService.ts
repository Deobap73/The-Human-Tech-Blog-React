// /src/shared/services/projectService.ts
'use strict';

import axios from 'axios';
import api from '../../shared/utils/axios';
import type { Project } from '../types/Project';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const inflight = new Map<string, Promise<PaginatedResponse<Project>>>();

function makeKey(type?: string, page = 1, limit = 9, q?: string, noCache?: boolean): string {
  return JSON.stringify({ type, page, limit, q, noCache });
}

function isAbortError(err: unknown): boolean {
  if (err instanceof DOMException && err.name === 'AbortError') return true;

  const anyErr = err as { code?: unknown; name?: unknown };
  if (anyErr?.code === 'ERR_CANCELED') return true;
  if (anyErr?.name === 'CanceledError') return true;

  return false;
}

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

  const q = search && search.trim().length > 0 ? search.trim() : '';
  if (q) params.append('q', q);

  params.append('page', String(page));
  params.append('limit', String(limit));

  if (noCache) params.append('_ts', String(Date.now()));

  const key = makeKey(type, page, limit, q || undefined, noCache);

  if (inflight.has(key)) return inflight.get(key)!;

  const promise = (async (): Promise<PaginatedResponse<Project>> => {
    try {
      const response = await api.get<PaginatedResponse<Project>>(`/projects?${params.toString()}`, {
        signal,
      });
      return response.data;
    } catch (err: unknown) {
      if (axios.isCancel?.(err) || isAbortError(err)) {
        throw new DOMException('Request canceled', 'AbortError');
      }
      throw new Error('Failed to fetch projects.');
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

export async function fetchProjectBySlug(
  slug: string,
  signal?: AbortSignal,
  noCache?: boolean
): Promise<Project> {
  const safeSlug = slug.trim();
  if (!safeSlug) throw new Error('Missing slug');

  const params = new URLSearchParams();
  if (noCache) params.append('_ts', String(Date.now()));

  const qs = params.toString();
  const path = `/projects/${encodeURIComponent(safeSlug)}${qs ? `?${qs}` : ''}`;

  try {
    const response = await api.get<Project>(path, { signal });
    return response.data;
  } catch (err: unknown) {
    if (axios.isCancel?.(err) || isAbortError(err)) {
      throw new DOMException('Request canceled', 'AbortError');
    }
    throw new Error('Failed to fetch project by slug.');
  }
}
