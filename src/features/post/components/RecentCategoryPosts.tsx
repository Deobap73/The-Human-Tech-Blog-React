// /src/features/post/components/RecentCategoryPosts.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';
import '../styles/RecentCategoryPosts.scss';

interface Props {
  currentPostId?: string;
  lang: string;
}

export const RecentCategoryPosts = ({ currentPostId, lang }: Props) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [postsByCategory, setPostsByCategory] = useState<{ [catId: string]: Post | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>('/categories').then(async (catRes) => {
      setCategories(catRes.data);

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

  if (loading) {
    return <div className='recent-category-posts__loading'>{t('postPage.loading')}</div>;
  }

  const categoryPosts = categories
    .map((cat) => ({
      cat,
      post: postsByCategory[cat._id],
    }))
    .filter(({ post }) => !!post);

  return (
    <aside className='recent-category-posts' aria-label={t('postPage.mostPopular')}>
      <h3 className='recent-category-posts__header'>{t('postPage.mostPopular')}</h3>
      <ul className='recent-category-posts__list'>
        {categoryPosts.length === 0 && (
          <li className='recent-category-posts__empty'>{t('postPage.noPopularPosts')}</li>
        )}
        {categoryPosts.map(({ cat, post }) =>
          post ? (
            <li className='recent-category-posts__item' key={cat._id}>
              <Link to={`/${lang}/posts/${post.slug}`} className='recent-category-posts__link'>
                <div className='recent-category-posts__thumb'>
                  <img
                    src={post.image || resolveLogoUrl(cat.logo) || '/default-category.webp'}
                    alt={
                      post.translations?.[lang]?.title || post.translations?.en?.title || post.slug
                    }
                    className='recent-category-posts__image'
                    loading='lazy'
                  />
                </div>
                <div className='recent-category-posts__content'>
                  <span className='recent-category-posts__cat'>
                    {cat.translations?.[lang]?.name || cat.translations?.en?.name || cat.slug}
                  </span>
                  {/* Show DESCRIPTION instead of title, limit to 60 chars */}
                  <span className='recent-category-posts__desc'>
                    {post.translations?.[lang]?.description?.slice(0, 60) ||
                      post.translations?.en?.description?.slice(0, 60) ||
                      post.slug}
                    {(post.translations?.[lang]?.description?.length ||
                      post.translations?.en?.description?.length ||
                      0) > 60 && '...'}
                  </span>
                  <div className='recent-category-posts__meta'>
                    <img
                      className='recent-category-posts__author-avatar'
                      src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${
                        post.author?._id || 'guest'
                      }`}
                      alt={post.author?.name || 'User'}
                      loading='lazy'
                    />
                    <span className='recent-category-posts__author-name'>
                      {post.author?.name || 'User'}
                    </span>
                    <span className='recent-category-posts__date'>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </aside>
  );
};

export default RecentCategoryPosts;
