// src/features/search/pages/SearchResultsPage.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import CardList from '../../post/components/CardList';
import '../styles/SearchResultsPage.scss';

/**
 * Parse URLSearchParams from current location.
 * Kept as a pure function to avoid hook rule pitfalls.
 */
function useQueryParam(param: string): string {
  const { search } = useLocation();
  return useMemo(() => {
    const sp = new URLSearchParams(search);
    return sp.get(param) || '';
  }, [search, param]);
}

/**
 * Client-side filter fallback in case the server route is unavailable
 * or returns unexpected data. It searches across title/description/content
 * for the current language, with fallback to 'en' if missing.
 */
function filterPostsByQuery(posts: Post[], q: string, lang: string): Post[] {
  const query = q.trim().toLowerCase();
  if (query.length === 0) return [];

  return posts.filter((p) => {
    const t = (p as any)?.translations || {};
    const curr = t[lang] || t['en'] || {};
    const haystack = [
      String(curr.title || ''),
      String(curr.description || ''),
      String(curr.content || ''),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

const SearchResultsPage = () => {
  // Read ":lang" from the route and normalize (e.g., 'en-US' -> 'en')
  const params = useParams<{ lang?: string }>();
  const lang = (params.lang || 'en').split('-')[0];

  // Read "q" from the query string
  const query = useQueryParam('q');

  // Local state for results and UX flags
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch strategy:
   * 1) Try server-side search: GET /posts/search?q=...
   * 2) If it fails for any reason, fallback to GET /posts and filter on the client.
   */
  useEffect(() => {
    const run = async (): Promise<void> => {
      const q = query.trim();
      setError(null);

      if (q.length === 0) {
        setPosts([]);
        return; // Always return a value in async flows
      }

      setLoading(true);
      try {
        // Attempt server-side full-text search (backend route exists)
        const res = await api.get<Post[]>(`/posts/search?q=${encodeURIComponent(q)}`);
        setPosts(res.data);
        return;
      } catch {
        // Fallback: pull all posts and filter client-side
        try {
          const resAll = await api.get<Post[]>('/posts');
          const filtered = filterPostsByQuery(resAll.data, q, lang);
          setPosts(filtered);
          return;
        } catch {
          setError('Failed to fetch search results');
          setPosts([]);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [query, lang]);

  // Render states with BEM classes
  if (query.trim().length === 0) {
    return <p className='search-results__empty'>Enter a search term.</p>;
  }

  if (loading) {
    return <p className='search-results__loading'>Loading...</p>;
  }

  if (error) {
    return <p className='search-results__error'>{error}</p>;
  }

  return (
    <div className='search-results'>
      <h2 className='search-results__title'>Results for "{query}"</h2>
      {posts.length > 0 ? (
        <CardList posts={posts} lang={lang} />
      ) : (
        <p className='search-results__no-results'>No posts found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
