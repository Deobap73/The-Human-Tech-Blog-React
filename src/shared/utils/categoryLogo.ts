// src/shared/utils/categoryLogo.ts
import { Category } from '../types/Category';
import { resolveLogoUrl } from './mediaHelpers';

export function getCategoryLogo(category: string | Category | undefined): string {
  if (
    category &&
    typeof category === 'object' &&
    'logo' in category &&
    typeof category.logo === 'string' &&
    category.logo
  ) {
    return resolveLogoUrl(category.logo);
  }
  return '/default-logo.png';
}
