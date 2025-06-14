// src/features/home/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import '../styles/HomePage.scss';
import { RecentPosts } from '../../post/components/RecentPosts';
import { LastPost } from '../../post/components/LastPost';
import { Sponsors } from '../../sponsors/components/Sponsors';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import CategoryList from '../../post/components/CategoryList';
import { Featured } from '../../post/components/Featured';

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

  // Fallback multilíngua: se a tradução do idioma estiver vazia, clona a tradução "en" para o idioma pedido
  const getPostWithLangFallback = (post: Post): Post => {
    if (
      post.translations[lang] &&
      post.translations[lang].title &&
      post.translations[lang].content &&
      post.translations[lang].content.trim() !== ''
    ) {
      return post;
    }
    // Força a existência da tradução no idioma ativo com base na tradução "en"
    if (post.translations['en']) {
      return {
        ...post,
        translations: {
          ...post.translations,
          [lang]: post.translations['en'],
        },
      };
    }
    // Último recurso: devolve o post como está
    return post;
  };

  // Cálculo dos posts para Featured e LastPost com fallback
  const featuredPostToShow =
    featuredPost && getPostWithLangFallback(featuredPost)
      ? getPostWithLangFallback(featuredPost)
      : undefined;
  const lastPostToShow =
    publishedPosts.length > 0 && getPostWithLangFallback(publishedPosts[0])
      ? getPostWithLangFallback(publishedPosts[0])
      : undefined;

  return (
    <div className='home'>
      <RecentPosts posts={publishedPosts.slice(0, 12)} lang={lang} />
      <CategoryList />
      {featuredPostToShow && <Featured post={featuredPostToShow} lang={lang} />}
      <Sponsors />
      {lastPostToShow && <LastPost post={lastPostToShow} lang={lang} />}
    </div>
  );
};

export default HomePage;
