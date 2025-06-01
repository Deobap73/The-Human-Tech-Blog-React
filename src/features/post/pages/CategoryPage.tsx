// The-Human-Tech-Blog-React\src\features\post\pages\CategoryPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../../shared/utils/i18nHelpers';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import CardList from '../components/CardList';
import '../styles/CategoryPage.scss';

const CategoryPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchCategoryAndPosts = async () => {
      setLoading(true);
      try {
        const catRes = await api.get<Category>(`/categories/${slug}`);
        setCategory(catRes.data);
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

  // Tradução multilíngue segura
  const name = category ? getCategoryName(category, i18n.language) : slug;
  const description =
    category?.translations?.[i18n.language]?.description ||
    category?.translations?.[i18n.language.split('-')[0]]?.description ||
    category?.translations?.en?.description ||
    Object.values(category?.translations || {})[0]?.description ||
    '';

  if (loading) return <p className='category-loading'>Loading...</p>;

  return (
    <div className='category-page'>
      {category && (
        <div className='category-header'>
          {category.logo && (
            <img
              src={category.logo}
              alt={name}
              className='category-logo'
              style={{ height: 40, marginRight: 12 }}
            />
          )}
          <h2 className='category-title'>{name}</h2>
          {description && <div className='category-description'>{description}</div>}
        </div>
      )}
      {!category && <h2 className='category-title'>{slug}</h2>}
      {posts.length > 0 ? (
        <CardList posts={posts} />
      ) : (
        <p className='no-posts'>No posts found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
