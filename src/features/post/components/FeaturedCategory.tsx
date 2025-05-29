// The-Human-Tech-Blog-React/src/features/post/components/FeaturedCategory.tsx

import '../../post/styles/Featured.scss';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

interface FeaturedCategoryProps {
  post?: Post;
  lang: string;
}

export const FeaturedCategory = ({ post, lang }: FeaturedCategoryProps) => {
  console.log('[FeaturedCategory] Component rendered. Checking post and language:', {
    post: post ? post.slug : 'N/A',
    lang,
  });

  if (!post) {
    console.warn('[FeaturedCategory] No post prop provided. Returning null.');
    return null;
  }

  const postIsValid = isValidPost(post, lang);
  if (!postIsValid) {
    console.error(
      '[FeaturedCategory] Invalid post object provided or invalid for current language:',
      post
    );
    return null;
  }

  console.log(
    `[FeaturedCategory] Valid post found. Processing post ID: ${post._id}, Slug: ${post.slug}`
  );
  const translation = getPostTranslation(post.translations, lang);
  console.log('[FeaturedCategory] Post translation retrieved:', translation?.title);

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
  console.log(`[FeaturedCategory] First category: ${firstCategory}`);

  return (
    <div className='featured'>
      <div className='featured__image-container'>
        <img
          src={post.image || '/default-image.jpg'}
          alt={translation.title || 'No title'}
          className='featured__image'
        />
        {(() => {
          console.log(`[FeaturedCategory] Image source: ${post.image || '/default-image.jpg'}`);
          return null;
        })()}
      </div>
      <div className='featured__content'>
        <span className='featured__category'>{firstCategory}</span>
        {(() => {
          console.log(`[FeaturedCategory] Displaying category: "${firstCategory}"`);
          return null;
        })()}
        <h2 className='featured__title'>{translation.title || 'No title'}</h2>
        {(() => {
          console.log(`[FeaturedCategory] Displaying title: "${translation.title || 'No title'}"`);
          return null;
        })()}
        <p className='featured__description'>{translation.description || ''}</p>
        {(() => {
          console.log(
            `[FeaturedCategory] Displaying description (first 50 chars): "${(
              translation.description || ''
            ).substring(0, 50)}..."`
          );
          return null;
        })()}
        <Link to={`/posts/${post.slug}`} className='featured__link'>
          Read Full Article
        </Link>
        {(() => {
          console.log(`[FeaturedCategory] "Read Full Article" link points to: /posts/${post.slug}`);
          return null;
        })()}
      </div>
    </div>
  );
};
