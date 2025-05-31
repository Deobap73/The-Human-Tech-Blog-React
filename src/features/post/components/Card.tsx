// The-Human-Tech-Blog-React/src/features/post/components/Card.tsx

import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { Post } from '../../../shared/types/Post';
import { BookmarkButton } from './BookmarkButton';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import '../styles/Card.scss';

type CardProps = {
  post?: Post;
  lang: string;
};

export const Card = ({ post, lang }: CardProps) => {
  if (!post || !isValidPost(post, lang)) return null;

  const translation = getPostTranslation(post.translations, lang);
  let category = 'Uncategorized';
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0];
    if (cat && typeof cat === 'object' && 'translations' in cat) {
      category = getCategoryName(cat as any, lang);
    } else if (typeof cat === 'string') {
      category = cat;
    }
  }

  return (
    <div className='cardPost'>
      {/* Primeira div: imagem, category, bookmark, title */}
      <div className='cardPost__imageSection'>
        <img src={post.image} alt={translation.title || 'No title'} className='cardPost__image' />
        <span className='cardPost__category'>{category}</span>
        <div className='cardPost__bookmark'>
          <BookmarkButton postId={post._id} />
        </div>
        <div className='cardPost__title'>
          <h3>{translation.title}</h3>
        </div>
      </div>
      {/* Segunda div: descrição + link */}
      <div className='cardPost__descriptionSection'>
        <p className='cardPost__description'>{translation.description}</p>
        <Link to={`/${lang}/posts/${post.slug}`} className='cardPost__viewMore'>
          view more <BsArrowRight />
        </Link>
      </div>
    </div>
  );
};
