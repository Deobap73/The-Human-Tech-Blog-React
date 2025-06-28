// /src/shared/services/draftService.ts

import api from '../utils/axios';
import { Tag } from '../types/Tag';
import { Category } from '../types/Category';

/**
 * DraftData interface
 */
export interface DraftData {
  _id?: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  isQuickPost?: boolean;
  // ...add more if needed
}

/**
 * Ensures a fresh CSRF cookie is set before mutating requests.
 * This avoids invalid csrf token errors on cross-origin production environments.
 */
async function ensureCsrfBeforeMutate(): Promise<void> {
  try {
    await api.get('/auth/csrf', { withCredentials: true });
  } catch (error) {
    console.error('[draftService] Failed to refresh CSRF token', error);
    // Optionally rethrow or handle gracefully
  }
}

/**
 * Create a new draft (always ensures CSRF token before request)
 */
export async function createDraft(data: Partial<DraftData>) {
  await ensureCsrfBeforeMutate();
  const res = await api.post('/drafts', data, { withCredentials: true });
  return res.data.draft;
}

/**
 * Update existing draft (always ensures CSRF token before request)
 */
export async function updateDraft(id: string, data: Partial<DraftData>) {
  await ensureCsrfBeforeMutate();
  const res = await api.patch(`/drafts/${id}`, data, { withCredentials: true });
  return res.data.draft;
}

/**
 * Fetch draft by id (no need for CSRF protection, as it's a GET request)
 */
export async function getDraftById(id: string) {
  const res = await api.get(`/drafts/${id}`, { withCredentials: true });
  return res.data;
}
