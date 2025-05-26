// The-Human-Tech-Blog-React/src/shared/types/Category.ts

export interface CategoryTranslation {
  name: string;
  description?: string;
}

export interface Category {
  _id: string;
  slug: string;
  logo?: string;
  translation: CategoryTranslation;
  translations?: {
    en: CategoryTranslation;
    pt?: CategoryTranslation;
    de?: CategoryTranslation;
    es?: CategoryTranslation;
    [key: string]: CategoryTranslation | undefined;
  };
}
