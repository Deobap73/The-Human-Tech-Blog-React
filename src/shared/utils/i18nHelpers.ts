// src/shared/utils/i18nHelpers.ts

import { Post, PostTranslation, PostTranslations } from '../types/Post';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';

/**
 * Returns a translated version of the post for the given language (with safe fallback).
 * Fallback: active lang → stripped lang (pt-PT → pt) → 'en' → any non-empty translation.
 */
export const getPostTranslation = (
  translations: PostTranslations,
  lang: string = 'en'
): PostTranslation => {
  // Helper to check if a translation object actually has visible content
  const hasContent = (t?: PostTranslation): t is PostTranslation =>
    !!t && ((!!t.title && t.title.trim() !== '') || (!!t.content && t.content.trim() !== ''));

  // 1. Try exact lang (e.g. 'pt')
  if (hasContent(translations[lang])) {
    return translations[lang]!;
  }
  // 2. Try base lang (e.g. 'pt-PT' → 'pt')
  const baseLang = lang.split('-')[0];
  if (lang !== baseLang && hasContent(translations[baseLang])) {
    return translations[baseLang]!;
  }
  // 3. Fallback for English if exists and not empty
  if (hasContent(translations['en'])) {
    return translations['en']!;
  }
  // 4. Fallback for *any* non-empty translation
  for (const key in translations) {
    if (hasContent(translations[key])) {
      return translations[key]!;
    }
  }
  // 5. Empty fallback: always return a valid PostTranslation
  return { title: '', description: '', content: '' };
};

/**
 * Returns the localized name for a category, or its slug as a fallback.
 */
export const getCategoryName = (cat: Category, lang: string = 'en'): string => {
  return (
    cat.translations?.[lang]?.name ||
    cat.translations?.[lang.split('-')[0]]?.name ||
    cat.translations?.en?.name ||
    Object.values(cat.translations || {})[0]?.name ||
    cat.slug
  );
};

/**
 * Returns the localized name for a tag, or its slug as a fallback.
 */
export const getTagName = (tag: Tag, lang: string = 'en'): string => {
  return (
    tag.translations?.[lang]?.name ||
    tag.translations?.[lang.split('-')[0]]?.name ||
    tag.translations?.en?.name ||
    Object.values(tag.translations || {})[0]?.name ||
    tag.slug
  );
};
