// /src/features/home/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import '../styles/HomePage.scss';
import { RecentPosts } from '../../post/components/RecentPosts';
import { LastPost } from '../../post/components/LastPost';
import { Sponsors } from '../../sponsors/components/Sponsors';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import CategoryList from '../../post/components/CategoryList';
import { Featured } from '../../post/components/Featured';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

/**
 * HomePage: Main entry for blog readers. Displays hero post, recent, featured, and sponsored posts.
 * Uses BEM className (.home) for consistency and robust multilanguage fallback.
 */
export const HomePage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch {
        // Optionally, handle error state here for UX
      }
    };
    fetchPosts();
  }, []);

  // Helper: Return only posts that are published AND have a translation in the active lang or fallback (EN, etc)
  const validPublishedPosts = posts
    .filter((post) => post.status === 'published')
    .filter((post) => {
      const translation = getPostTranslation(post.translations, lang);
      return translation.title && translation.title.trim().length > 0;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const featuredPostToShow = validPublishedPosts.length > 0 ? validPublishedPosts[0] : undefined;
  const lastPostToShow = validPublishedPosts.length > 0 ? validPublishedPosts[1] : undefined;

  return (
    <div className='home'>
      <RecentPosts posts={validPublishedPosts.slice(0, 12)} lang={lang} />
      <CategoryList />
      {featuredPostToShow && <Featured post={featuredPostToShow} lang={lang} />}
      <Sponsors />
      {lastPostToShow && <LastPost post={lastPostToShow} lang={lang} />}
    </div>
  );
};

export default HomePage;
