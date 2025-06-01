// The-Human-Tech-Blog-React/src/features/post/components/FeaturedCategory.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

interface FeaturedCategoryProps {
  post?: Post;
  lang: string;
}

export const FeaturedCategory = ({ post, lang }: FeaturedCategoryProps) => {
  if (!post) {
    return null;
  }

  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    return null;
  }

  const translation = getPostTranslation(post.translations, lang);

  // Safe category display (populated or not)
  let firstCategory = 'Uncategorized';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0];
    if (cat && typeof cat === 'object' && 'translations' in cat) {
      firstCategory = getCategoryName(cat as any, lang);
    } else if (typeof cat === 'string') {
      firstCategory = cat;
    }
  }

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
        <Link to={`/${lang}/posts/${post.slug}`} className='featured__link'>
          Read Full Article
        </Link>
      </div>
    </div>
  );
};
