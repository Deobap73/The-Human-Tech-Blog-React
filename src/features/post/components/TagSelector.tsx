// src/features/post/components/TagSelector.tsx

import { useEffect, useState } from 'react';
import { Tag } from '../../../shared/types/Tag';
import { fetchTags } from '../../../shared/services/tagService';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import '../../../shared/components/styles/ConfirmDialog.scss';
import '../styles/TagSelector.scss';

type Props = {
  selectedTags: string[];
  setSelectedTags: (tagIds: string[]) => void;
};

const TagSelector = ({ selectedTags, setSelectedTags }: Props) => {
  const { i18n, t } = useTranslation();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Fetch tags from backend
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
  }, []);

  // Update tag suggestions as user types
  useEffect(() => {
    const filtered = availableTags.filter((tag) => {
      const name = tag.translations?.[i18n.language]?.name || tag.translations?.en?.name || '';
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

  const handleUnknownTag = () => {
    setNewTagName(input);
    setShowModal(true);
  };

  const handleModalClose = async (createdTag?: Tag) => {
    setShowModal(false);
    setInput('');
    if (createdTag) {
      const updated = await fetchTags();
      setAvailableTags(updated);
      setSelectedTags([...selectedTags, createdTag._id]);
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
        />
        <div className='tag-selector__suggestions'>
          {input &&
            suggestions.map((tag) => (
              <div
                key={tag._id}
                className='tag-selector__suggestion'
                onClick={() => handleAddTag(tag)}>
                {tag.translations?.[i18n.language]?.name ||
                  tag.translations?.en?.name ||
                  '[no name]'}
              </div>
            ))}
          {input && suggestions.length === 0 && (
            <div className='tag-selector__create-option' onClick={handleUnknownTag}>
              {t('Tag not found. Click to create new.')}
            </div>
          )}
        </div>
      </label>

      <div className='tag-selector__selected'>
        {selectedTagObjects.map((tag) => (
          <span key={tag._id} className='tag-selector__tag'>
            {tag.translations?.[i18n.language]?.name || tag.translations?.en?.name}
            <button className='tag-selector__remove' onClick={() => handleRemoveTag(tag._id)}>
              &times;
            </button>
          </span>
        ))}
      </div>

      {showModal && (
        <div className='tag-selector__modal'>
          <div className='tag-selector__modal-content'>
            <p>
              {t('Open tag manager to create')} "{newTagName}"?
            </p>
            <div className='tag-selector__modal-actions'>
              <button
                onClick={() => {
                  window.open('/admin/tags', '_blank');
                  handleModalClose();
                }}
                className='tag-selector__btn'>
                {t('Yes, open manager')}
              </button>
              <button
                onClick={() => handleModalClose()}
                className='tag-selector__btn tag-selector__btn--cancel'>
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
