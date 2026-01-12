// ./src/shared/services/postService.ts
'use strict';

import api from '../utils/axios';
import type { Post } from '../types/Post';

export interface PostData {
  translations: {
    en: { title: string; description: string; content: string };
    pt?: { title: string; description: string; content: string };
    de?: { title: string; description: string; content: string };
    es?: { title: string; description: string; content: string };
  };
  tags?: string[];
  categories?: string[];
  image?: string;
  isQuickPost?: boolean;
  isAiPrompt?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export async function createPost(data: PostData) {
  const resToken = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = resToken.data.csrfToken;

  const response = await api.post('/posts', data, {
    headers: { 'x-csrf-token': csrfToken },
    withCredentials: true,
  });

  return response.data.post;
}

export async function fetchPost(id: string) {
  const res = await api.get(`/posts/${id}`, { withCredentials: true });
  return res.data;
}

export async function updatePost(id: string, data: Partial<PostData>) {
  const resToken = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = resToken.data.csrfToken;

  const res = await api.put(`/posts/${id}`, data, {
    headers: { 'x-csrf-token': csrfToken },
    withCredentials: true,
  });

  return res.data.post;
}

export type UploadPostCoverParams = {
  file: File;
  isQuickPost: boolean;
  isAiPrompt: boolean;
  categoryId?: string;
};

export async function uploadPostImage(params: UploadPostCoverParams) {
  const formData = new FormData();
  formData.append('image', params.file);
  formData.append('isQuickPost', String(params.isQuickPost));
  formData.append('isAiPrompt', String(params.isAiPrompt));
  if (params.categoryId) formData.append('categoryId', params.categoryId);

  const resToken = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = resToken.data.csrfToken;

  const res = await api.post('/uploads/post-cover', formData, {
    headers: { 'x-csrf-token': csrfToken },
    withCredentials: true,
  });

  return res.data as {
    success: boolean;
    imageUrl: string;
    publicId: string;
    displayName: string;
    ticketSeq: number;
    folder: string;
    folderName: string;
    reason: string;
  };
}

export async function getQuickPosts() {
  const res = await api.get<Post[]>('/posts?quick=true', { withCredentials: true });
  return res.data;
}
