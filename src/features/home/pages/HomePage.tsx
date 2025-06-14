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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch {
        // Optionally, handle error state here for UX
      }
    };
    fetchPosts();
  }, []);

  // Type guard para garantir que só posts válidos são processados
  const isPost = (post: Post | null): post is Post => post !== null;

  // Função utilitária multilíngua: só retorna posts que têm conteúdo para a língua ativa ou fallback EN
  const getPostWithLangFallback = (post: Post): Post | null => {
    if (
      post.translations[lang] &&
      post.translations[lang].title &&
      post.translations[lang].content &&
      post.translations[lang].content.trim() !== ''
    ) {
      return post;
    }
    if (post.translations['en'] && post.translations['en'].content.trim() !== '') {
      return {
        ...post,
        translations: {
          ...post.translations,
          [lang]: post.translations['en'],
        },
      };
    }
    return null; // Post não tem conteúdo útil em nenhuma língua
  };

  // Filtra e ordena apenas posts published e com conteúdo válido no idioma ativo ou EN
  const validPublishedPosts = posts
    .filter((post) => post.status === 'published')
    .map(getPostWithLangFallback)
    .filter(isPost)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const featuredPostToShow = validPublishedPosts.length > 0 ? validPublishedPosts[0] : undefined;
  const lastPostToShow = validPublishedPosts.length > 0 ? validPublishedPosts[1] : undefined;

  return (
    <div className='home'>
      <RecentPosts posts={validPublishedPosts.slice(0, 12)} lang={lang} />
      <CategoryList />
      {featuredPostToShow && <Featured post={featuredPostToShow} lang={lang} />}
      <Sponsors />
      {lastPostToShow && <LastPost post={lastPostToShow} lang={lang} />}
    </div>
  );
};

export default HomePage;
