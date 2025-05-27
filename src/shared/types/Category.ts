// /src/shared/types/Category.ts

export interface CategoryTranslation {
  name: string;
  description?: string;
}

export type CategoryTranslations = {
  en: CategoryTranslation;
  pt?: CategoryTranslation;
  de?: CategoryTranslation;
  es?: CategoryTranslation;
  [key: string]: CategoryTranslation | undefined;
};

export interface Category {
  _id: string;
  slug: string;
  logo?: string;
  translations: CategoryTranslations;
}

export interface CategoryPayload {
  translations: CategoryTranslations;
  logo?: string;
}
