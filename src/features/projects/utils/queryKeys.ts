// /src/features/projects/utils/queryKeys.ts
'use strict';

interface KeyParams {
  type: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * makeProjectsKey
 * - Creates a stable cache key for project list results.
 */
export function makeProjectsKey({ type, search, page, limit }: KeyParams): string {
  const s = (search ?? '').trim().toLowerCase();
  return `projects:${type}|q=${encodeURIComponent(s)}|p=${page}|l=${limit}`;
}
