// /src/features/post/pages/QuickPostsPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Post } from '../../../shared/types/Post';
import { getQuickPosts } from '../../../shared/services/postService';
import QuickPostCard from '../components/QuickPostCard';
import ScrollToTop from '../../../shared/components/ScrollToTop';
import '../styles/QuickPostsPage.scss';

export const QuickPostsPage = () => {
  const { t, i18n } = useTranslation();
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
    <>
      <ScrollToTop />
      <section className='quick-posts'>
        <div className='quick-posts__header'>
          <h2 className='quick-posts__title'>Tech Shorts</h2>
          <p className='quick-posts__subtitle'>
            {t('quickPostsPage.intro', 'Short tech tips, ideas and discoveries for busy devs.')}
          </p>
        </div>
        <div className='quick-posts__list'>
          {quickPosts.map((post) => (
            <QuickPostCard key={post._id} post={post} lang={lang} />
          ))}
        </div>
      </section>
    </>
  );
};

export default QuickPostsPage;
