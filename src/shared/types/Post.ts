// /src/shared/types/Post.ts

export interface PostTranslation {
  title: string;
  description: string;
  content: string;
}

export type PostTranslations = {
  en: PostTranslation;
  pt?: PostTranslation;
  de?: PostTranslation;
  es?: PostTranslation;
  [key: string]: PostTranslation | undefined;
};

export interface Post {
  _id: string;
  translations: PostTranslations;
  image?: string;
  slug: string;
  categories: string[]; // sempre IDs
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  author?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Payload para criar/atualizar Post
export interface PostPayload {
  translations: PostTranslations;
  image?: string;
  slug?: string;
  categories: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
}
