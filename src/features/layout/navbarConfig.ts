// /src/features/layout/navbarConfig.ts

import { TFunction } from 'i18next';

// Import backgrounds using ES modules — this is more robust in Vite/React
import homePageBg from '../../assets/homePage.webp';
import aboutPageBg from '../../assets/aboutPage.webp';
import contactPageBg from '../../assets/contactPage.webp';
import techShortsPage from '../../assets/techShortsPage.webp';
import aiPromptPage from '../../assets/aiPromptPage.webp';

export interface NavbarConfig {
  background?: string;
  showTile?: boolean;
  tileTitle?: (t: TFunction) => string;
  tileDescription?: (t: TFunction) => string;
  hideNavbar?: boolean;
}

// Helper to guarantee t() always returns a string
function safeT(t: TFunction, key: string, defaultValue?: string): string {
  let value: string | object;
  if (defaultValue !== undefined) {
    value = t(key, { defaultValue });
  } else {
    value = t(key);
  }
  return typeof value === 'string' ? value : defaultValue ?? '';
}

export const navbarConfigs: Record<string, NavbarConfig> = {
  '/': {
    background: homePageBg,
    showTile: true,
    tileTitle: (t) => safeT(t, 'navbar.title.home', 'Home'),
    tileDescription: (t) => safeT(t, 'navbar.description.home', ''),
  },
  '/about': {
    background: aboutPageBg,
    showTile: true,
    tileTitle: (t) => safeT(t, 'navbar.title.about', 'About'),
    tileDescription: (t) => safeT(t, 'navbar.description.about', ''),
  },
  '/contact': {
    background: contactPageBg,
    showTile: true,
    tileTitle: (t) => safeT(t, 'navbar.title.contact', 'Contact'),
    tileDescription: (t) => safeT(t, 'navbar.description.contact', ''),
  },
  '/shorts': {
    background: techShortsPage,
    showTile: false,
  },
  '/aiprompts': {
    background: aiPromptPage,
    showTile: false,
  },
  '/admin': {
    showTile: false,
  },
  '/write': {
    showTile: false,
  },
  '/user': {
    showTile: false,
  },
  '/posts/': {
    showTile: false,
    background: undefined,
  },
  '/categories/': {
    showTile: false,
    background: undefined,
  },
  '/chat': {
    showTile: false,
    background: undefined,
    hideNavbar: true,
  },
  // Add more routes as needed
};

export function getNavbarConfig(pathname: string): NavbarConfig {
  // Remove language prefix, e.g., /en/about → /about
  const path = typeof pathname === 'string' ? pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') : '/';

  // 1. Exact match
  if (typeof path === 'string' && navbarConfigs[path]) {
    return navbarConfigs[path];
  }

  // 2. Single post page: /posts/:slug
  if (typeof path === 'string' && /^\/posts\/[^/]+/.test(path)) {
    return navbarConfigs['/posts/'];
  }

  // 3. Starts with route (protect against non-string)
  const match = Object.keys(navbarConfigs).find(
    (route) => route !== '/' && typeof path === 'string' && path.startsWith(route)
  );
  if (match) {
    return navbarConfigs[match];
  }

  // 4. Fallback home
  return navbarConfigs['/'] || { showTile: false };
}
