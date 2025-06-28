// src/features/post/pages/QuickPostsPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Post } from '../../../shared/types/Post';
import { getQuickPosts } from '../../../shared/services/postService';
import QuickPostCard from '../components/QuickPostCard';
import '../styles/QuickPostCard.scss';

export const QuickPostsPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';

  const [quickPosts, setQuickPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const posts = await getQuickPosts();
      setQuickPosts(posts);
    };
    fetch();
  }, []);

  return (
    <main className='quick-posts'>
      <h2 className='quick-posts__title'>Tech Shorts</h2>
      <div className='quick-posts__list'>
        {quickPosts.map((post) => (
          <QuickPostCard key={post._id} post={post} lang={lang} />
        ))}
      </div>
    </main>
  );
};

export default QuickPostsPage;
