// /src/features/projects/ServicesStrip/ServicesStrip.tsx
'use strict';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './ServicesStrip.scss';

export type ServiceItem = {
  title: string;
  text: string;
};

type Props = {
  items?: ServiceItem[];
};

const ServicesStrip: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation();

  const fallback: ServiceItem[] = [
    {
      title: t('projectsBrand.s1Title', 'Frontend UI systems'),
      text: t('projectsBrand.s1Text', 'Design tokens, components, and clean structure.'),
    },
    {
      title: t('projectsBrand.s2Title', 'Web apps'),
      text: t('projectsBrand.s2Text', 'React, routing, state, and real features that ship.'),
    },
    {
      title: t('projectsBrand.s3Title', 'Automation'),
      text: t('projectsBrand.s3Text', 'Make flows, content pipelines, and practical tooling.'),
    },
    {
      title: t('projectsBrand.s4Title', 'SEO and performance'),
      text: t('projectsBrand.s4Text', 'Sitemaps, indexing, and page speed basics done right.'),
    },
  ];

  const data = items && items.length > 0 ? items : fallback;

  return (
    <section className='servicesStrip' aria-label={t('projectsBrand.services', 'Services')}>
      <div className='servicesStrip__grid'>
        {data.map((it) => (
          <article key={it.title} className='servicesStrip__card'>
            <h2 className='servicesStrip__title'>{it.title}</h2>
            <p className='servicesStrip__text'>{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServicesStrip;
