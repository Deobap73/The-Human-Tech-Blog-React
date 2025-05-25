// The-Human-Tech-Blog-React/src/shared/services/categoryService.ts

import api from '../utils/axios';
import { Category } from '../types/Category';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories');
  return res.data;
};
