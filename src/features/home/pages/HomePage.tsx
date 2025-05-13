// src/pages/HomePage.tsx

import '../styles/HomePage.scss';
import { Layout } from '../../../features/layout/Layout';
import Navbar from '../../../features/layout/Navbar';
import { Footer } from '../../../features/layout/Footer';
import { AboutMe } from '../../../features/about/components/AboutMe';
import { RecentPosts } from '../../../features/post/components/RecentPosts';
import { LastPost } from '../../../features/post/components/LastPost';
import { Sponsors } from '../../../features/sponsors/components/Sponsors';
import { MyFavoritePost } from '../../../features/post/components/MyFavoritePost';
import { useEffect, useState } from 'react';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
        console.log('[HomePage] Posts from API:', res.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      }
    };

    fetchPosts();
  }, []);

  const publishedPosts = posts.filter((post) => post.status === 'published');
  console.log('[HomePage] Published posts:', publishedPosts);
  console.log('[HomePage] First post:', posts[0]);

  return (
    <Layout>
      <Navbar />
      <div className='homeContainer'>
        <AboutMe />

        <RecentPosts posts={publishedPosts.slice(0, 4)} />

        {publishedPosts.length > 0 && <LastPost post={publishedPosts[0]} />}

        <Sponsors />

        <MyFavoritePost post={publishedPosts[3]} />
      </div>

      <Footer />
    </Layout>
  );
};
