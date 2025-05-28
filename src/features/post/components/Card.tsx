// src/components/card/Card.tsx

import '../styles/Card.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { BookmarkButton } from './BookmarkButton';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

type CardProps = {
  post?: Post;
};

export const Card = ({ post }: CardProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  const translation = getPostTranslation(post.translations, lang);
  const category = post.categories?.[0] || 'Uncategorized';

  return (
    <div className='cardPost'>
      <img src={post.image} alt={translation.title} className='cardPost__image' />
      <div className='cardPost__descriptionContainer'>
        <span className='cardPost__descriptionContainer__category'>{category}</span>
        <div className='cardPost__descriptionContainer__textContainer'>
          <p className='cardPost__descriptionContainer__textContainer__description'>
            {translation.description.length > 60
              ? translation.description.substring(0, 60) + '...'
              : translation.description}
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
