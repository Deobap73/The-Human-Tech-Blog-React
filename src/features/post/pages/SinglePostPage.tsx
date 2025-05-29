// The-Human-Tech-Blog-React/src/features/post/pages/SinglePostPage.tsx

import '../styles/SinglePostPage.scss';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../shared/utils/axios';
import { Post, PostTranslation } from '../../../shared/types/Post';
import { BookmarkButton } from '../../../features/post/components/BookmarkButton';
import Comments from '../components/Comments';
import { isValidPost } from '../../../shared/utils/validation';
import ReactionButton from '../../reaction/components/ReactionButton';
import ReactionList from '../../reaction/components/ReactionList';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';

export const SinglePostPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/slug/${slug}`);
        setPost(res.data);
        setError(!isValidPost(res.data, i18n.language));
      } catch {
        console.error('Failed to load post');
        setError(true);
      }
    };
    fetchPost();
  }, [slug, i18n.language]);

  // Tradução multilíngue segura
  const translation: PostTranslation =
    post && post.translations
      ? getPostTranslation(post.translations, i18n.language)
      : { title: '', description: '', content: '' };

  // Categoria populada no próprio post, seguro para qualquer formato
  const firstCategoryName =
    post?.categories &&
    post.categories.length > 0 &&
    typeof post.categories[0] === 'object' &&
    (post.categories[0] as any)?.translations
      ? getCategoryName(post.categories[0] as any, i18n.language)
      : '';

  if (error) {
    return (
      <div className='single-post__error'>
        <h2>Post not found or unpublished</h2>
        <Link to='/'>
          <button className='single-post__back'>Voltar para o início</button>
        </Link>
      </div>
    );
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className='single-post'>
      <h1 className='single-post__title'>{translation.title}</h1>
      <BookmarkButton postId={post._id} />
      {post.image && (
        <img src={post.image} alt={translation.title} className='single-post__image' />
      )}
      <p className='single-post__excerpt'>{translation.description}</p>
      {firstCategoryName && <span className='single-post__category'>{firstCategoryName}</span>}
      <ReactionList targetType='post' targetId={post._id} />
      <ReactionButton targetType='post' targetId={post._id} />
      <Comments postId={post._id} />
      <Link to='/'>
        <button className='single-post__back'>Voltar para o início</button>
      </Link>
    </div>
  );
};
