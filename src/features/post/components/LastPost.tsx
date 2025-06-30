// src/features/post/components/LastPost.tsx

import '../styles/LastPost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';

interface LastPostProps {
  post?: Post;
  lang: string;
}

export const LastPost = ({ post, lang }: LastPostProps) => {
  if (!post || post.isQuickPost) return null;

  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) return null;

  const translation = getPostTranslation(post.translations, lang);

  // Safe category display (populated or not)
  let firstCategory = 'Uncategorized';
  let firstLogo = '';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0];
    if (cat && typeof cat === 'object' && 'translations' in cat) {
      firstCategory = getCategoryName(cat as any, lang);
      // @ts-ignore
      firstLogo = resolveLogoUrl((cat as any).logo);
    } else if (typeof cat === 'string') {
      firstCategory = cat;
    }
  }

  // Fallback: image do post > logo da categoria > default
  const imageSrc = post.image || firstLogo || '/default-image.jpg';

  return (
    <section className='lastPost'>
      <div className='lastPost__content'>
        <span className='lastPost__category'>{firstCategory}</span>
        <h2 className='lastPost__title'>{translation.title || 'No Title'}</h2>
        <p className='lastPost__description'>{translation.description}</p>
        <Link to={`/${lang}/posts/${post.slug}`} className='lastPost__link'>
          Read More
        </Link>
      </div>
      <div className='lastPost__image-container'>
        <img src={imageSrc} alt={translation.title || 'No Title'} className='lastPost__image' />
      </div>
    </section>
  );
};

export default LastPost;
