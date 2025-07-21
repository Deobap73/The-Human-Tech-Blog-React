// File: src/features/aiPrompts/components/AiPromptCard.tsx
import { Link } from 'react-router-dom';
import { AiPrompt } from '../../../shared/types/iPrompt';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';
import '../styles/AiPromptCard.scss';

interface Props {
  prompt: AiPrompt;
  lang: string;
}

const AiPromptCard = ({ prompt, lang }: Props) => {
  const translation = getPostTranslation(prompt.translations, lang);
  if (!translation?.title) return null;

  return (
    <div className='ai-prompt-card'>
      <Link to={`/${lang}/ai-prompts/${prompt.slug}`} className='ai-prompt-card__link'>
        <h3 className='ai-prompt-card__title'>{translation.title}</h3>
        <p className='ai-prompt-card__desc'>{translation.description}</p>
      </Link>
    </div>
  );
};

export default AiPromptCard;
