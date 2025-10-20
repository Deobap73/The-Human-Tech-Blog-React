// /src/shared/services/projectService.ts

'use strict';

import api from '../../shared/utils/axios';
import type { Project } from '../types/Project';

// Keep a local-safe paginated response type that mirrors backend { items, total, page, limit }
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * GET /projects
 */
export async function fetchProjects(
  type?: string,
  page = 1,
  limit = 9
): Promise<PaginatedResponse<Project>> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await api.get<PaginatedResponse<Project>>(`/projects?${params.toString()}`);
  return response.data;
}

/**
 * GET /projects/:slug
 */
export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const response = await api.get<Project>(`/projects/${encodeURIComponent(slug)}`);
  return response.data;
}
