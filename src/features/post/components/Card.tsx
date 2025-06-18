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
  if (!post) {
    return null;
  }
  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    return null;
  }

  console.log(`[Card] Post is valid. Processing post ID: ${post._id}, Slug: ${post.slug}`);
  const translation = getPostTranslation(post.translations, lang);

  // Safe category display (populated or not)
  let category = 'Uncategorized';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0];
    if (cat && typeof cat === 'object' && 'translations' in cat) {
      category = getCategoryName(cat as any, lang);
    } else if (typeof cat === 'string') {
      category = cat;
    }
  }

  const fullDescription = translation.description || '';
  const displayDescription =
    fullDescription.length > 60 ? fullDescription.substring(0, 60) + '...' : fullDescription;

  return (
    <div className='card-post'>
      <img src={post.image} alt={translation.title || 'No title'} className='card-post__image' />

      <div className='card-post__description-container'>
        <span className='card-post__category'>{category}</span>

        <div className='card-post__text-content'>
          <p className='card-post__description'>{displayDescription}</p>

          <div className='card-post__actions'>
            <Link
              to={`/${lang}/posts/${post.slug}`}
              className='card-post__read-more-link' // Adicione a classe do botão aqui
            >
              Read More
            </Link>

            <BookmarkButton postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
};
