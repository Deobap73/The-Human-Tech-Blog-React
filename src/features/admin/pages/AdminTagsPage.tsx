// src/features/admin/pages/AdminTagsPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTags, createTag, updateTag, deleteTag } from '../../../shared/services/tagService';
import { Tag, TagTranslation } from '../../../shared/types/Tag';
import '../../admin/styles/AdminTagsPage.scss';

// Definição explícita das línguas suportadas
const languages = ['en', 'pt', 'de', 'es'] as const;
type Lang = (typeof languages)[number];

const initialFormState: Record<Lang, TagTranslation> = {
  en: { name: '', description: '' },
  pt: { name: '', description: '' },
  de: { name: '', description: '' },
  es: { name: '', description: '' },
};

const AdminTagsPage = () => {
  const { i18n } = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState<Record<Lang, TagTranslation>>(initialFormState);
  const [color, setColor] = useState('#cccccc');
  const [error, setError] = useState('');

  const loadTags = async () => {
    try {
      setTags(await fetchTags());
    } catch {
      setError('Failed to fetch tags');
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleInput = (lang: Lang, field: keyof TagTranslation, value: string) => {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const startEdit = (tag: Tag) => {
    setEditing(tag);
    setForm({
      en: tag.translations.en || { name: '', description: '' },
      pt: tag.translations.pt || { name: '', description: '' },
      de: tag.translations.de || { name: '', description: '' },
      es: tag.translations.es || { name: '', description: '' },
    });
    setColor(tag.color || '#cccccc');
  };

  const clearForm = () => {
    setEditing(null);
    setForm(initialFormState);
    setColor('#cccccc');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateTag(editing._id, { translations: form, color });
      } else {
        await createTag({ translations: form, color });
      }
      await loadTags();
      clearForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save tag');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this tag? Tags used by posts cannot be deleted.')) return;
    try {
      await deleteTag(id);
      await loadTags();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete tag');
    }
  };

  return (
    <div className='admin-tags-page'>
      <h2>Manage Tags</h2>
      <form className='admin-tags-page__form' onSubmit={handleSubmit}>
        <div className='admin-tags-page__langs'>
          {languages.map((lang) => (
            <div key={lang} className='admin-tags-page__lang-group'>
              <label>{lang.toUpperCase()}:</label>
              <input
                type='text'
                placeholder='Name'
                value={form[lang].name}
                onChange={(e) => handleInput(lang, 'name', e.target.value)}
                className='admin-tags-page__input'
                required={lang === 'en'}
              />
              <textarea
                placeholder='Description'
                value={form[lang].description}
                onChange={(e) => handleInput(lang, 'description', e.target.value)}
                className='admin-tags-page__textarea'
                rows={2}
              />
            </div>
          ))}
        </div>
        <label style={{ marginTop: 16 }}>Color:</label>
        <input
          type='color'
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginLeft: 8, width: 40, height: 40, border: 0 }}
        />
        <button type='submit' className='admin-tags-page__btn'>
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type='button'
            onClick={clearForm}
            className='admin-tags-page__btn admin-tags-page__btn--cancel'>
            Cancel
          </button>
        )}
        {error && <div className='admin-tags-page__error'>{error}</div>}
      </form>
      <ul className='admin-tags-page__list'>
        {tags.map((tag) => {
          const tr =
            tag.translations[i18n.language as Lang] ||
            tag.translations[i18n.language.split('-')[0] as Lang] ||
            tag.translations.en;
          return (
            <li key={tag._id} className='admin-tags-page__item'>
              <span
                className='admin-tags-page__tag-color'
                style={{
                  background: tag.color || '#eee',
                  marginRight: 8,
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
                title={tr?.name}
              />
              <b>{tr?.name || '[untitled]'}</b>
              <span className='admin-tags-page__desc'>{tr?.description || ''}</span>
              <button className='admin-tags-page__edit' onClick={() => startEdit(tag)}>
                Edit
              </button>
              <button className='admin-tags-page__delete' onClick={() => handleDelete(tag._id)}>
                Delete
              </button>
            </li>
          );
        })}
        {tags.length === 0 && <li>No tags found.</li>}
      </ul>
    </div>
  );
};

export default AdminTagsPage;
