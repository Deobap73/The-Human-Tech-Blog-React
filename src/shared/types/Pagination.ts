// /src/shared/types/Pagination.ts
'use strict';

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Legacy-style result (kept because other features may use it)
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * ✅ Unified response used pelo backend atual em /projects:
 * { page, limit, total, items }
 */
export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}
