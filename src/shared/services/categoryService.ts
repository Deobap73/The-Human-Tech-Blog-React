// src/shared/services/categoryService.ts

import api from '../utils/axios';
import { Category, CategoryPayload } from '../types/Category';

export const fetchCategories = () => api.get<Category[]>('/categories').then((res) => res.data);

export const createCategory = (data: CategoryPayload) =>
  api.post<Category>('/categories', data).then((res) => res.data);

export const updateCategory = (id: string, data: CategoryPayload) =>
  api.put<Category>(`/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`).then((res) => res.data);

export const getPostsByCategory = (slug: string) =>
  api.get(`/categories/${slug}/posts`).then((res) => res.data);

export const getCategoryBySlug = (slug: string) =>
  api.get<Category>(`/categories/${slug}`).then((res) => res.data);
