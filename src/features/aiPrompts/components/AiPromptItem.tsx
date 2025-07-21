// File: src/features/aiPrompts/components/AiPromptItem.tsx
import { Link } from 'react-router-dom';
import { AiPrompt } from '../../../shared/types/iPrompt';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';
import '../styles/AiPromptItem.scss';

interface Props {
  prompt: AiPrompt;
  lang: string;
}

const AiPromptItem = ({ prompt, lang }: Props) => {
  const translation = getPostTranslation(prompt.translations, lang);
  return (
    <li className='ai-prompt-item'>
      <Link to={`/${lang}/ai-prompts/${prompt.slug}`} className='ai-prompt-item__link'>
        <span className='ai-prompt-item__title'>{translation.title}</span>
      </Link>
    </li>
  );
};

export default AiPromptItem;
