// src/features/post/components/FeaturedCategory.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';

// FeaturedCategory component displays a highlighted post with multilanguage support.
interface FeaturedCategoryProps {
  post?: Post;
  lang?: string;
}

export const FeaturedCategory = ({ post, lang }: FeaturedCategoryProps) => {
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  // Extract safe translation (fallback to first available)
  const translation = post.translations[currentLang] ||
    Object.values(post.translations).find(Boolean) || { title: '', description: '', content: '' };

  // Categories is string[] (slugs or names)
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
