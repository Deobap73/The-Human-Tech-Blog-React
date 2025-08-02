// /src/shared/utils/mediaHelpers.ts

export function resolveLogoUrl(logo?: string): string {
  if (!logo) return '';
  if (typeof logo === 'string' && (logo.startsWith('http') || logo.startsWith('/'))) return logo;
  return `/images/${logo}`;
}
