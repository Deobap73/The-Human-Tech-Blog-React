// The-Human-Tech-Blog-React\src\components\lastPost\lastPost.tsx

import '../styles/LastPost.scss';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';

export const LastPost = ({ post }: { post?: Post }) => {
  if (!post || !isValidPost(post)) return null;

  return (
    <div className='lastPost'>
      <h2 className='title'>Latest Post</h2>
      <div className='content'>
        <img src={post.image} alt={post.title} className='postImage' />
        <div className='details'>
          <div className='category'>
            <img
              src={`/images/${post.categories?.[0]?.logo}`}
              alt={post.category}
              className='categoryLogo'
            />
            <span className='categoryName'>{post.categories?.[0]?.name}</span>
          </div>
          <h3 className='postTitle'>{post.title}</h3>
          <p className='excerpt'>{post.description}</p>
          <button className='readMore'>Read More</button>
        </div>
      </div>
    </div>
  );
};
