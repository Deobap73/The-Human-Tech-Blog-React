// The-Human-Tech-Blog-React/src/features/post/components/LastPost.tsx

import '../styles/LastPost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

interface LastPostProps {
  post?: Post;
  lang: string;
}

export const LastPost = ({ post, lang }: LastPostProps) => {
  if (!post || !isValidPost(post, lang)) return null;

  const translation = getPostTranslation(post.translations, lang);
  const firstCategory = post.categories?.[0] || 'Uncategorized';

  return (
    <div className='lastPost'>
      <h2 className='title'>Latest Post</h2>
      <div className='content'>
        <img
          src={post.image || '/default-image.jpg'}
          alt={translation.title || 'No Title'}
          className='postImage'
        />
        <div className='details'>
          <div className='category'>
            <span className='categoryName'>{firstCategory}</span>
          </div>
          <h3 className='postTitle'>{translation.title}</h3>
          <p className='excerpt'>{translation.description}</p>
          <Link to={`/posts/${post.slug}`}>
            <button className='cardPost__descriptionContainer__textContainer__readMore'>
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
