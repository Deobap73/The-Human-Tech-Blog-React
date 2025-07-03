// src/features/post/pages/CategoryPage.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../../shared/utils/i18nHelpers';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers'; // <-- Import helper
import CardList from '../components/CardList';
import '../styles/CategoryPage.scss';
import ScrollToTop from '../../../shared/components/ScrollToTop';
import PostsSidebar from '../components/PostsSidebar';

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

  // Safe multilingual translation
  const name = category ? getCategoryName(category, i18n.language) : slug;
  const description =
    category?.translations?.[i18n.language]?.description ||
    category?.translations?.[i18n.language.split('-')[0]]?.description ||
    category?.translations?.en?.description ||
    Object.values(category?.translations || {})[0]?.description ||
    '';

  if (loading) return <p className='category-page__loading'>Loading...</p>;

  return (
    <>
      <ScrollToTop />
      <div className='category-page'>
        {category && (
          <div className='category-page__header'>
            {category.logo && (
              <img
                src={resolveLogoUrl(category.logo)}
                alt={name}
                className='category-page__logo'
                style={{ height: 40, marginRight: 12 }}
              />
            )}
            <h2 className='category-page__title'>{name}</h2>
            {description && <div className='category-page__description'>{description}</div>}
          </div>
        )}
        {!category && <h2 className='category-page__title'>{slug}</h2>}
        {posts.length > 0 ? (
          <CardList posts={posts} lang={i18n.language} />
        ) : (
          <p className='category-page__no-posts'>No posts found for this category.</p>
        )}

        <PostsSidebar>
          <div className='sidebar__block'>
            <NewsletterSidebarBox />
          </div>
          <div className='sidebar__block'>
            <RecentCategoryPosts currentPostId={post._id} lang={i18n.language} />
          </div>
          <div className='sidebar__block'>
            <CategoryList />
          </div>
        </PostsSidebar>
        <Link to='/' className='category-page__back-link'>
          Voltar para o início
        </Link>
      </div>
    </>
  );
};

export default CategoryPage;
