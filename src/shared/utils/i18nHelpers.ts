// src/shared/utils/i18nHelpers.ts

import { Post, PostTranslation, PostTranslations } from '../types/Post';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';

/**
 * Returns a translated version of the post for the given language (with safe fallback).
 */
export const getPostTranslation = (
  translations: PostTranslations,
  lang: string = 'en'
): PostTranslation => {
  return (
    translations[lang] ||
    translations[lang.split('-')[0]] ||
    translations['en'] ||
    Object.values(translations)[0] || { title: '', description: '', content: '' }
  );
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
