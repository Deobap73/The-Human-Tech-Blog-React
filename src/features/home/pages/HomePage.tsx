// src/features/home/pages/HomePage.tsx

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
  const { lang: langParam } = useParams();
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
        // Optionally handle error
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

  const normalPosts = validPublishedPosts.filter((post) => !post.isQuickPost);
  const featuredPostToShow = normalPosts[0];
  const lastPostToShow = normalPosts[1];

  const techShorts = validPublishedPosts.filter((post) => post.isQuickPost);
  const shortsToRender = isMobile ? techShorts.slice(0, 4) : techShorts.slice(0, 5);

  return (
    <>
      <ScrollToTop />
      <div className='home'>
        <RecentPosts posts={validPublishedPosts.slice(0, 12)} lang={lang} />

        <CategoryList />

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

        {featuredPostToShow && <Featured post={featuredPostToShow} lang={lang} />}
        <Sponsors />
        {lastPostToShow && <LastPost post={lastPostToShow} lang={lang} />}
      </div>
    </>
  );
};

export default HomePage;
