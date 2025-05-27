//  src/features/admin/pages/AdminTagsPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTags, createTag, updateTag, deleteTag } from '../../../shared/services/tagService';
import { Tag, TagTranslation } from '../../../shared/types/Tag';
import { useToast } from '../../../shared/hooks/useToast';
import Loader from '../../../shared/components/Loader';
import '../../admin/styles/AdminTagsPage.scss';

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Lang = (typeof LANGUAGES)[number];

const initialFormState: Record<Lang, TagTranslation> = {
  en: { name: '', description: '' },
  pt: { name: '', description: '' },
  de: { name: '', description: '' },
  es: { name: '', description: '' },
};

const AdminTagsPage = () => {
  const { t, i18n } = useTranslation();
  const { success, error: errorToast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState<Record<Lang, TagTranslation>>(initialFormState);
  const [color, setColor] = useState('#cccccc');
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);

  const loadTags = async () => {
    setLoading(true);
    try {
      setTags(await fetchTags());
    } catch {
      errorToast(t('adminTagForm.error', 'Failed to fetch tags'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (field: keyof TagTranslation, value: string) => {
    setForm((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
    if (activeLang === 'en' && field === 'name') setFieldErrors({});
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
    setActiveLang('en');
    setError('');
    setFieldErrors({});
  };

  const clearForm = () => {
    setEditing(null);
    setForm(initialFormState);
    setColor('#cccccc');
    setActiveLang('en');
    setError('');
    setFieldErrors({});
  };

  const validateFields = (): boolean => {
    const errors: { name?: string } = {};
    if (!(form.en?.name ?? '').trim()) {
      errors.name = t('adminTagForm.requiredName', 'Name (EN) is required');
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) return;
    setLoading(true);
    try {
      if (editing) {
        await updateTag(editing._id, {
          translations: form,
          color,
        });
        success(t('adminTagForm.updateSuccess', 'Tag updated successfully!'));
      } else {
        await createTag({
          translations: form,
          color,
        });
        success(t('adminTagForm.createSuccess', 'Tag created successfully!'));
      }
      await loadTags();
      clearForm();
    } catch (err: any) {
      errorToast(t('adminTagForm.error', 'Failed to save tag'));
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('adminTagForm.deleteConfirm'))) return;
    setLoading(true);
    try {
      await deleteTag(id);
      success(t('adminTagForm.deleteSuccess', 'Tag deleted successfully!'));
      await loadTags();
    } catch (err: any) {
      errorToast(t('adminTagForm.error', 'Failed to delete tag'));
    }
    setLoading(false);
  };

  return (
    <div className='admin-tags-page'>
      <h2>{t('adminTagForm.title')}</h2>
      {loading ? (
        <Loader />
      ) : (
        <form className='admin-tags-page__form' onSubmit={handleSubmit}>
          {/* Multilingual Tabs */}
          <div className='admin-tags-page__tabs'>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type='button'
                className={`admin-tags-page__tab${activeLang === lang ? ' active' : ''}`}
                onClick={() => setActiveLang(lang)}>
                {lang.toUpperCase()}
                {lang === 'en' && <span className='admin-tags-page__tab-required'>*</span>}
              </button>
            ))}
          </div>
          <div className='admin-tags-page__fields'>
            <label className='admin-tags-page__label'>
              {t('adminTagForm.name')}
              {activeLang === 'en' && <span className='admin-tags-page__asterisk'>*</span>}
              <input
                type='text'
                placeholder={t('adminTagForm.namePlaceholder')}
                value={form[activeLang].name}
                required={activeLang === 'en'}
                className={
                  activeLang === 'en' && fieldErrors.name ? 'admin-tags-page__input-error' : ''
                }
                onChange={(e) => handleInput('name', e.target.value)}
              />
              {activeLang === 'en' && fieldErrors.name && (
                <span className='admin-tags-page__field-error'>{fieldErrors.name}</span>
              )}
            </label>
            <label className='admin-tags-page__label'>
              {t('adminTagForm.description')}
              <textarea
                placeholder={t('adminTagForm.descriptionPlaceholder')}
                value={form[activeLang].description}
                onChange={(e) => handleInput('description', e.target.value)}
                rows={2}
              />
            </label>
          </div>
          <label className='admin-tags-page__label' style={{ marginTop: 16 }}>
            {t('adminTagForm.color')}
            <input
              type='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginLeft: 8, width: 40, height: 40, border: 0 }}
            />
          </label>
          <div className='admin-tags-page__form-actions'>
            <button type='submit' className='admin-tags-page__btn'>
              {editing ? t('adminTagForm.update') : t('adminTagForm.create')}
            </button>
            {editing && (
              <button
                type='button'
                onClick={clearForm}
                className='admin-tags-page__btn admin-tags-page__btn--cancel'>
                {t('adminTagForm.cancel')}
              </button>
            )}
          </div>
          {error && <div className='admin-tags-page__error'>{error}</div>}
        </form>
      )}
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
                {t('admin.edit')}
              </button>
              <button className='admin-tags-page__delete' onClick={() => handleDelete(tag._id)}>
                {t('admin.delete')}
              </button>
            </li>
          );
        })}
        {tags.length === 0 && <li>{t('adminTagForm.noTags')}</li>}
      </ul>
    </div>
  );
};

export default AdminTagsPage;
