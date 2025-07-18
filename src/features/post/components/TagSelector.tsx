// src/features/post/components/TagSelector.tsx

import { useEffect, useState } from 'react';
import { Tag } from '../../../shared/types/Tag';
import { fetchTags, createTag } from '../../../shared/services/tagService';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import slugify from 'slugify';
import '../../../shared/components/styles/ConfirmDialog.scss';
import '../styles/TagSelector.scss';

type Props = {
  selectedTags: string[];
  setSelectedTags: (tagIds: string[]) => void;
};

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Lang = (typeof LANGUAGES)[number];

const TagSelector = ({ selectedTags, setSelectedTags }: Props) => {
  const { i18n, t } = useTranslation();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [creating, setCreating] = useState(false);

  // Load tags from backend
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error(t('Failed to load tags')));
  }, []);

  // Update suggestions based on input
  useEffect(() => {
    const filtered = availableTags.filter((tag) => {
      const name =
        tag.translations?.[i18n.language as Lang]?.name || tag.translations?.en?.name || '';
      return name.toLowerCase().includes(input.toLowerCase());
    });
    setSuggestions(filtered);
  }, [input, availableTags, i18n.language]);

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.includes(tag._id)) {
      setSelectedTags([...selectedTags, tag._id]);
    }
    setInput('');
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!input.trim()) return;

    setCreating(true);
    const newSlug = slugify(input.trim(), { lower: true, strict: true });

    const payload = {
      slug: newSlug,
      color: '#cccccc',
      translations: {
        en: { name: input.trim() },
      },
    };

    try {
      const newTag = await createTag(payload);
      const updatedTags = await fetchTags();
      setAvailableTags(updatedTags);
      setSelectedTags([...selectedTags, newTag._id]);
      toast.success(t('Tag created and selected!'));
      setInput('');
    } catch (err: any) {
      const message = err?.response?.data?.message || t('Failed to create tag');
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const selectedTagObjects = availableTags.filter((t) => selectedTags.includes(t._id));

  return (
    <div className='tag-selector'>
      <label className='tag-selector__label'>
        {t('Tags')}:
        <input
          type='text'
          className='tag-selector__input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Type to search or add tag...')}
          disabled={creating}
        />
        <div className='tag-selector__suggestions'>
          {input &&
            suggestions.map((tag) => (
              <div
                key={tag._id}
                className='tag-selector__suggestion'
                onClick={() => handleAddTag(tag)}>
                {tag.translations?.[i18n.language as Lang]?.name ||
                  tag.translations?.en?.name ||
                  '[no name]'}
              </div>
            ))}
          {input && suggestions.length === 0 && (
            <div className='tag-selector__create-option' onClick={handleCreateTag}>
              {creating ? t('Creating...') : t('Tag not found. Click to create new.')}
            </div>
          )}
        </div>
      </label>

      <div className='tag-selector__selected'>
        {selectedTagObjects.map((tag) => (
          <span key={tag._id} className='tag-selector__tag'>
            {tag.translations?.[i18n.language as Lang]?.name || tag.translations?.en?.name}
            <button className='tag-selector__remove' onClick={() => handleRemoveTag(tag._id)}>
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
