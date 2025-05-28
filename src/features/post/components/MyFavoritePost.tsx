// The-Human-Tech-Blog-React/src/components/myFavoritePost/MyFavoritePost.tsx

import '../styles/MyFavoritePost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';

interface MyFavoritePostProps {
  post?: Post;
  lang?: string;
}

export const MyFavoritePost = ({ post, lang }: MyFavoritePostProps) => {
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  // Tradução multilíngue robusta (fallback: primeiro idioma disponível)
  const translation = post.translations[currentLang] ||
    Object.values(post.translations).find(Boolean) || { title: '', description: '', content: '' };

  // Categories é string[] (slug ou nome simples)
  const firstCategory = post.categories?.[0] || 'Uncategorized';

  return (
    <div className='myFavoritePost'>
      <img
        className='myFavoritePost__image'
        src={post.image || '/default-image.jpg'}
        alt={translation.title || 'Favorite post'}
      />
      <div className='myFavoritePost__text'>
        <span className='myFavoritePost__text__category'>{firstCategory}</span>
        <h2 className='myFavoritePost__text__title'>{translation.title}</h2>
        <p className='myFavoritePost__text__excerpt'>{translation.description}</p>
        <Link to={`/posts/${post.slug}`}>
          <button className='cardPost__descriptionContainer__textContainer__readMore'>
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};
