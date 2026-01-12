// src\features\projects\seo\Helmet.tsx

'use strict';

import React, { useEffect } from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  lang?: string;
}

const Helmet: React.FC<HelmetProps> = ({ title, description, canonical, ogImage, lang }) => {
  useEffect(() => {
    const previousTitle = document.title;
    const prevLang = document.documentElement.getAttribute('lang') || undefined;

    if (title) document.title = title;

    const upsertMetaByName = (name: string, content?: string) => {
      if (!content) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const upsertMetaByProp = (property: string, content?: string) => {
      if (!content) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const upsertLinkRel = (rel: string, href?: string) => {
      if (!href) return;
      let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    upsertMetaByName('description', description);
    upsertLinkRel('canonical', canonical);

    upsertMetaByProp('og:title', title);
    upsertMetaByProp('og:description', description);
    upsertMetaByProp('og:url', canonical);
    upsertMetaByProp('og:image', ogImage);

    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', ogImage);
    upsertMetaByName('twitter:card', ogImage ? 'summary_large_image' : 'summary');

    if (lang) document.documentElement.setAttribute('lang', lang);

    return () => {
      document.title = previousTitle;
      if (prevLang) document.documentElement.setAttribute('lang', prevLang);
    };
  }, [title, description, canonical, ogImage, lang]);

  return null;
};

export default Helmet;
