// The-Human-Tech-Blog-React/src/features/post/components/FeaturedCategory.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

interface FeaturedCategoryProps {
  post?: Post;
  lang: string;
}

export const FeaturedCategory = ({ post, lang }: FeaturedCategoryProps) => {
  if (!post || !isValidPost(post, lang)) return null;

  const translation = getPostTranslation(post.translations, lang);
  const firstCategory = post.categories?.[0] || 'Uncategorized';

  return (
    <div className='featured'>
      <div className='featured__image-container'>
        <img
          src={post.image || '/default-image.jpg'}
          alt={translation.title || 'No title'}
          className='featured__image'
        />
      </div>
      <div className='featured__content'>
        <span className='featured__category'>{firstCategory}</span>
        <h2 className='featured__title'>{translation.title || 'No title'}</h2>
        <p className='featured__description'>{translation.description || ''}</p>
        <Link to={`/posts/${post.slug}`} className='featured__link'>
          Read Full Article
        </Link>
      </div>
    </div>
  );
};
