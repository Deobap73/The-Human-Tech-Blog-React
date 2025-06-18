// src/features/post/components/RecentCategoryPosts.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { Post, PostTranslations } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { Link } from 'react-router-dom';

interface Props {
  currentPostId: string;
  lang: string;
}

/**
 * Shows the last published post for each category, excluding the current post.
 */
const RecentCategoryPosts = ({ currentPostId, lang }: Props) => {
  const [postsByCategory, setPostsByCategory] = useState<{ [catId: string]: Post | null }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1: Buscar todas as categorias
    api.get<Category[]>('/categories').then(async (catRes) => {
      setCategories(catRes.data);

      // Step 2: Para cada categoria, buscar último post publicado
      const promises = catRes.data.map(async (cat) => {
        try {
          const postsRes = await api.get<Post[]>(`/categories/${cat._id}/posts`);
          // Exclui o post atual, filtra published, ordena do mais recente
          const filtered = postsRes.data
            .filter((p) => p._id !== currentPostId && p.status === 'published')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          // Só pega o último post
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

  if (loading) return <div className='recent-category-posts__loading'>Loading...</div>;

  // Gerar lista só com categorias que têm pelo menos 1 post (excluindo o atual)
  const categoryPosts = categories
    .map((cat) => ({
      cat,
      post: postsByCategory[cat._id],
    }))
    .filter(({ post }) => !!post);

  return (
    <div className='recent-category-posts'>
      <h4 className='recent-category-posts__title'>Último Post de Cada Categoria</h4>
      <ul>
        {categoryPosts.length === 0 && <li>Nenhum post disponível noutras categorias.</li>}
        {categoryPosts.map(({ cat, post }) =>
          post ? (
            <li key={cat._id}>
              <Link to={`/${lang}/posts/${post.slug}`}>
                <span className='recent-category-posts__cat'>
                  [{cat.translations?.[lang]?.name || cat.translations?.en?.name || cat.slug}]
                </span>{' '}
                {post.translations?.[lang]?.title || post.translations?.en?.title || post.slug}
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default RecentCategoryPosts;
