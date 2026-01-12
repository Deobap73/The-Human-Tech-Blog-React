// /src/features/layout/navbarConfig.ts

'use strict';

import { TFunction } from 'i18next';

import homePageBg from '../../assets/homePage.webp';
import aboutPageBg from '../../assets/aboutPage.webp';
import contactPageBg from '../../assets/contactPage.webp';
import techShortsPage from '../../assets/techShortsPage.webp';
import aiPromptPage from '../../assets/aiPromptPage.webp';
import projectsPage from '../../assets/projectsPage.webp';

export interface NavbarConfig {
  background?: string;
  showTile?: boolean;
  tileTitle?: (t: TFunction) => string;
  tileDescription?: (t: TFunction) => string;
  hideNavbar?: boolean;
}

function safeT(t: TFunction, key: string, defaultValue?: string): string {
  const value = defaultValue !== undefined ? t(key, { defaultValue }) : t(key);
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
  // Projects list
  '/projects': {
    background: projectsPage,
    showTile: false,
    tileTitle: (t) => safeT(t, 'navbar.title.projects', 'Projects'),
    tileDescription: (t) =>
      safeT(t, 'navbar.description.projects', 'Figma drafts, UI, and full projects'),
  },
  // Projects detail (no tile — clean header)
  '/projects/': {
    showTile: false,
    background: projectsPage,
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
};

export function getNavbarConfig(pathname: string): NavbarConfig {
  const path = typeof pathname === 'string' ? pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') : '/';

  // 1. Exact match
  if (typeof path === 'string' && navbarConfigs[path]) {
    return navbarConfigs[path];
  }

  // 2. Single post page: /posts/:slug
  if (typeof path === 'string' && /^\/posts\/[^/]+/.test(path)) {
    return navbarConfigs['/posts/'];
  }

  // Project detail route: /projects/:slug
  if (typeof path === 'string' && /^\/projects\/[^/]+/.test(path)) {
    return navbarConfigs['/projects/'];
  }

  // 3. Starts with route
  const match = Object.keys(navbarConfigs).find(
    (route) => route !== '/' && typeof path === 'string' && path.startsWith(route)
  );
  if (match) {
    return navbarConfigs[match];
  }

  // 4. Fallback
  return navbarConfigs['/'] || { showTile: false };
}
