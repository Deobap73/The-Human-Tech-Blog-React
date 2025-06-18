// src/features/post/components/RecentCategoryPosts.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Most Popular-style, always shows the latest post for each category (except the current post)
interface Props {
  categoryId: string;
  currentPostId: string;
  lang: string;
}

const RecentCategoryPosts = ({ currentPostId, lang }: Props) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [postsByCategory, setPostsByCategory] = useState<{ [catId: string]: Post | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>('/categories').then(async (catRes) => {
      setCategories(catRes.data);

      // For each category, get latest published post except current
      const promises = catRes.data.map(async (cat) => {
        try {
          const postsRes = await api.get<Post[]>(`/categories/${cat._id}/posts`);
          const filtered = postsRes.data
            .filter((p) => p._id !== currentPostId && p.status === 'published')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return { catId: cat._id, post: filtered[0] || null };
        } catch {
          return { catId: cat._id, post: null };
        }
      });

      const postsArray = await Promise.all(promises);
      const postsMap: { [catId: string]: Post | null } = {};
      postsArray.forEach(({ catId, post }) => {
        postsMap[catId] = post;
      });
      setPostsByCategory(postsMap);
      setLoading(false);
    });
  }, [currentPostId]);

  if (loading)
    return <div className='recent-category-posts__loading'>{t('loading', 'Loading...')}</div>;

  // Only categories with a published post (not current)
  const categoryPosts = categories
    .map((cat) => ({
      cat,
      post: postsByCategory[cat._id],
    }))
    .filter(({ post }) => !!post);

  return (
    <div className='recent-category-posts'>
      <h4 className='recent-category-posts__title'>{t('mostPopular', 'Most Popular')}</h4>
      <ul className='recent-category-posts__list'>
        {categoryPosts.length === 0 && <li>{t('noPopularPosts', 'No other posts available.')}</li>}
        {categoryPosts.map(({ cat, post }) =>
          post ? (
            <li key={cat._id} className='recent-category-posts__item'>
              <Link to={`/${lang}/posts/${post.slug}`} className='recent-category-posts__link'>
                <img
                  src={post.image || cat.logo || '/default-category.webp'}
                  className='recent-category-posts__thumb'
                  alt={
                    post.translations?.[lang]?.title || post.translations?.en?.title || post.slug
                  }
                  loading='lazy'
                />
                <div className='recent-category-posts__info'>
                  <span className='recent-category-posts__cat'>
                    {cat.translations?.[lang]?.name || cat.translations?.en?.name || cat.slug}
                  </span>
                  <span className='recent-category-posts__title-text'>
                    {post.translations?.[lang]?.title || post.translations?.en?.title || post.slug}
                  </span>
                </div>
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default RecentCategoryPosts;
