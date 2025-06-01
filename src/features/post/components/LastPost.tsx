// The-Human-Tech-Blog-React/src/features/post/components/LastPost.tsx

import '../styles/LastPost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

interface LastPostProps {
  post?: Post;
  lang: string;
}

export const LastPost = ({ post, lang }: LastPostProps) => {
  if (!post) {
    return null;
  }

  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    return null;
  }

  console.log(`[LastPost] Valid post found. ID: ${post._id}, Slug: ${post.slug}`);
  const translation = getPostTranslation(post.translations, lang);

  // Safe category display (populated or not)
  let firstCategory = 'Uncategorized';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0];
    if (cat && typeof cat === 'object' && 'translations' in cat) {
      firstCategory = getCategoryName(cat as any, lang);
    } else if (typeof cat === 'string') {
      firstCategory = cat;
    }
  }

  return (
    <div className='lastPost'>
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

          <Link to={`/${lang}/posts/${post.slug}`}>
            <button className='cardPost__descriptionContainer__textContainer__readMore'>
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
