// src/components/card/Card.tsx

import './Card.scss';
import { Post } from '../../types/Post';

type CardProps = {
  post: Post;
};

export const Card = ({ post }: CardProps) => {
  return (
    <div className='cardPost'>
      <img src={post.image} alt={post.title} className='cardPost__image' />
      <div className='cardPost__descriptionContainer'>
        <span className='cardPost__descriptionContainer__category'>{post.category}</span>
        <div className='cardPost__descriptionContainer__textContainer'>
          <p className='cardPost__descriptionContainer__textContainer__excerpt'>
            {post.excerpt.length > 60 ? post.excerpt.substring(0, 60) + '...' : post.excerpt}
          </p>
          <button className='cardPost__descriptionContainer__textContainer__readMore'>
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};
