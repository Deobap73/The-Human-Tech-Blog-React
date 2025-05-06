// src/pages/HomePage.tsx

import './HomePage.scss';
import { Layout } from '../components/layout/Layout';
import Navbar from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { AboutMe } from '../components/aboutMe/AboutMe';
import { RecentPosts } from '../components/recentPosts/RecentPosts';
import { LastPost } from '../components/lastPost/LastPost';
import { Sponsors } from '../components/sponsors/Sponsors';
import { MyFavoritePost } from '../components/myFavoritePost/MyFavoritePost';
import { useEffect, useState } from 'react';
import { Post } from '../types/Post';
import axios from '../utils/axios';

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
