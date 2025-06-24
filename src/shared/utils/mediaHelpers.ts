// src/shared/utils/mediaHelpers.ts
export function resolveLogoUrl(logo?: string): string {
  if (!logo) return '';
  if (logo.startsWith('http') || logo.startsWith('/')) return logo;
  return `/images/${logo}`;
}
