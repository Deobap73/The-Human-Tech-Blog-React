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

  // Obter a tradução ativa
  const translation = getPostTranslation(post.translations, lang);

  // Categoria: igual ao SinglePostPage
  let category = '';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const firstCat = post.categories[0];
    if (firstCat && typeof firstCat === 'object' && 'translations' in firstCat) {
      category = getCategoryName(firstCat as any, lang);
    }
  }

  // Fallback: se não tiver categoria populada, mostra vazio ou "Uncategorized"
  // Opcional: category = category || 'Uncategorized';

  const fullDescription = translation.description || '';
  const displayDescription =
    fullDescription.length > 60 ? fullDescription.substring(0, 60) + '...' : fullDescription;

  return (
    <div className='card-post'>
      <img src={post.image} alt={translation.title || 'No title'} className='card-post__image' />

      <div className='card-post__description-container'>
        <span className='card-post__category'>
          {category /* Só mostra nome. Se quiser fallback: category || 'Uncategorized' */}
        </span>

        <div className='card-post__text-content'>
          <p className='card-post__description'>{displayDescription}</p>

          <div className='card-post__actions'>
            <Link to={`/${lang}/posts/${post.slug}`} className='card-post__read-more-link'>
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
