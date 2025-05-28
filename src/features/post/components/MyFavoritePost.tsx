// src/components/myFavoritePost/MyFavoritePost.tsx

import '../styles/MyFavoritePost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';

export const MyFavoritePost = ({ post }: { post?: Post }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  const translation = post.translations[lang] ||
    Object.values(post.translations).find(Boolean) || { title: '', description: '', content: '' };

  return (
    <div className='myFavoritePost'>
      <img className='myFavoritePost__image' src={post.image} alt={translation.title} />
      <div className='myFavoritePost__text'>
        <span className='myFavoritePost__text__category'>
          {post.categories?.[0] || 'Uncategorized'}
        </span>
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
