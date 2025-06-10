// src/shared/services/tagService.ts

import api from '../utils/axios';
import { Tag } from '../types/Tag';

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

export const fetchTags = () => api.get<Tag[]>('/tags').then((res) => res.data);

// FORÇA o envio do header x-csrf-token!
export const createTag = (tag: Partial<Tag>) => {
  const csrfToken = getCookie('XSRF-TOKEN');
  return api
    .post<Tag>('/tags', tag, {
      headers: { 'x-csrf-token': csrfToken },
    })
    .then((res) => res.data);
};

export const updateTag = (id: string, tag: Partial<Tag>) =>
  api.put<Tag>(`/tags/${id}`, tag).then((res) => res.data);

export const deleteTag = (id: string) => api.delete(`/tags/${id}`).then((res) => res.data);

export const getPostsByTag = (slug: string) =>
  api.get(`/tags/${slug}/posts`).then((res) => res.data);
