// ✅ The-Human-Tech-Blog-React/src/features/post/pages/CategoryPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { toast } from 'react-hot-toast';
import CardList from '../components/CardList';
import '../styles/CategoryPage.scss';

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/categories/${slug}/posts`);
        setPosts(res.data);
      } catch (err) {
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPosts();
  }, [slug]);

  if (loading) return <p className='category-loading'>Loading...</p>;

  return (
    <div className='category-page'>
      <h2 className='category-title'>Category: {slug}</h2>
      {posts.length > 0 ? (
        <CardList posts={posts} />
      ) : (
        <p className='no-posts'>No posts found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
