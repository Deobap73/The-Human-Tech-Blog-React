// The-Human-Tech-Blog-React/src/components/myFavoritePost/MyFavoritePost.tsx

import './MyFavoritePost.scss';
import { Post } from '../../types/Post';
import { isValidPost } from '../../utils/validation';

export const MyFavoritePost = ({ post }: { post?: Post }) => {
  if (!post || !isValidPost(post)) return null;

  return (
    <div className='myFavoritePost'>
      <img className='myFavoritePost__image' src={post.image} alt={post.title} />
      <div className='myFavoritePost__text'>
        <span className='myFavoritePost__text__category'>{post.categories?.[0]?.name}</span>
        <h2 className='myFavoritePost__text__title'>{post.title}</h2>
        <p className='myFavoritePost__text__excerpt'>{post.description}</p>
      </div>
    </div>
  );
};
