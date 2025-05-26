// src/features/post/pages/CategoryPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { toast } from 'react-hot-toast';
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
        // 1. Busca a categoria pelo slug (agora espera objeto com .translations)
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

  // Seleciona a tradução do idioma atual (com fallback para inglês)
  const getTranslation = (cat: Category | null) => {
    if (!cat || !cat.translations) return { name: cat?.name || slug, description: '' };
    const lang = i18n.language;
    return (
      cat.translations[lang] ||
      cat.translations[lang.split('-')[0]] || // para "pt-BR" ou "en-US"
      cat.translations['en'] || { name: cat.name || slug, description: '' }
    );
  };

  const translation = getTranslation(category);

  return (
    <div className='category-page'>
      {category && (
        <div className='category-header'>
          {category.logo && (
            <img
              src={category.logo}
              alt={translation.name}
              className='category-logo'
              style={{ height: 40, marginRight: 12 }}
            />
          )}
          <h2 className='category-title'>{translation.name}</h2>
          {translation.description && (
            <div className='category-description'>{translation.description}</div>
          )}
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
