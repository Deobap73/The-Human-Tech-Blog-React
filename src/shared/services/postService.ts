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
  instagramImage?: string;
  isQuickPost?: boolean;
  isAiPrompt?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

/**
 * Requests a CSRF token from the canonical endpoint.
 * Backend sets XSRF token and CSRF secret cookies, and returns csrfToken in JSON.
 */
const fetchCsrfToken = async (): Promise<string> => {
  const resToken = await api.get('/auth/csrf', { withCredentials: true });

  const token = (resToken.data as { csrfToken?: unknown })?.csrfToken;
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw new Error('Failed to obtain CSRF token from /auth/csrf');
  }

  return token;
};

export async function createPost(data: PostData) {
  const csrfToken = await fetchCsrfToken();

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
  const csrfToken = await fetchCsrfToken();

  const res = await api.put(`/posts/${id}`, data, {
    headers: { 'x-csrf-token': csrfToken },
    withCredentials: true,
  });

  return res.data.post;
}

export async function deletePost(id: string): Promise<{ message: string }> {
  const csrfToken = await fetchCsrfToken();

  const res = await api.delete(`/posts/${id}`, {
    headers: { 'x-csrf-token': csrfToken },
    withCredentials: true,
  });

  return res.data as { message: string };
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

  const csrfToken = await fetchCsrfToken();

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

export type UploadPostInstagramParams = {
  file: File;
  postId?: string;
  slug?: string;
};

export async function uploadPostInstagramImage(params: UploadPostInstagramParams) {
  const formData = new FormData();
  formData.append('image', params.file);

  if (params.postId) formData.append('postId', params.postId);
  if (params.slug) formData.append('slug', params.slug);

  const csrfToken = await fetchCsrfToken();

  const res = await api.post('/uploads/post-instagram', formData, {
    headers: { 'x-csrf-token': csrfToken },
    withCredentials: true,
  });

  return res.data as {
    success: boolean;
    imageUrl: string;
    ticketSeq?: number;
    mode?: 'attached' | 'tmp';
    postId?: string;
    slug?: string;
  };
}

export async function getQuickPosts() {
  const res = await api.get<Post[]>('/posts?quick=true', { withCredentials: true });
  return res.data;
}
