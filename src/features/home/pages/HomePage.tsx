// File: src/features/home/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import ScrollToTop from '../../../shared/components/ScrollToTop';

export const HomePage = () => {
  const { lang: langParam } = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation();
  const lang = langParam || i18n.language.split('-')[0] || 'en';

  const [posts, setPosts] = useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch {
        // optionally handle error
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const updateScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateScreen();
    window.addEventListener('resize', updateScreen);
    return () => window.removeEventListener('resize', updateScreen);
  }, []);

  const validPublishedPosts = posts
    .filter((post) => post.status === 'published')
    .filter((post) => {
      const translation = getPostTranslation(post.translations, lang);
      const cleanTitle = translation.title?.replace(/<[^>]*>/g, '').trim();
      return !!cleanTitle;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Exclude both QuickPosts and AI Prompts from the "normal" feed
  const normalPosts = validPublishedPosts.filter((post) => !post.isQuickPost && !post.isAiPrompt);
  const featuredPostToShow = normalPosts[0];
  const lastPostToShow = normalPosts[1];

  // Quick Posts (Tech Shorts)
  const techShorts = validPublishedPosts.filter((post) => post.isQuickPost);
  const shortsToRender = isMobile ? techShorts.slice(0, 4) : techShorts.slice(0, 5);

  // AI Prompts (reuse same card component)
  const aiPrompts = validPublishedPosts.filter((post) => post.isAiPrompt);
  const promptsToRender = isMobile ? aiPrompts.slice(0, 4) : aiPrompts.slice(0, 5);

  return (
    <>
      <ScrollToTop />
      <div className='home'>
        {/* Recent regular posts */}
        <RecentPosts posts={validPublishedPosts.slice(0, 12)} lang={lang} />

        {/* Category navigation */}
        <CategoryList />

        {/* Tech Shorts section */}
        {shortsToRender.length > 0 && (
          <section className='home__shorts'>
            <Link className='home__shorts-title' to={`/${langParam}/shorts`}>
              {t('shorts.shorts', 'Tech Shorts')}
            </Link>
            <a href={`/${lang}/shorts`} className='home__shorts-link'>
              <div className='home__shorts-list'>
                {shortsToRender.map((post) => (
                  <QuickPostCard key={post._id} post={post} lang={lang} />
                ))}
              </div>
            </a>
          </section>
        )}

        {/* Featured Article */}
        {featuredPostToShow && <Featured post={featuredPostToShow} lang={lang} />}

        {/* AI Prompts section (reusing QuickPostCard) */}
        {promptsToRender.length > 0 && (
          <section className='home__shorts'>
            <Link className='home__shorts-title' to={`/${langParam}/aiprompts`}>
              {t('aiPrompts.title', 'AI Prompts')}
            </Link>
            <a href={`/${lang}/shorts?filter=ai`} className='home__shorts-link'>
              <div className='home__shorts-list'>
                {promptsToRender.map((post) => (
                  <QuickPostCard key={post._id} post={post} lang={lang} />
                ))}
              </div>
            </a>
          </section>
        )}

        {/* Sponsors */}
        <Sponsors />

        {/* Last regular post */}
        {lastPostToShow && <LastPost post={lastPostToShow} lang={lang} />}
      </div>
    </>
  );
};

export default HomePage;
