// The-Human-Tech-Blog-React/src/features/post/components/Card.tsx

import '../styles/Card.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { BookmarkButton } from './BookmarkButton';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

type CardProps = {
  post?: Post;
  lang: string;
};

export const Card = ({ post, lang }: CardProps) => {
  console.log('[Card] Component rendered. Received props: { post, lang: ' + lang + ' }');
  console.log(`[Card] Language prop received: ${lang}`);

  if (!post) {
    console.warn('[Card] No post object provided to Card component. Returning null.');
    return null;
  }
  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    console.error(
      '[Card] Invalid post object provided to Card component or invalid for current language:',
      post
    );
    return null;
  }

  console.log(`[Card] Post is valid. Processing post ID: ${post._id}, Slug: ${post.slug}`);
  const translation = getPostTranslation(post.translations, lang);
  console.log('[Card] Post translation retrieved:', translation?.title);

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
  console.log(`[Card] Post category: ${category}`);

  const fullDescription = translation.description || '';
  const displayDescription =
    fullDescription.length > 60 ? fullDescription.substring(0, 60) + '...' : fullDescription;
  console.log(
    `[Card] Original description length: ${fullDescription.length}, Displaying (truncated if needed): "${displayDescription}"`
  );

  return (
    <div className='cardPost'>
      console.log('[Card] post.image:', post.image, 'Post slug:', post.slug, post);
      <img src={post.image} alt={translation.title || 'No title'} className='cardPost__image' />
      {(() => {
        console.log(`[Card] Image source: ${post.image || 'N/A'}`);
        return null;
      })()}
      <div className='cardPost__descriptionContainer'>
        <span className='cardPost__descriptionContainer__category'>{category}</span>
        {(() => {
          console.log(`[Card] Displaying category: "${category}"`);
          return null;
        })()}
        <div className='cardPost__descriptionContainer__textContainer'>
          <p className='cardPost__descriptionContainer__textContainer__description'>
            {displayDescription}
          </p>
          {(() => {
            console.log(`[Card] Displaying description: "${displayDescription}"`);
            return null;
          })()}
          <div>
            <Link to={`/${lang}/posts/${post.slug}`}>
              <button className='cardPost__descriptionContainer__textContainer__readMore'>
                Read More
              </button>
            </Link>
            {(() => {
              console.log(`[Card] "Read More" link points to: /posts/${post.slug}`);
              return null;
            })()}
            <BookmarkButton postId={post._id} />
            {(() => {
              console.log(`[Card] BookmarkButton rendered for postId: ${post._id}`);
              return null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
