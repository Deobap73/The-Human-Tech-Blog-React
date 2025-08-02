// src/features/post/components/QuickPostCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { getAvatar } from '../../../shared/utils/getAvatar';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';
import '../styles/QuickPostCard.scss';

interface Props {
  post: Post;
  lang: string;
}

/**
 * Renders a Tech Short (QuickPost) card with category, image, title, and meta.
 */
const QuickPostCard: React.FC<Props> = ({ post, lang }) => {
  const translation = getPostTranslation(post.translations, lang);
  if (!translation.title || !translation.description) return null;

  const user = (post as any).user || (post as any).author || {};

  // Category is a string ID; resolve logo URL from that ID
  const categoryId = post.categories?.[0];
  const categoryName = getCategoryName(categoryId, lang);
  const categoryLogo = categoryId ? resolveLogoUrl(categoryId) : '/default-logo.png';

  return (
    <div className='quick-post-card'>
      <Link to={`/${lang}/posts/${post.slug}`} className='quick-post-card__link'>
        <div className='quick-post-card__img-wrap'>
          <img
            src={post.image || '/no-image.webp'}
            alt={translation.title}
            className='quick-post-card__image'
            loading='lazy'
          />
          <div className='quick-post-card__overlay' />
          <div className='quick-post-card__category'>
            <img
              src={categoryLogo}
              alt={categoryName}
              className='quick-post-card__category-logo'
              height={28}
              width={28}
              loading='lazy'
            />
            <span className='quick-post-card__category-label'>{categoryName}</span>
          </div>
        </div>
        <div className='quick-post-card__content'>
          <h3 className='quick-post-card__title'>
            {translation.title.length > 50
              ? translation.title.slice(0, 50) + '...'
              : translation.title}
          </h3>
          <div>
            <p className='quick-post-card__desc'>
              {translation.description.length > 120
                ? translation.description.slice(0, 120) + '...'
                : translation.description}
            </p>
            <div className='quick-post-card__meta'>
              <img
                src={getAvatar(user)}
                alt='User avatar'
                className='quick-post-card__avatar'
                width={38}
                height={38}
                loading='lazy'
              />
              <span className='quick-post-card__date'>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default QuickPostCard;
