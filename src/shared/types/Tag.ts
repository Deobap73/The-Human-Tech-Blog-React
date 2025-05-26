// src/shared/types/Tag.ts

export interface TagTranslation {
  name: string;
  description?: string;
}

export interface Tag {
  _id: string;
  slug: string;
  color?: string;
  translations: {
    en: TagTranslation;
    pt?: TagTranslation;
    de?: TagTranslation;
    es?: TagTranslation;
    [key: string]: TagTranslation | undefined;
  };
  createdAt: string;
  updatedAt: string;
}
