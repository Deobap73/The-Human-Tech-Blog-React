// The-Human-Tech-Blog-React/src/features/post/pages/CategoryPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { toast } from 'react-hot-toast';
import CardList from '../components/CardList';
import '../styles/CategoryPage.scss';

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryAndPosts = async () => {
      setLoading(true);
      try {
        // 1. Busca a categoria pelo slug
        const catRes = await api.get<Category>(`/categories/${slug}`);
        setCategory(catRes.data);

        // 2. Busca os posts associados à categoria
        const postsRes = await api.get<Post[]>(`/categories/${slug}/posts`);
        setPosts(postsRes.data);
      } catch (err) {
        toast.error('Failed to load category or posts');
        setCategory(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndPosts();
  }, [slug]);

  if (loading) return <p className='category-loading'>Loading...</p>;

  return (
    <div className='category-page'>
      {category && (
        <div className='category-header'>
          {category.logo && (
            <img
              src={category.logo}
              alt={category.name}
              className='category-logo'
              style={{ height: 40, marginRight: 12 }}
            />
          )}
          <h2 className='category-title'>Category: {category.name}</h2>
        </div>
      )}
      {!category && <h2 className='category-title'>Category: {slug}</h2>}
      {posts.length > 0 ? (
        <CardList posts={posts} />
      ) : (
        <p className='no-posts'>No posts found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
