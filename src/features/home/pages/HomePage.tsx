// The-Human-Tech-Blog-React/src/features/home/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import '../styles/HomePage.scss';
import { RecentPosts } from '../../post/components/RecentPosts';
import { LastPost } from '../../post/components/LastPost';
import { Sponsors } from '../../sponsors/components/Sponsors';
import { MyFavoritePost } from '../../post/components/MyFavoritePost';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import { FeaturedCategory } from '../../post/components/FeaturedCategory';
import { useTranslation } from 'react-i18next';

/**
 * HomePage: Main entry for blog readers. Displays hero post, recent, featured, and sponsored posts.
 * Uses BEM className (.home) for consistency.
 */
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
        if (res.data.length > 0) {
          setFeaturedPost(res.data[0]);
        }
      } catch {
        // Optionally, handle error state here for UX
      }
    };
    fetchPosts();
  }, []);

  const publishedPosts = posts.filter((post) => post.status === 'published');

  return (
    <div className='home'>
      {/* <AboutMe /> */}
      {featuredPost && <FeaturedCategory post={featuredPost} lang={lang} />}
      <RecentPosts posts={publishedPosts.slice(0, 12)} lang={lang} />
      {publishedPosts.length > 0 && <LastPost post={publishedPosts[0]} lang={lang} />}
      <Sponsors />
      {publishedPosts.length > 3 && <MyFavoritePost post={publishedPosts[3]} lang={lang} />}
    </div>
  );
};
