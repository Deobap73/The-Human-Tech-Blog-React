// src/shared/utils/i18nHelpers.ts
import { Post, PostTranslation, PostTranslations } from '../types/Post';
import { Category } from '../types/Category';

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

export const getCategoryName = (cat: Category, lang: string = 'en'): string => {
  return (
    cat.translations?.[lang]?.name ||
    cat.translations?.[lang.split('-')[0]]?.name ||
    cat.translations?.en?.name ||
    Object.values(cat.translations || {})[0]?.name ||
    cat.slug
  );
};
