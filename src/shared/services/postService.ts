// /src/shared/services/postService.ts

import api from '../utils/axios';
import { Post } from '../types/Post';

export interface PostData {
  title: string;
  description: string;
  content: string;
  tags?: string[];
  categories?: string[];
  image?: string;
  isQuickPost?: boolean;
  translations?: {
    pt?: Partial<PostData>;
    de?: Partial<PostData>;
    es?: Partial<PostData>;
  };
}

/**
 * Create a new post (bypassing draft)
 */
export async function createPost(data: PostData) {
  const resToken = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = resToken.data.csrfToken;

  const response = await api.post('/posts', data, {
    headers: {
      'x-csrf-token': csrfToken,
    },
    withCredentials: true,
  });

  return response.data.post;
}

/**
 * Fetch a published post by ID
 */
export async function fetchPost(id: string) {
  const res = await api.get(`/posts/${id}`, { withCredentials: true });
  return res.data.post;
}

/**
 * Update a published post
 */
export async function updatePost(id: string, data: Partial<PostData>) {
  const resToken = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = resToken.data.csrfToken;

  const res = await api.patch(`/posts/${id}`, data, {
    headers: {
      'x-csrf-token': csrfToken,
    },
    withCredentials: true,
  });
  return res.data.post;
}

export async function uploadPostImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const resToken = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = resToken.data.csrfToken;

  const res = await api.post('/posts/upload', formData, {
    headers: {
      'x-csrf-token': csrfToken,
    },
    withCredentials: true,
  });

  return res.data;
}

/**
 * Fetch all QuickPosts (short-form articles)
 */
export async function getQuickPosts() {
  const res = await api.get<Post[]>('/posts?quick=true', { withCredentials: true });
  return res.data;
}
