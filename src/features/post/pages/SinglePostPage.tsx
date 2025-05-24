// The-Human-Tech-Blog-React/src/pages/posts/_slug/SinglePostPage.tsx

import '../styles/SinglePostPage.scss';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { BookmarkButton } from '../../../features/post/components/BookmarkButton';
import Comments from '../components/Comments';
import { isValidPost } from '../../../shared/utils/validation';
import ReactionButton from '../../reaction/components/ReactionButton';
import ReactionList from '../../reaction/components/ReactionList';

export const SinglePostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState(false);

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
      <h1 className='single-post__title'>{post.title}</h1>
      <BookmarkButton postId={post._id} />
      <img src={post.image} alt={post.title} className='single-post__image' />
      <p className='single-post__excerpt'>{post.description}</p>
      <span className='single-post__category'>{post.categories?.[0]?.name}</span>
      {/* Aqui sim! */}
      <ReactionList targetType='post' targetId={post._id} />
      <ReactionButton targetType='post' targetId={post._id} />
      <Comments postId={post._id} />
    </div>
  );
};
