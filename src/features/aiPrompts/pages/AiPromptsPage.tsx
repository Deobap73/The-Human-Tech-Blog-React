// File: src/features/aiPrompts/pages/AiPromptsPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import '../styles/AiPromptsPage.scss';
import QuickPostCard from '../../post/components/QuickPostCard';
import { Post } from '../../../shared/types/Post';
import axios from '../../../shared/utils/axios';
import ScrollToTop from '../../../shared/components/ScrollToTop';

const AiPromptsPage = () => {
  const { lang: langParam } = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation();
  const lang = langParam || i18n.language.split('-')[0] || 'en';

  const [prompts, setPrompts] = useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get<Post[]>('/posts');
        const aiOnly = res.data
          .filter((p) => p.status === 'published' && p.isAiPrompt)
          .filter((p) => {
            const t = p.translations[lang] || p.translations.en;
            return !!t?.title?.trim();
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPrompts(aiOnly);
      } catch {
        // optionally handle error
      }
    };
    fetchPrompts();
  }, [lang]);

  useEffect(() => {
    const updateScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateScreen();
    window.addEventListener('resize', updateScreen);
    return () => window.removeEventListener('resize', updateScreen);
  }, []);

  const toRender = isMobile ? prompts.slice(0, 4) : prompts;

  return (
    <>
      <ScrollToTop />
      <section className='ai-prompts-page'>
        <div className='ai-prompts-page__header'>
          <h2 className='ai-prompts-page__title'>{t('aiPrompts.title', 'AI Prompts')}</h2>
          <p className='ai-prompts-page__intro'>{t('aiPrompts.intro', 'AI- prompts for fun')}</p>
        </div>
        <div className='ai-prompts-page__list'>
          {toRender.map((post) => (
            <QuickPostCard key={post._id} post={post} lang={lang} />
          ))}
          {prompts.length === 0 && (
            <div className='ai-prompts-page__empty'>
              {t('aiPrompts.empty', 'No AI prompts available.')}
            </div>
          )}
        </div>
        {prompts.length > toRender.length && (
          <div className='ai-prompts-page__more'>
            <Link to={`/${lang}/aiprompts`} className='ai-prompts-page__more-link'>
              {t('aiPrompts.viewAll', 'View all AI Prompts')}
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default AiPromptsPage;
