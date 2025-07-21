// File: src/features/aiPrompts/pages/SingleAiPromptPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AiPrompt } from '../../../shared/types/iPrompt';
import { getAiPrompts } from '../../../shared/services/aiPromptService';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';
import ScrollToTop from '../../../shared/components/ScrollToTop';
import '../styles/SingleAiPromptPage.scss';

const SingleAiPromptPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';
  const [prompt, setPrompt] = useState<AiPrompt | null>(null);

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const prompts = await getAiPrompts();
        const found = prompts.find((p) => p.slug === slug);
        setPrompt(found || null);
      } catch {
        setPrompt(null);
      }
    }
    fetchPrompt();
  }, [slug]);

  if (!prompt) {
    return <div className='single-ai-prompt-page'>{t('postPage.postNotFound')}</div>;
  }

  const translation =
    getPostTranslation(prompt.translations, lang) || getPostTranslation(prompt.translations, 'en');

  return (
    <>
      <ScrollToTop />
      <article className='single-ai-prompt-page'>
        <header className='single-ai-prompt-page__header'>
          <h1 className='single-ai-prompt-page__title'>{translation.title}</h1>
          <p className='single-ai-prompt-page__description'>{translation.description}</p>
        </header>
        <section
          className='single-ai-prompt-page__content'
          dangerouslySetInnerHTML={{ __html: translation.content || '' }}
        />
      </article>
    </>
  );
};

export default SingleAiPromptPage;
