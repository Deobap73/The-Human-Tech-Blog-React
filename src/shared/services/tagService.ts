// src/shared/services/tagService.ts

import api from '../utils/axios';
import { Tag } from '../types/Tag';
import { safeApiPost, safeApiPut, safeApiDelete } from '../utils/apiHelpers';

export const fetchTags = () => api.get<Tag[]>('/tags').then((res) => res.data);
export const createTag = (tag: Partial<Tag>) => safeApiPost<Tag>('/tags', tag);
export const updateTag = (id: string, tag: Partial<Tag>) => safeApiPut<Tag>(`/tags/${id}`, tag);
export const deleteTag = (id: string) => safeApiDelete(`/tags/${id}`);
export const getPostsByTag = (slug: string) =>
  api.get(`/tags/${slug}/posts`).then((res) => res.data);
