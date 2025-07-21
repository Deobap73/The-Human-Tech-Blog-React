// File: src/features/aiPrompts/components/AiPromptCard.tsx

import { Link } from 'react-router-dom';
import { AiPrompt } from '../../../shared/types/AiPrompt';
import { getAvatar } from '../../../shared/utils/getAvatar';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';
import '../styles/AiPromptCard.scss';

interface Props {
  prompt: AiPrompt;
  lang: string;
}

/**
 * Renders an AI Prompt card with category, image, title, and meta.
 */
const AiPromptCard = ({ prompt, lang }: Props) => {
  const translation = getPostTranslation(prompt.translations, lang);
  if (!translation.title || !translation.description) return null;

  const user = (prompt as any).user || (prompt as any).author || {};
  const category = prompt.categories?.[0];
  const categoryName = getCategoryName(category, lang);
  const categoryLogo = category?.logo ? resolveLogoUrl(category.logo) : '/default-logo.png';

  return (
    <div className='ai-prompt-card'>
      <Link to={`/${lang}/ai-prompts/${prompt.slug}`} className='ai-prompt-card__link'>
        <div className='ai-prompt-card__img-wrap'>
          <img
            src={prompt.image || '/no-image.webp'}
            alt={translation.title}
            className='ai-prompt-card__image'
          />
          <div className='ai-prompt-card__overlay' />
          <div className='ai-prompt-card__category'>
            <img
              src={categoryLogo}
              alt={categoryName}
              className='ai-prompt-card__category-logo'
              height={28}
              width={28}
            />
            <span className='ai-prompt-card__category-label'>{categoryName}</span>
          </div>
        </div>
        <div className='ai-prompt-card__content'>
          <h3 className='ai-prompt-card__title'>
            {translation.title.length > 50
              ? translation.title.slice(0, 50) + '...'
              : translation.title}
          </h3>
          <p className='ai-prompt-card__desc'>
            {translation.description.length > 120
              ? translation.description.slice(0, 120) + '...'
              : translation.description}
          </p>
          <div className='ai-prompt-card__meta'>
            <img
              src={getAvatar(user)}
              alt='User avatar'
              className='ai-prompt-card__avatar'
              width={38}
              height={38}
            />
            <span className='ai-prompt-card__date'>
              {prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AiPromptCard;
