// src/features/post/components/RecentCategoryPosts.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import { Link } from 'react-router-dom';

interface Props {
  categoryId: string;
  currentPostId: string;
  lang: string;
}

/**
 * Shows the last 5 posts in the same category, excluding the current post.
 */
const RecentCategoryPosts = ({ categoryId, currentPostId, lang }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    api
      .get<Post[]>(`/categories/${categoryId}/posts`)
      .then((res) => {
        // Exclude current post and pick top 5
        const filtered = res.data.filter((p) => p._id !== currentPostId).slice(0, 5);
        setPosts(filtered);
      })
      .finally(() => setLoading(false));
  }, [categoryId, currentPostId]);

  if (loading) return <div className='recent-category-posts__loading'>Loading...</div>;

  return (
    <div className='recent-category-posts'>
      <h4 className='recent-category-posts__title'>Últimos Posts</h4>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <Link to={`/${lang}/posts/${p.slug}`}>
              {p.translations?.[lang]?.title || p.translations?.en?.title || p.slug}
            </Link>
          </li>
        ))}
        {posts.length === 0 && <li>Nenhum outro post nesta categoria.</li>}
      </ul>
    </div>
  );
};

export default RecentCategoryPosts;
