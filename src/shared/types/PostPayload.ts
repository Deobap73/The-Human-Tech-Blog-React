// ./src/shared/types/PostPayload.ts
'use strict';

import type { PostTranslations, InstagramImageMeta } from './Post';

export type PostPayload = {
  translations: PostTranslations;
  image?: string;
  instagramImage?: InstagramImageMeta;
  slug?: string;
  categories: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  isQuickPost?: boolean;
  isAiPrompt?: boolean;
};
