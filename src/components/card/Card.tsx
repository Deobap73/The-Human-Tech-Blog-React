// The-Human-Tech-Blog-React/src/components/card/Card.tsx

import './Card.scss';
import { Post } from '../../types/Post';

// CardProps receives a Post object for rendering preview content
type CardProps = {
  post: Post;
};

export const Card = ({ post }: CardProps) => {
  const excerpt = post.excerpt.length > 60 ? `${post.excerpt.substring(0, 60)}...` : post.excerpt;

  return (
    <div className='card'>
      <img src={post.image} alt={post.title} className='card__image' />
      <div className='card__body'>
        <span className='card__category'>{post.category}</span>
        <div className='card__text'>
          <p className='card__excerpt'>{excerpt}</p>
          <button className='card__read-more'>Read More</button>
        </div>
      </div>
    </div>
  );
};
