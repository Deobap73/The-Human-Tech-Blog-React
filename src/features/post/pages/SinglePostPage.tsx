// The-Human-Tech-Blog-React/src/pages/posts/_slug/SinglePostPage.tsx

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
import { fetchCategories } from '../../../shared/services/categoryService';
import { Category } from '../../../shared/types/Category';

export const SinglePostPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Carrega categorias para exibir nome multilíngue
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/slug/${slug}`);
        setPost(res.data);
        setError(!isValidPost(res.data));
      } catch {
        console.error('Failed to load post');
        setError(true);
      }
    };
    fetchPost();
  }, [slug]);

  // Busca tradução multilíngue do post com fallback
  const getTranslation = (translations: Post['translations']): PostTranslation => {
    const lang = i18n.language;
    return (
      translations[lang] ||
      translations[lang.split('-')[0]] ||
      translations['en'] || { title: '', description: '', content: '' }
    );
  };

  // Busca o nome da primeira categoria, se houver
  const getCategoryName = () => {
    if (!post?.categories?.[0]) return '';
    const cat = categories.find((c) => c._id === post.categories[0]);
    if (!cat) return '';
    const tr =
      cat.translations[i18n.language] ||
      cat.translations[i18n.language.split('-')[0]] ||
      cat.translations['en'];
    return tr?.name || '';
  };

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

  const translation = getTranslation(post.translations);

  return (
    <div className='single-post'>
      <h1 className='single-post__title'>{translation.title}</h1>
      <BookmarkButton postId={post._id} />
      {post.image && (
        <img src={post.image} alt={translation.title} className='single-post__image' />
      )}
      <p className='single-post__excerpt'>{translation.description}</p>
      {getCategoryName() && <span className='single-post__category'>{getCategoryName()}</span>}
      <ReactionList targetType='post' targetId={post._id} />
      <ReactionButton targetType='post' targetId={post._id} />
      <Comments postId={post._id} />
    </div>
  );
};
