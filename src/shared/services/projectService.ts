// /src/shared/services/projectService.ts
'use strict';

import api from '../../shared/utils/axios';
import { Project } from '../types/Project';
import { PaginatedResponse } from '../types/Pagination';

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
