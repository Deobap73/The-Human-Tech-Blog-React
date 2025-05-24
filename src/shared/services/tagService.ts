// The-Human-Tech-Blog-React/src/shared/services/tagService.ts

import api from '../utils/axios';
import { Tag } from '../types/Tag';

export const fetchTags = () => api.get<Tag[]>('/tags').then((res) => res.data);
export const createTag = (tag: Partial<Tag>) => api.post<Tag>('/tags', tag).then((res) => res.data);
export const deleteTag = (id: string) => api.delete(`/tags/${id}`).then((res) => res.data);
export const getPostsByTag = (slug: string) =>
  api.get(`/tags/${slug}/posts`).then((res) => res.data);
