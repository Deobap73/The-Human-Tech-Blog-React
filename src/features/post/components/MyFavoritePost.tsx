// The-Human-Tech-Blog-React/src/features/post/components/MyFavoritePost.tsx

import '../styles/MyFavoritePost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

interface MyFavoritePostProps {
  post?: Post;
  lang: string;
}

export const MyFavoritePost = ({ post, lang }: MyFavoritePostProps) => {
  if (!post || !isValidPost(post, lang)) return null;

  const translation = getPostTranslation(post.translations, lang);
  const category = post.categories?.[0] || 'Uncategorized';

  return (
    <div className='myFavoritePost'>
      <img
        className='myFavoritePost__image'
        src={post.image}
        alt={translation.title || 'No Title Available'}
      />
      <div className='myFavoritePost__text'>
        <span className='myFavoritePost__text__category'>{category}</span>
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
