// src/shared/utils/validation.ts
import { Post } from '../types/Post';
import { getPostTranslation } from './i18nHelpers';

/**
 * Validates whether a post object has required fields for display, in the current language.
 */
export const isValidPost = (post: Post, lang: string = 'en'): boolean => {
  const t = getPostTranslation(post.translations, lang);
  return Boolean(post && post.status === 'published' && t.title && t.title.trim().length > 0);
};
