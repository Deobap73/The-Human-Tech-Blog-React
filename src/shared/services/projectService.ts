// /src/shared/services/projectService.ts
'use strict';

import api from '../../shared/utils/axios';
import type { Project } from '../types/Project';

// Paginated response shape coming from the backend
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * GET /projects
 * - Supports filtering by type and optional text search.
 * - Always returns a valid PaginatedResponse; throws with a clear message on failure.
 */
export async function fetchProjects(
  type?: string,
  page = 1,
  limit = 9,
  search?: string
): Promise<PaginatedResponse<Project>> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (search && search.trim().length > 0) params.append('search', search.trim());
  params.append('page', String(page));
  params.append('limit', String(limit));

  try {
    const response = await api.get<PaginatedResponse<Project>>(`/projects?${params.toString()}`);
    return response.data;
  } catch (error) {
    // Ensure a consistent thrown error for callers (UI can show a friendly message)
    throw new Error('Failed to fetch projects.');
  }
}

/**
 * GET /projects/:slug
 * - Returns a single Project; throws on failure.
 */
export async function fetchProjectBySlug(slug: string): Promise<Project> {
  try {
    const response = await api.get<Project>(`/projects/${encodeURIComponent(slug)}`);
    return response.data;
  } catch {
    throw new Error('Failed to fetch project by slug.');
  }
}
