// src/components/lastPost/LastPost.tsx

import '../styles/LastPost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

interface LastPostProps {
  post?: Post;
  lang?: string;
}

export const LastPost = ({ post, lang }: LastPostProps) => {
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  const translation = getPostTranslation(post.translations, currentLang);
  const firstCategory = post.categories?.[0] || 'Uncategorized';

  return (
    <div className='lastPost'>
      <h2 className='title'>Latest Post</h2>
      <div className='content'>
        <img
          src={post.image || '/default-image.jpg'}
          alt={translation.title}
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
