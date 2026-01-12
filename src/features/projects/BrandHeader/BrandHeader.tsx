// /src/features/projects/BrandHeader/BrandHeader.tsx

'use strict';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './BrandHeader.scss';

type Props = {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  tertiaryCtaHref?: string;
  tertiaryCtaLabel?: string;
};

const BrandHeader: React.FC<Props> = ({
  title,
  subtitle,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  tertiaryCtaHref,
  tertiaryCtaLabel,
}) => {
  const { t } = useTranslation();

  const brandTitle = title ?? 'The Human Tech Digitals';
  const brandSubtitle =
    subtitle ?? t('projectsBrand.subtitle', 'Frontend, product, automation, and content');
  const brandDescription =
    description ??
    t(
      'projectsBrand.description',
      'I build calm, clear web experiences, and I ship them with strong structure, clean UI, and practical automation.'
    );

  const ctaPrimaryHref = primaryCtaHref ?? '/contact';
  const ctaPrimaryLabel = primaryCtaLabel ?? t('projectsBrand.ctaPrimary', 'Talk to me');

  const ctaSecondaryHref = secondaryCtaHref ?? 'https://github.com/Deobap73';
  const ctaSecondaryLabel = secondaryCtaLabel ?? t('projectsBrand.ctaSecondary', 'GitHub');

  const ctaTertiaryHref = tertiaryCtaHref ?? 'https://thehumantechblog.com/';
  const ctaTertiaryLabel = tertiaryCtaLabel ?? t('projectsBrand.ctaTertiary', 'Read the blog');

  return (
    <header className='brandHeader'>
      <div className='brandHeader__inner'>
        <h1 className='brandHeader__title'>{brandTitle}</h1>
        <p className='brandHeader__subtitle'>{brandSubtitle}</p>

        <p className='brandHeader__description'>{brandDescription}</p>

        <div
          className='brandHeader__actions'
          aria-label={t('projectsBrand.actions', 'Brand actions')}>
          <a className='brandHeader__btn brandHeader__btn--primary' href={ctaPrimaryHref}>
            {ctaPrimaryLabel}
          </a>

          <a
            className='brandHeader__btn brandHeader__btn--secondary'
            href={ctaSecondaryHref}
            target='_blank'
            rel='noreferrer'>
            {ctaSecondaryLabel}
          </a>

          <a
            className='brandHeader__btn brandHeader__btn--ghost'
            href={ctaTertiaryHref}
            target='_blank'
            rel='noreferrer'>
            {ctaTertiaryLabel}
          </a>
        </div>
      </div>
    </header>
  );
};

export default BrandHeader;
