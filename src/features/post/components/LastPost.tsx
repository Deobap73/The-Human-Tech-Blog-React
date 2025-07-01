// /src/features/post/components/LastPost.tsx

import '../styles/LastPost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';

interface LastPostProps {
  post?: Post;
  lang: string;
}

export const LastPost = ({ post, lang }: LastPostProps) => {
  if (!post || post.isQuickPost === true) {
    /*  console.log('[DEBUG] LastPost skipped: isQuickPost === true'); */
    return null;
  }

  const translation =
    getPostTranslation(post.translations, lang) || getPostTranslation(post.translations, 'en');

  if (!translation?.title?.trim()) {
    /* console.log('[DEBUG] LastPost skipped: missing title'); */
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
    <section className='lastPost'>
      <div className='lastPost__content'>
        <span className='lastPost__category'>{firstCategory}</span>
        <h2 className='lastPost__title'>{translation.title}</h2>
        <p className='lastPost__description'>{translation.description}</p>
        <Link to={`/${lang}/posts/${post.slug}`} className='lastPost__link'>
          Read More
        </Link>
      </div>
      <div className='lastPost__image-container'>
        <img src={imageSrc} alt={translation.title} className='lastPost__image' />
      </div>
    </section>
  );
};

export default LastPost;
