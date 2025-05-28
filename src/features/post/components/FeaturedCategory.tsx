// src/features/post/components/FeaturedCategory.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';

interface FeaturedCategoryProps {
  post?: Post;
  lang?: string; // Opcional: para forçar idioma, mas geralmente vem do contexto i18n
}

export const FeaturedCategory = ({ post, lang }: FeaturedCategoryProps) => {
  const { i18n } = useTranslation();
  // Usa idioma do contexto se não for passado por prop
  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  // Fallback: usa o primeiro idioma disponível se não houver tradução no atual
  const translation = post.translations[currentLang] ||
    Object.values(post.translations).find(Boolean) || { title: '', description: '', content: '' };

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
        <span className='featured__category'>
          {Array.isArray(post.categories) && post.categories.length > 0
            ? post.categories[0]
            : 'Uncategorized'}
        </span>
        <h2 className='featured__title'>{translation.title || 'No title'}</h2>
        <p className='featured__description'>{translation.description || ''}</p>
        <Link to={`/posts/${post.slug}`} className='featured__link'>
          Read Full Article
        </Link>
      </div>
    </div>
  );
};
