// /src/features/projects/CtaBand/CtaBand.tsx

'use strict';

import React from 'react';
import './CtaBand.scss';

export type CtaAlign = 'left' | 'center';
export type CtaTone = 'surface' | 'accent';

export interface CtaBandProps {
  title: string;
  text?: string;
  primary?: { label: string; href: string; ariaLabel?: string; target?: '_blank' | '_self' };
  secondary?: { label: string; href: string; ariaLabel?: string; target?: '_blank' | '_self' };
  align?: CtaAlign;
  tone?: CtaTone;
  compact?: boolean;
  ariaLabel?: string;
}

const CtaBand: React.FC<CtaBandProps> = ({
  title,
  text,
  primary,
  secondary,
  align = 'center',
  tone = 'surface',
  compact = false,
  ariaLabel = 'Chamada para ação',
}) => {
  const cls = ['cta', `cta--${align}`, `cta--${tone}`, compact ? 'cta--compact' : '']
    .filter(Boolean)
    .join(' ');

  const LinkBtn: React.FC<{
    href: string;
    label: string;
    variant: 'primary' | 'secondary' | 'ghost';
    aria: string;
    target?: '_blank' | '_self';
  }> = ({ href, label, variant, aria, target = '_self' }) => (
    <a className={`cta__btn cta__btn--${variant}`} href={href} aria-label={aria} target={target}>
      {label}
    </a>
  );

  return (
    <section className={cls} aria-label={ariaLabel}>
      <div className='cta__inner'>
        <header className='cta__header'>
          <h2 className='cta__title'>{title}</h2>
          {text && <p className='cta__text'>{text}</p>}
        </header>

        {(primary || secondary) && (
          <div className='cta__actions' role='group' aria-label='Ações'>
            {primary && (
              <LinkBtn
                href={primary.href}
                label={primary.label}
                variant='primary'
                aria={primary.ariaLabel || primary.label}
                target={primary.target}
              />
            )}
            {secondary && (
              <LinkBtn
                href={secondary.href}
                label={secondary.label}
                variant='secondary'
                aria={secondary.ariaLabel || secondary.label}
                target={secondary.target}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CtaBand;
