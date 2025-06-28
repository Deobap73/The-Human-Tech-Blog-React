// /src/features/home/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import '../styles/HomePage.scss';
import { RecentPosts } from '../../post/components/RecentPosts';
import { LastPost } from '../../post/components/LastPost';
import QuickPostCard from '../../post/components/QuickPostCard';
import { Sponsors } from '../../sponsors/components/Sponsors';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import CategoryList from '../../post/components/CategoryList';
import { Featured } from '../../post/components/Featured';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';

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

  // DEBUG - garantir que o lang está correto
  console.log('[HomePage] Active lang:', lang);

  // Helper: Return only posts that are published AND have a translation in the active lang or fallback (EN, etc)
  const validPublishedPosts = posts
    .filter((post) => post.status === 'published')
    .filter((post) => {
      const translation = getPostTranslation(post.translations, lang);
      // DEBUG
      console.log('[HomePage] Post:', post.slug, 'lang:', lang, 'translation:', translation);
      return translation.title && translation.title.trim().length > 0;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const featuredPostToShow = validPublishedPosts.length > 0 ? validPublishedPosts[0] : undefined;
  const lastPostToShow = validPublishedPosts.length > 0 ? validPublishedPosts[1] : undefined;

  const techShorts = validPublishedPosts.filter((post) => post.isQuickPost).slice(0, 5);

  return (
    <div className='home'>
      <RecentPosts posts={validPublishedPosts.slice(0, 12)} lang={lang} />
      {techShorts.length > 0 && (
        <section className='home__shorts'>
          <h2>Tech Shorts</h2>
          <div className='home__shorts-list'>
            {techShorts.map((post) => (
              <QuickPostCard key={post._id} post={post} lang={lang} />
            ))}
          </div>
          <a href={`/${lang}/shorts`} className='home__see-more'>
            See all Tech Shorts
          </a>
        </section>
      )}
      <CategoryList />
      {featuredPostToShow && <Featured post={featuredPostToShow} lang={lang} />}
      <Sponsors />
      {lastPostToShow && <LastPost post={lastPostToShow} lang={lang} />}
    </div>
  );
};

export default HomePage;
