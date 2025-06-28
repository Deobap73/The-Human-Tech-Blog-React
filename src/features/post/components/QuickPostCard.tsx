// src/features/post/components/QuickPostCard.tsx

import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';
import './QuickPostCard.scss';

interface Props {
  post: Post;
  lang: string;
}

/**
 * Renders a compact Tech Shorts post preview.
 */
export const QuickPostCard = ({ post, lang }: Props) => {
  const translation = getPostTranslation(post.translations, lang);
  if (!translation.title || !translation.description) return null;

  return (
    <div className='quick-post-card'>
      <Link to={`/${lang}/posts/${post.slug}`} className='quick-post-card__link'>
        {post.image && (
          <img src={post.image} alt={translation.title} className='quick-post-card__image' />
        )}
        <div className='quick-post-card__content'>
          <h3 className='quick-post-card__title'>{translation.title}</h3>
          <p className='quick-post-card__description'>{translation.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default QuickPostCard;
