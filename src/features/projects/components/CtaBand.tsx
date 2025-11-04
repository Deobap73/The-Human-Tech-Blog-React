'use strict';

/**
 * Path: /src/features/projects/components/CtaBand.tsx
 */

import React from 'react';
import '../styles/CtaBand.scss';

interface CtaBandProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onClick?: () => void;
}

/**
 * CtaBand
 * - Simple, reusable CTA band used in Projects page.
 * - Keeps styling neutral and consumes blog design tokens (colors, radii).
 */
const CtaBand: React.FC<CtaBandProps> = ({
  title = 'Explore my latest projects',
  subtitle = 'Frontend UI, UX · Figma drafts and Full Projects — all in one place.',
  ctaLabel = 'Get in touch',
  ctaHref = '/en/contact',
  onClick,
}) => {
  const isButton = !ctaHref && !!onClick;

  return (
    <section className='ctaBand' aria-label='Projects call to action'>
      <div className='ctaBand__container'>
        <div className='ctaBand__content'>
          <h2 className='ctaBand__title'>{title}</h2>
          <p className='ctaBand__subtitle'>{subtitle}</p>
        </div>

        <div className='ctaBand__actions'>
          {isButton ? (
            <button className='ctaBand__button' type='button' onClick={onClick}>
              {ctaLabel}
            </button>
          ) : (
            <a className='ctaBand__button' href={ctaHref}>
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
