// The-Human-Tech-Blog-React\src\components\lastPost\lastPost.tsx

import './LastPost.scss';
import { Post } from '../../types/Post';

export const LastPost = ({ post }: { post: Post }) => {
  return (
    <div className='lastPost'>
      <h2 className='title'>Latest Post</h2>
      <div className='content'>
        <img src={post.image} alt={post.title} className='postImage' />
        <div className='details'>
          <div className='category'>
            <img
              src={`/src/assets/${post.category}.webp`}
              alt={post.category}
              className='categoryLogo'
            />
            <span className='categoryName'>{post.category}</span>
          </div>
          <h3 className='postTitle'>{post.title}</h3>
          <p className='excerpt'>{post.excerpt}</p>
          <button className='readMore'>Read More</button>
        </div>
      </div>
    </div>
  );
};
