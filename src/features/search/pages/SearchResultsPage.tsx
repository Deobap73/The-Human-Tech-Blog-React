// The-Human-Tech-Blog-React/src/features/search/pages/SearchResultsPage.tsx

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import CardList from '../../post/components/CardList';
import '../styles/SearchResultsPage.scss';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const query = useQuery().get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    api
      .get(`/posts/search?q=${encodeURIComponent(query)}`)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) return <p className='search-results__empty'>Enter a search term.</p>;
  if (loading) return <p className='search-results__loading'>Loading...</p>;

  return (
    <div className='search-results'>
      <h2 className='search-results__title'>Results for "{query}"</h2>
      {posts.length > 0 ? (
        <CardList posts={posts} />
      ) : (
        <p className='search-results__no-results'>No posts found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
