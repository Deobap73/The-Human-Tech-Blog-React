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
  console.log('[LastPost] Component rendered. Received props: { post, lang: ' + lang + ' }');

  if (!post) {
    console.warn('[LastPost] No post object provided. Returning null.');
    return null;
  }

  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    console.error(
      '[LastPost] Provided post object is invalid or invalid for current language:',
      post
    );
    return null;
  }

  console.log(`[LastPost] Valid post found. ID: ${post._id}, Slug: ${post.slug}`);
  const translation = getPostTranslation(post.translations, lang);
  console.log(`[LastPost] Post title from translation: "${translation.title || 'N/A'}"`);

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
  console.log(`[LastPost] Post category: ${firstCategory}`);

  return (
    <div className='lastPost'>
      <h2 className='title'>Latest Post</h2>
      {(() => {
        console.log('[LastPost] "Latest Post" title rendered.');
        return null;
      })()}
      <div className='content'>
        <img
          src={post.image || '/default-image.jpg'}
          alt={translation.title || 'No Title'}
          className='postImage'
        />
        {(() => {
          console.log(`[LastPost] Image source: ${post.image || '/default-image.jpg'}`);
          return null;
        })()}
        <div className='details'>
          <div className='category'>
            <span className='categoryName'>{firstCategory}</span>
            {(() => {
              console.log(`[LastPost] Displaying category: "${firstCategory}"`);
              return null;
            })()}
          </div>
          <h3 className='postTitle'>{translation.title}</h3>
          {(() => {
            console.log(`[LastPost] Displaying post title: "${translation.title}"`);
            return null;
          })()}
          <p className='excerpt'>{translation.description}</p>
          {(() => {
            console.log(
              `[LastPost] Displaying post description (excerpt): "${(
                translation.description || ''
              ).substring(0, 50)}..."`
            );
            return null;
          })()}
          <Link to={`/${lang}/posts/${post.slug}`}>
            <button className='cardPost__descriptionContainer__textContainer__readMore'>
              Read More
            </button>
          </Link>

          {(() => {
            console.log(`[LastPost] "Read More" link points to: /posts/${post.slug}`);
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};
