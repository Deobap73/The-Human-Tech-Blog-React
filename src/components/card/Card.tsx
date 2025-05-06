// The-Human-Tech-Blog-React/src/components/card/Card.tsx

import './Card.scss';
import { Post } from '../../types/Post';
import { BookmarkButton } from '../bookmarks/BookmarkButton';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../utils/validation';

type CardProps = {
  post?: Post;
};

export const Card = ({ post }: CardProps) => {
  if (!post || !isValidPost(post)) return null;

  return (
    <div className='cardPost'>
      <img src={post.image} alt={post.title} className='cardPost__image' />
      <div className='cardPost__descriptionContainer'>
        <span className='cardPost__descriptionContainer__category'>
          {post.categories?.[0]?.name}
        </span>
        <div className='cardPost__descriptionContainer__textContainer'>
          <p className='cardPost__descriptionContainer__textContainer__description'>
            {post.description.length > 60
              ? post.description.substring(0, 60) + '...'
              : post.description}
          </p>
          <div>
            <Link to={`/posts/${post.slug}`}>
              <button className='cardPost__descriptionContainer__textContainer__readMore'>
                Read More
              </button>
            </Link>
            <BookmarkButton postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
};
