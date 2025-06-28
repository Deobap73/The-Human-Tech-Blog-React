// src/shared/services/postService.ts

import api from '../utils/axios';
import { Post, PostPayload } from '../types/Post';
import { safeApiPost, safeApiPut, safeApiDelete } from '../utils/apiHelpers';

/**
 * Fetch all posts.
 */
export const fetchPosts = () => api.get<Post[]>('/posts').then((res) => res.data);

/**
 * Create a new post (CSRF protected).
 */
export const createPost = (data: PostPayload) => safeApiPost<Post>('/posts', data);

/**
 * Update a post by ID (CSRF protected, PATCH).
 */
export const updatePost = (id: string, data: PostPayload) =>
  // safeApiPut usa PUT, se só PATCH for permitido pelo backend, adicione um helper safeApiPatch
  safeApiPut<Post>(`/posts/${id}`, data);

/**
 * Delete a post by ID (CSRF protected).
 */
export const deletePost = (id: string) => safeApiDelete(`/posts/${id}`);

/**
 * Fetch a single post by ID.
 */
export const fetchPost = (id: string) => api.get<Post>(`/posts/${id}`).then((res) => res.data);

// Upload post image (CSRF)
export const uploadPostImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  // Importante: não usar JSON nem helpers, mas garantir o token CSRF!
  return safeApiPost<{ imageUrl: string }>('/posts/upload', formData);
};

// Fetch Quick Posts
export const getQuickPosts = () => api.get<Post[]>('/posts?quick=true').then((res) => res.data);
