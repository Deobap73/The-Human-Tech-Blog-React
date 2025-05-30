// The-Human-Tech-Blog-React/src/features/home/pages/HomePage.tsx

import '../styles/HomePage.scss';
/* import { AboutMe } from '../../about/components/AboutMe'; */
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
  console.log('[HomePage] Component rendered.'); // Initial component render log

  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';
  console.log(`[HomePage] Current language determined: ${lang}`); // Log the language

  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  console.log('[HomePage] State variables initialized: posts (empty), featuredPost (null).'); // Log state initialization

  useEffect(() => {
    console.log('[HomePage] useEffect triggered. Attempting to fetch posts...'); // Log useEffect call
    const fetchPosts = async () => {
      try {
        console.log('[HomePage] Making API call to /posts...'); // Log API call initiation
        const res = await axios.get('/posts');
        setPosts(res.data);
        console.log(`[HomePage] Posts fetched successfully. Total posts: ${res.data.length}`); // Log successful fetch and count
        // Optionally, set a featured post from the fetched data
        if (res.data.length > 0) {
          const firstPost = res.data[0]; // Example: pick the first post as featured
          setFeaturedPost(firstPost);
          console.log(`[HomePage] Featured post set to: ${firstPost.slug}`); // Log featured post
        } else {
          console.log('[HomePage] No posts returned from API to set as featured.'); // Log no posts
        }
      } catch (err) {
        console.error('[HomePage] Failed to fetch posts:', err); // Log error during fetch
      }
    };
    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  const publishedPosts = posts.filter((post) => {
    const isPublished = post.status === 'published';
    console.log(
      `[HomePage] Filtering post ID: ${post._id || 'N/A'} - Status: ${
        post.status
      }, Is published: ${isPublished}`
    ); // Log each post's status during filter
    return isPublished;
  });
  console.log(`[HomePage] Total published posts after filtering: ${publishedPosts.length}`); // Log count of published posts

  return (
    <div className='homeContainer'>
      {/* Log for AboutMe component */}
      {(() => {
        console.log('[HomePage] Rendering AboutMe component.');
        return null;
      })()}
      {/* <AboutMe /> */}
      {featuredPost && (
        <>
          {(() => {
            console.log(`[HomePage] Rendering FeaturedCategory for post: ${featuredPost.slug}`);
            return null;
          })()}
          <FeaturedCategory post={featuredPost} lang={lang} />
        </>
      )}
      {!featuredPost &&
        (() => {
          console.log('[HomePage] No featured post available to render FeaturedCategory.');
          return null;
        })()}
      {/* Log for RecentPosts component */}
      {(() => {
        const postsForRecent = publishedPosts.slice(0, 4);
        console.log(
          `[HomePage] Rendering RecentPosts with ${postsForRecent.length} posts and lang: ${lang}.`
        );
        return null;
      })()}
      <RecentPosts posts={publishedPosts.slice(0, 4)} lang={lang} />{' '}
      {/* Corrected: Added lang={lang} */}
      {publishedPosts.length > 0 && (
        <>
          {(() => {
            console.log(
              `[HomePage] Rendering LastPost with post: ${publishedPosts[0].slug} and lang: ${lang}.`
            );
            return null;
          })()}
          <LastPost post={publishedPosts[0]} lang={lang} />
        </>
      )}
      {publishedPosts.length === 0 &&
        (() => {
          console.log('[HomePage] No published posts available to render LastPost.');
          return null;
        })()}
      {/* Log for Sponsors component */}
      {(() => {
        console.log('[HomePage] Rendering Sponsors component.');
        return null;
      })()}
      <Sponsors />
      {publishedPosts.length > 3 && (
        <>
          {(() => {
            console.log(
              `[HomePage] Rendering MyFavoritePost with post: ${publishedPosts[3].slug} and lang: ${lang}.`
            );
            return null;
          })()}
          <MyFavoritePost post={publishedPosts[3]} lang={lang} />{' '}
          {/* Corrected: Added lang={lang} */}
        </>
      )}
      {publishedPosts.length <= 3 && // Log if not enough posts for MyFavoritePost
        (() => {
          console.log(
            `[HomePage] Not enough published posts (${publishedPosts.length}) to render MyFavoritePost (needs 4).`
          );
          return null;
        })()}
    </div>
  );
};
