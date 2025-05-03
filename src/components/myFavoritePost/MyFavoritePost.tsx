// The-Human-Tech-Blog-React\src\components\myFavoritePost\MyFavoritePost.tsx

import './MyFavoritePost.scss';
import { Post } from '../../types/Post';

export const MyFavoritePost = ({ post }: { post: Post }) => {
  return (
    <div className='favoritePost'>
      <h3 className='title'>My Favorite Post</h3>
      <div className='content'>
        <img src={post.image} alt={post.title} className='postImage' />
        <h4 className='postTitle'>{post.title}</h4>
        <p className='excerpt'>{post.excerpt.substring(0, 100)}...</p>
        <button className='readMore'>Read More</button>
      </div>
    </div>
  );
};
