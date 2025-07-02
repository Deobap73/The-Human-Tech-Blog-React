// src/features/post/components/QuickPostCard.tsx

import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { getAvatar } from '../../../shared/utils/getAvatar';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';
import '../styles/QuickPostCard.scss';

interface Props {
  post: Post;
  lang: string;
}

type PostUser = {
  _id?: string;
  name?: string;
  avatar?: string;
};
/**
 * Renders a compact Tech Shorts post preview.
 */
export const QuickPostCard = ({ post, lang }: Props) => {
  const translation = getPostTranslation(post.translations, lang);
  if (!translation.title || !translation.description) return null;

  const user: PostUser = (post as any).user || (post as any).author || {};
  return (
    <div className='quick-post-card'>
      <Link to={`/${lang}/posts/${post.slug}`} className='quick-post-card__link'>
        {post.image && (
          <img src={post.image} alt={translation.title} className='quick-post-card__image' />
        )}
        <div className='quick-post-card__content'>
          <h3 className='quick-post-card__title'>
            {translation.title.length > 55
              ? `${translation.title.substring(0, 50)}...`
              : translation.title}
          </h3>
          <p className='quick-post-card__description'>
            <img
              src={getAvatar(user || undefined)}
              alt='User avatar'
              className='quick-post-card__avatar'
              width={48}
              height={48}
            />
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default QuickPostCard;
