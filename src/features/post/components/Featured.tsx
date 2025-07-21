// /src/features/post/components/Featured.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';

interface FeaturedProps {
  post?: Post;
  lang: string;
}

export const Featured = ({ post, lang }: FeaturedProps) => {
  if (!post || post.isQuickPost === true || post.isAiPrompt === true) {
    return null;
  }

  const translation =
    getPostTranslation(post.translations, lang) || getPostTranslation(post.translations, 'en');

  if (!translation?.title?.trim()) {
    /*     console.log('[DEBUG] Featured skipped: missing title'); */
    return null;
  }

  const firstCategory =
    Array.isArray(post.categories) && post.categories.length > 0
      ? getCategoryName(post.categories[0] as any, lang)
      : 'Uncategorized';

  const firstLogo =
    Array.isArray(post.categories) && post.categories.length > 0
      ? resolveLogoUrl((post.categories[0] as any).logo)
      : '';

  const imageSrc = post.image || firstLogo || '/default-image.jpg';

  return (
    <section className='featured'>
      <div className='featured__image-container'>
        <img src={imageSrc} alt={translation.title || 'No title'} className='featured__image' />
      </div>
      <div className='featured__content'>
        <span className='featured__category'>{firstCategory}</span>
        <h2 className='featured__title'>{translation.title}</h2>
        <p className='featured__description'>{translation.description || ''}</p>
        <Link to={`/${lang}/posts/${post.slug}`} className='featured__link'>
          Read Full Article
        </Link>
      </div>
    </section>
  );
};

export default Featured;
