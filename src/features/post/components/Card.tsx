// The-Human-Tech-Blog-React/src/features/post/components/Card.tsx

import '../styles/Card.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { BookmarkButton } from './BookmarkButton';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

type CardProps = {
  post?: Post;
  lang: string;
};

export const Card = ({ post, lang }: CardProps) => {
  if (!post) return null;
  if (!isValidPost(post, lang)) return null;

  const translation = getPostTranslation(post.translations, lang);

  // Category label for UI only
  let category = '';
  if (
    Array.isArray(post.categories) &&
    post.categories.length > 0 &&
    typeof post.categories[0] === 'object'
  ) {
    category = getCategoryName(post.categories[0] as any, lang);
  }

  const fullDescription = translation.description || '';
  const displayDescription =
    fullDescription.length > 60 ? fullDescription.substring(0, 60) + '...' : fullDescription;

  const postUrl = `/${lang}/posts/${post.slug}`;

  return (
    <div className='card-post' data-analytics-location='post_card'>
      <img
        src={post.image}
        alt={translation.title || 'No title'}
        className='card-post__image'
        loading='lazy'
      />

      <div className='card-post__description-container'>
        <span className='card-post__category'>{category}</span>

        <div className='card-post__text-content'>
          <p className='card-post__description'>{displayDescription}</p>
          <div className='card-post__actions'>
            <Link
              to={postUrl}
              className='card-post__read-more-link'
              data-analytics-event='content_click'
              data-analytics-link-text='Read More'
              data-analytics-link-location='post_card'
              data-analytics-content-type='post'
              data-analytics-content-slug={post.slug}
              data-analytics-link-url={postUrl}>
              Read More
            </Link>

            <BookmarkButton postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
