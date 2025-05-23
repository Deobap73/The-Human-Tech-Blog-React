// src/pages/HomePage.tsx

import '../styles/HomePage.scss';
import { AboutMe } from '../../../features/about/components/AboutMe';
import { RecentPosts } from '../../../features/post/components/RecentPosts';
import { LastPost } from '../../../features/post/components/LastPost';
import { Sponsors } from '../../../features/sponsors/components/Sponsors';
import { MyFavoritePost } from '../../../features/post/components/MyFavoritePost';
import { useEffect, useState } from 'react';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import { FeaturedCategory } from '../../../features/post/components/FeaturedCategory';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        console.table(
          res.data.map((p: any) => ({
            title: p.title,
            slug: p.slug,
            typeofSlug: typeof p.slug,
          }))
        );
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
      {featuredPost && <FeaturedCategory post={featuredPost} />}
      <RecentPosts posts={publishedPosts.slice(0, 4)} />
      {publishedPosts.length > 0 && <LastPost post={publishedPosts[0]} />}
      <Sponsors />
      {publishedPosts.length > 3 && <MyFavoritePost post={publishedPosts[3]} />}
    </div>
  );
};
