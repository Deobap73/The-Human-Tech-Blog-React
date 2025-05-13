// src/utils/validation.ts

import { Post } from './shared/types/Post';

/**
 * Validates whether a post object has required fields for display.
 */
export const isValidPost = (post: Post): boolean => {
  return Boolean(
    post &&
      typeof post.title === 'string' &&
      typeof post.image === 'string' &&
      typeof post.description === 'string' &&
      post.status === 'published'
  );
};
