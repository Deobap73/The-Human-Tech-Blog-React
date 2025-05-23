// ✅ The-Human-Tech-Blog-React/src/features/post/components/FeaturedCategory.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../../shared/utils/validation';

interface FeaturedCategoryProps {
  post?: Post;
}

export const FeaturedCategory = ({ post }: FeaturedCategoryProps) => {
  if (!post || !isValidPost(post)) return null;

  return (
    <div className='featured'>
      <div className='featured__image-container'>
        <img src={post.image} alt={post.title} className='featured__image' />
      </div>
      <div className='featured__content'>
        <span className='featured__category'>{post.categories?.[0]?.name || 'Uncategorized'}</span>
        <h2 className='featured__title'>{post.title}</h2>
        <p className='featured__description'>{post.description}</p>
        <Link to={`/posts/${post.slug}`} className='featured__link'>
          Read Full Article
        </Link>
      </div>
    </div>
  );
};
