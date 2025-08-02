// src/features/post/components/ShareButton.tsx

import React from 'react';
import { FiShare2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import '../styles/ShareButton.scss';

interface ShareButtonProps {
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  const handleShare = async () => {
    try {
      // Remove locale prefix from pathname
      const { origin, pathname, search } = window.location;
      const pathNoLocale = pathname.replace(/^\/[a-z]{2}(?=(\/|$))/, '');
      const shareUrl = `${origin}${pathNoLocale}${search}`;

      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert(t('post.share.copied', 'Link copied to clipboard'));
      }
    } catch (err) {
      console.error('Share failed:', err);
      alert(t('post.share.error', 'Failed to share'));
    }
  };

  return (
    <button
      type='button'
      className={className}
      onClick={handleShare}
      aria-label={t('post.share.buttonAria', 'Share this article')}>
      <FiShare2 />
    </button>
  );
};
