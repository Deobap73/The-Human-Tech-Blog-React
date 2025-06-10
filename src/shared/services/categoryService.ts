// src/shared/services/categoryService.ts

import api from '../utils/axios';
import { Category, CategoryPayload } from '../types/Category';
import { safeApiPost, safeApiPut, safeApiDelete } from '../utils/apiHelpers';

/**
 * Fetch all categories.
 */
export const fetchCategories = () => api.get<Category[]>('/categories').then((res) => res.data);

/**
 * Create a new category (CSRF protected).
 */
export const createCategory = (data: CategoryPayload) => safeApiPost<Category>('/categories', data);

/**
 * Update a category by ID (CSRF protected).
 */
export const updateCategory = (id: string, data: CategoryPayload) =>
  safeApiPut<Category>(`/categories/${id}`, data);

/**
 * Delete a category by ID (CSRF protected).
 */
export const deleteCategory = (id: string) => safeApiDelete(`/categories/${id}`);

/**
 * Get posts by category slug.
 */
export const getPostsByCategory = (slug: string) =>
  api.get(`/categories/${slug}/posts`).then((res) => res.data);

/**
 * Get category by slug.
 */
export const getCategoryBySlug = (slug: string) =>
  api.get<Category>(`/categories/${slug}`).then((res) => res.data);
