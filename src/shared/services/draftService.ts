// /src/shared/services/draftService.ts

import api from '../utils/axios';
import { Tag } from '../types/Tag';
import { Category } from '../types/Category';

export interface DraftData {
  _id?: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  // ...add more if needed
}

// Create draft
export async function createDraft(data: Partial<DraftData>) {
  const res = await api.post('/drafts', data, { withCredentials: true });
  return res.data.draft;
}

// Update draft
export async function updateDraft(id: string, data: Partial<DraftData>) {
  const res = await api.patch(`/drafts/${id}`, data, { withCredentials: true });
  return res.data.draft;
}

// Get draft by id
export async function getDraftById(id: string) {
  const res = await api.get(`/drafts/${id}`, { withCredentials: true });
  return res.data;
}
