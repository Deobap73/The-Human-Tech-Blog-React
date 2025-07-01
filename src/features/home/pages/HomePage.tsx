// src/features/home/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { lang: langParam } = useParams();
  const { i18n } = useTranslation();
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
      return translation.title && translation.title.trim().length > 0;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const featuredPostToShow = validPublishedPosts[0];
  const lastPostToShow = validPublishedPosts[1];

  const techShorts = validPublishedPosts.filter((post) => post.isQuickPost);
  const shortsToRender = isMobile ? techShorts.slice(0, 4) : techShorts.slice(0, 5);

  return (
    <div className='home'>
      <RecentPosts posts={validPublishedPosts.slice(0, 12)} lang={lang} />
      {shortsToRender.length > 0 && (
        <section className='home__shorts'>
          <h2 className='home__shorts-title'>Tech Shorts</h2>
          <a href={`/${lang}/shorts`} className='home__shorts-link'>
            <div className='home__shorts-list'>
              {shortsToRender.map((post) => (
                <QuickPostCard key={post._id} post={post} lang={lang} />
              ))}
            </div>
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
