// The-Human-Tech-Blog-React/src/features/post/components/MyFavoritePost.tsx

import '../styles/MyFavoritePost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

interface MyFavoritePostProps {
  post?: Post;
  lang: string;
}

export const MyFavoritePost = ({ post, lang }: MyFavoritePostProps) => {
  console.log('[MyFavoritePost] Component rendered. Received props: { post, lang: ' + lang + ' }');

  if (!post) {
    console.warn('[MyFavoritePost] No post prop received. Component will render null.');
    return null;
  }

  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    console.error(
      '[MyFavoritePost] Received post is invalid or invalid for current language:',
      post
    );
    return null;
  }

  console.log(`[MyFavoritePost] Valid post received. Post ID: ${post._id}, Slug: ${post.slug}`);
  const translation = getPostTranslation(post.translations, lang);
  console.log(`[MyFavoritePost] Post title from translation: "${translation.title || 'N/A'}"`);

  // Safe category display (populated or not)
  let category = 'Uncategorized';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0];
    if (cat && typeof cat === 'object' && 'translations' in cat) {
      category = getCategoryName(cat as any, lang);
    } else if (typeof cat === 'string') {
      category = cat;
    }
  }
  console.log(`[MyFavoritePost] Post category: ${category}`);

  return (
    <div className='myFavoritePost'>
      <img
        className='myFavoritePost__image'
        src={post.image}
        alt={translation.title || 'No Title Available'}
      />
      {(() => {
        console.log(`[MyFavoritePost] Image source: ${post.image || 'N/A'}`);
        return null;
      })()}
      <div className='myFavoritePost__text'>
        <span className='myFavoritePost__text__category'>{category}</span>
        {(() => {
          console.log(`[MyFavoritePost] Displaying category: "${category}"`);
          return null;
        })()}
        <h2 className='myFavoritePost__text__title'>{translation.title}</h2>
        {(() => {
          console.log(`[MyFavoritePost] Displaying title: "${translation.title}"`);
          return null;
        })()}
        <p className='myFavoritePost__text__excerpt'>{translation.description}</p>
        {(() => {
          console.log(
            `[MyFavoritePost] Displaying excerpt (first 50 chars): "${(
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
          console.log(`[MyFavoritePost] "Read More" link pointing to: /posts/${post.slug}`);
          return null;
        })()}
      </div>
    </div>
  );
};
