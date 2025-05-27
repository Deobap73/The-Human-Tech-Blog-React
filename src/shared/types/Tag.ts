// /src/shared/types/Tag.ts

export interface TagTranslation {
  name: string;
  description?: string;
}

export type TagTranslations = {
  en: TagTranslation;
  pt?: TagTranslation;
  de?: TagTranslation;
  es?: TagTranslation;
  [key: string]: TagTranslation | undefined;
};

export interface Tag {
  _id: string;
  slug: string;
  color?: string;
  translations: TagTranslations;
  createdAt: string;
  updatedAt: string;
}

export interface TagPayload {
  translations: TagTranslations;
  color?: string;
}
