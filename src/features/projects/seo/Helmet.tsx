// /src/shared/seo/Helmet.tsx
'use strict';

import React, { useEffect } from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  lang?: string;
}

/**
 * Minimal Helmet-like helper to update head tags without extra deps.
 * NOTE: Keep it idempotent and clean up previous tags if needed.
 */
const Helmet: React.FC<HelmetProps> = ({ title, description, canonical, ogImage, lang }) => {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    // description
    let descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.name = 'description';
      document.head.appendChild(descTag);
    }
    if (description) descTag.content = description;

    // canonical
    let linkCanon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkCanon) {
      linkCanon = document.createElement('link');
      linkCanon.rel = 'canonical';
      document.head.appendChild(linkCanon);
    }
    if (canonical) linkCanon.href = canonical;

    // Open Graph
    const setOg = (property: string, content?: string) => {
      if (!content) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    if (title) setOg('og:title', title);
    if (description) setOg('og:description', description);
    if (canonical) setOg('og:url', canonical);
    if (ogImage) setOg('og:image', ogImage);

    // Twitter
    const setTw = (name: string, content?: string) => {
      if (!content) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    if (title) setTw('twitter:title', title);
    if (description) setTw('twitter:description', description);
    if (ogImage) setTw('twitter:image', ogImage);
    setTw('twitter:card', ogImage ? 'summary_large_image' : 'summary');

    // lang (document)
    const prevLang = document.documentElement.getAttribute('lang') || undefined;
    if (lang) document.documentElement.setAttribute('lang', lang);

    return () => {
      // Restore only document title and lang; meta tags are left as is for SPA navigation consistency
      document.title = previousTitle;
      if (prevLang) {
        document.documentElement.setAttribute('lang', prevLang);
      }
    };
  }, [title, description, canonical, ogImage, lang]);

  return null;
};

export default Helmet;
