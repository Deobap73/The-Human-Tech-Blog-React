// /src/shared/types/Post.ts

export interface PostTranslation {
  title: string;
  description: string;
  content: string;
}

export interface Post {
  _id: string;
  translations: {
    en: PostTranslation;
    pt?: PostTranslation;
    de?: PostTranslation;
    es?: PostTranslation;
    [key: string]: PostTranslation | undefined;
  };
  image?: string;
  slug: string;
  categories: string[];
  tags?: string[];

  status: 'draft' | 'published' | 'archived';
  author?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
