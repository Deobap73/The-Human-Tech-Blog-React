// /src/features/layout/navbarConfig.ts
import { TFunction } from 'i18next';

// Import backgrounds using ES modules — this is more robust in Vite/React
import homePageBg from '../../assets/homePage.webp';
import aboutPageBg from '../../assets/aboutPage.webp';
import contactPageBg from '../../assets/contactPage.webp';

export interface NavbarConfig {
  background?: string; // Path to the image, or undefined to hide
  showTile?: boolean;
  tileTitle?: (t: TFunction) => string;
  tileDescription?: (t: TFunction) => string;
  hideNavbar?: boolean; // <--- Add this new property
}

export const navbarConfigs: Record<string, NavbarConfig> = {
  '/': {
    background: homePageBg,
    showTile: true,
    tileTitle: (t) => t('navbar.title.home'),
    tileDescription: (t) => t('navbar.description.home'),
  },
  '/about': {
    background: aboutPageBg,
    showTile: true,
    tileTitle: (t) => t('navbar.title.about'),
    tileDescription: (t) => t('navbar.description.about'),
  },
  '/contact': {
    background: contactPageBg,
    showTile: true,
    tileTitle: (t) => t('navbar.title.contact'),
    tileDescription: (t) => t('navbar.description.contact'),
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
  '/chat': {
    showTile: false,
    background: undefined,
    hideNavbar: true, // <--- Set this to true for the chat page
  },
  // Add more routes as needed
};

export function getNavbarConfig(pathname: string): NavbarConfig {
  // Remove language prefix, e.g., /en/about → /about
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

  // 1. Exact match
  if (navbarConfigs[path]) {
    return navbarConfigs[path];
  }

  // 2. Verifica se está em SinglePostPage: /posts/:slug
  if (/^\/posts\/[^/]+/.test(path)) {
    return navbarConfigs['/posts/'];
  }

  // 3. Starts with route
  const match = Object.keys(navbarConfigs).find((route) => route !== '/' && path.startsWith(route));
  if (match) {
    return navbarConfigs[match];
  }

  // 4. Fallback home
  return navbarConfigs['/'] || { showTile: false };
}
