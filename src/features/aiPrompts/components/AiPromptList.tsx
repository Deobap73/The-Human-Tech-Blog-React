// File: src/features/aiPrompts/components/AiPromptList.tsx
import { AiPrompt } from '../../../shared/types/iPrompt';
import AiPromptItem from './AiPromptItem';
import '../styles/AiPromptList.scss';

interface Props {
  prompts: AiPrompt[];
  lang: string;
}

const AiPromptList = ({ prompts, lang }: Props) => (
  <ul className='ai-prompt-list'>
    {prompts.map((prompt) => (
      <AiPromptItem key={prompt._id} prompt={prompt} lang={lang} />
    ))}
  </ul>
);

export default AiPromptList;
