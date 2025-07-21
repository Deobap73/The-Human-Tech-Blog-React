// File: src/features/aiPrompts/pages/AiPromptsPage.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiPrompt } from '../../../shared/types/iPrompt';
import { getAiPrompts } from '../../../shared/services/aiPromptService';
import AiPromptCard from '../components/AiPromptCard';
import ScrollToTop from '../../../shared/components/ScrollToTop';
import '../styles/AiPromptsPage.scss';

const AiPromptsPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);

  useEffect(() => {
    getAiPrompts()
      .then(setPrompts)
      .catch(() => {
        /* handle error */
      });
  }, []);

  return (
    <>
      <ScrollToTop />
      <section className='ai-prompts-page'>
        <div className='ai-prompts-page__header'>
          <h2 className='ai-prompts-page__title'>{t('aiPrompts.title', 'AI Prompts')}</h2>
          <p className='ai-prompts-page__intro'>
            {t('aiPrompts.intro', 'Short AI-focused articles')}
          </p>
        </div>
        <div className='ai-prompts-page__list'>
          {prompts.map((prompt) => (
            <AiPromptCard key={prompt._id} prompt={prompt} lang={lang} />
          ))}
        </div>
      </section>
    </>
  );
};

export default AiPromptsPage;
