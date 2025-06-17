import '../styles/SinglePostPage.scss';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../shared/utils/axios';
import { Post, PostTranslation } from '../../../shared/types/Post';
import { BookmarkButton } from '../../../features/post/components/BookmarkButton';
import Comments from '../components/Comments';
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
        // Always use multilanguage fallback for validation
        const translation = getPostTranslation(res.data.translations, i18n.language);
        const postIsValid =
          res.data.status === 'published' &&
          translation.title &&
          translation.title.trim().length > 0;
        setPost(postIsValid ? res.data : null);
        setError(!postIsValid);
      } catch {
        setError(true);
      }
    };
    fetchPost();
  }, [slug, i18n.language]);

  const translation: PostTranslation =
    post && post.translations
      ? getPostTranslation(post.translations, i18n.language)
      : { title: '', description: '', content: '' };

  const firstCategoryName =
    post?.categories &&
    post.categories.length > 0 &&
    typeof post.categories[0] === 'object' &&
    (post.categories[0] as any)?.translations
      ? getCategoryName(post.categories[0] as any, i18n.language)
      : '';

  if (error) {
    return (
      <div className='single-post-page single-post-page--error'>
        <h2 className='single-post-page__error-title'>Post not found or unpublished</h2>
        <Link to='/' className='single-post-page__back-link'>
          <button className='single-post-page__back-button'>Voltar para o início</button>
        </Link>
      </div>
    );
  }

  if (!post) return <div className='single-post-page__loading'>Loading...</div>;

  return (
    <div className='single-post-page'>
      <div className='single-post-page__header'>
        <h1 className='single-post-page__title'>{translation.title}</h1>
        <BookmarkButton postId={post._id} className='single-post-page__bookmark-button' />
      </div>
      {post.image && (
        <img src={post.image} alt={translation.title} className='single-post-page__image' />
      )}
      <p className='single-post-page__excerpt'>{translation.description}</p>
      {firstCategoryName && <span className='single-post-page__category'>{firstCategoryName}</span>}
      <div className='single-post-page__reactions'>
        <ReactionList targetType='post' targetId={post._id} />
        <ReactionButton targetType='post' targetId={post._id} />
      </div>
      <Comments postId={post._id} className='single-post-page__comments' />
      <Link to='/' className='single-post-page__back-link'>
        Voltar para o início
      </Link>
    </div>
  );
};

export default SinglePostPage;
