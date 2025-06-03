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
  '/user': {
    showTile: false,
  },
  // Add more routes as needed
};

export function getNavbarConfig(pathname: string): NavbarConfig {
  // Remove language prefix, e.g., /en/about → /about
  const path = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  // Exact match, or starts with route
  let config = navbarConfigs[path];
  if (!config) {
    const match = Object.keys(navbarConfigs).find(
      (route) => route !== '/' && path.startsWith(route)
    );
    config = (match && navbarConfigs[match]) || navbarConfigs['/'];
  }
  return config || { showTile: false };
}
