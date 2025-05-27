// src/shared/services/postService.ts

import api from '../utils/axios';
import { Post, PostPayload } from '../types/Post';

export const fetchPosts = () => api.get<Post[]>('/posts').then((res) => res.data);

export const createPost = (data: PostPayload) =>
  api.post<Post>('/posts', data).then((res) => res.data);

export const updatePost = (id: string, data: PostPayload) =>
  api.patch<Post>(`/posts/${id}`, data).then((res) => res.data);

export const deletePost = (id: string) => api.delete(`/posts/${id}`).then((res) => res.data);

export const fetchPost = (id: string) => api.get<Post>(`/posts/${id}`).then((res) => res.data);
