// The-Human-Tech-Blog-React/src/features/home/pages/HomePage.tsx

import '../styles/HomePage.scss';
import { AboutMe } from '../../about/components/AboutMe';
import { RecentPosts } from '../../post/components/RecentPosts';
import { LastPost } from '../../post/components/LastPost';
import { Sponsors } from '../../sponsors/components/Sponsors';
import { MyFavoritePost } from '../../post/components/MyFavoritePost';
import { useEffect, useState } from 'react';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import { FeaturedCategory } from '../../post/components/FeaturedCategory';
import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';

  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      }
    };
    fetchPosts();
  }, []);

  const publishedPosts = posts.filter((post) => post.status === 'published');

  return (
    <div className='homeContainer'>
      <AboutMe />
      {featuredPost && <FeaturedCategory post={featuredPost} lang={lang} />}
      <RecentPosts posts={publishedPosts.slice(0, 4)} lang={lang} />
      {publishedPosts.length > 0 && <LastPost post={publishedPosts[0]} lang={lang} />}
      <Sponsors />
      {publishedPosts.length > 3 && <MyFavoritePost post={publishedPosts[3]} lang={lang} />}
    </div>
  );
};
