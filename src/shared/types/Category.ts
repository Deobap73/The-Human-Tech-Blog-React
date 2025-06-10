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

// Modelo tradicional (usado em admin, edit, etc.)
export interface Category {
  _id: string;
  slug: string;
  logo?: string;
  translations?: CategoryTranslations; // Pode ou não existir
  translation?: CategoryTranslation; // Pode ou não existir
}

/**
 * Payload for creating or updating a category.
 * Can be customized to match backend expectations.
 */
export interface CategoryPayload {
  translations: CategoryTranslations;
  logo?: string;
  slug?: string;
}
