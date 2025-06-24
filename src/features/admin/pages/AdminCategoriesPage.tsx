// src/features/admin/pages/AdminCategoriesPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../shared/services/categoryService';
import { Category, CategoryTranslation } from '../../../shared/types/Category';
import { useToast } from '../../../shared/hooks/useToast';
import Loader from '../../../shared/components/Loader';
import '../../admin/styles/AdminCategoriesPage.scss';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers'; // <-- Import helper

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Lang = (typeof LANGUAGES)[number];

const emptyTranslations: Record<Lang, CategoryTranslation> = {
  en: { name: '', description: '' },
  pt: { name: '', description: '' },
  de: { name: '', description: '' },
  es: { name: '', description: '' },
};

const AdminCategoriesPage = () => {
  const { t, i18n } = useTranslation();
  const { success, error: errorToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Record<Lang, CategoryTranslation>>(emptyTranslations);
  const [logo, setLogo] = useState('');
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string }>({});

  const loadCategories = async () => {
    setLoading(true);
    try {
      setCategories(await fetchCategories());
    } catch {
      errorToast(t('adminCategoryForm.error', 'Failed to fetch categories'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInput = (field: keyof CategoryTranslation, value: string) => {
    setForm((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
    if (activeLang === 'en') setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      en: cat.translations?.en || { name: '', description: '' },
      pt: cat.translations?.pt || { name: '', description: '' },
      de: cat.translations?.de || { name: '', description: '' },
      es: cat.translations?.es || { name: '', description: '' },
    });
    setLogo(cat.logo || '');
    setActiveLang('en');
    setError('');
    setFieldErrors({});
  };

  const clearForm = () => {
    setEditing(null);
    setForm({ ...emptyTranslations });
    setLogo('');
    setActiveLang('en');
    setError('');
    setFieldErrors({});
  };

  const validateFields = (): boolean => {
    const errors: { name?: string; description?: string } = {};
    if (!(form.en?.name ?? '').trim()) {
      errors.name = t('adminCategoryForm.requiredName', 'Name (EN) is required');
    }
    if (!(form.en?.description ?? '').trim()) {
      errors.description = t(
        'adminCategoryForm.requiredDescription',
        'Description (EN) is required'
      );
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
        await updateCategory(editing._id, { translations: form, logo });
        success(t('adminCategoryForm.updateSuccess', 'Category updated successfully!'));
      } else {
        await createCategory({ translations: form, logo });
        success(t('adminCategoryForm.createSuccess', 'Category created successfully!'));
      }
      await loadCategories();
      clearForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || t('adminCategoryForm.error'));
      errorToast(t('adminCategoryForm.error', 'Failed to save category'));
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('adminCategoryForm.deleteConfirm'))) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      success(t('adminCategoryForm.deleteSuccess', 'Category deleted successfully!'));
      await loadCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || t('adminCategoryForm.error'));
      errorToast(t('adminCategoryForm.error', 'Failed to delete category'));
    }
    setLoading(false);
  };

  return (
    <div className='admin-categories-page'>
      <h2>{t('adminCategoryForm.title', 'Manage Categories')}</h2>
      {loading ? (
        <Loader />
      ) : (
        <form className='admin-categories-page__form' onSubmit={handleSubmit} autoComplete='off'>
          {/* Multilanguage Tabs */}
          <div className='admin-categories-page__tabs'>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type='button'
                className={`admin-categories-page__tab${activeLang === lang ? ' active' : ''}`}
                onClick={() => setActiveLang(lang)}>
                {lang.toUpperCase()}
                {lang === 'en' && <span className='admin-categories-page__tab-required'>*</span>}
              </button>
            ))}
          </div>
          <div className='admin-categories-page__fields'>
            <label className='admin-categories-page__label'>
              {t('adminCategoryForm.name')}
              {activeLang === 'en' && <span className='admin-categories-page__asterisk'>*</span>}
              <input
                type='text'
                placeholder={t('adminCategoryForm.namePlaceholder')}
                value={form[activeLang].name}
                required={activeLang === 'en'}
                className={
                  activeLang === 'en' && fieldErrors.name
                    ? 'admin-categories-page__input-error'
                    : ''
                }
                onChange={(e) => handleInput('name', e.target.value)}
                autoComplete='off'
              />
              {activeLang === 'en' && fieldErrors.name && (
                <span className='admin-categories-page__field-error'>{fieldErrors.name}</span>
              )}
            </label>
            <label className='admin-categories-page__label'>
              {t('adminCategoryForm.description')}
              {activeLang === 'en' && <span className='admin-categories-page__asterisk'>*</span>}
              <textarea
                placeholder={t('adminCategoryForm.descriptionPlaceholder')}
                value={form[activeLang].description}
                required={activeLang === 'en'}
                className={
                  activeLang === 'en' && fieldErrors.description
                    ? 'admin-categories-page__input-error'
                    : ''
                }
                onChange={(e) => handleInput('description', e.target.value)}
                rows={2}
                autoComplete='off'
              />
              {activeLang === 'en' && fieldErrors.description && (
                <span className='admin-categories-page__field-error'>
                  {fieldErrors.description}
                </span>
              )}
            </label>
          </div>
          <label className='admin-categories-page__label' style={{ marginTop: 16 }}>
            {t('adminCategoryForm.logo')}
            <input
              type='text'
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder={t('adminCategoryForm.logoPlaceholder')}
              autoComplete='off'
            />
            {logo && (
              <img
                src={resolveLogoUrl(logo)}
                alt='logo preview'
                className='admin-categories-page__logo-preview'
                style={{
                  height: 32,
                  marginLeft: 14,
                  borderRadius: 4,
                  border: '1px solid #eee',
                  background: '#fff',
                }}
              />
            )}
          </label>
          <div className='admin-categories-page__form-actions'>
            <button type='submit' className='admin-categories-page__btn'>
              {editing ? t('adminCategoryForm.update') : t('adminCategoryForm.create')}
            </button>
            {editing && (
              <button
                type='button'
                onClick={clearForm}
                className='admin-categories-page__btn admin-categories-page__btn--cancel'>
                {t('adminCategoryForm.cancel')}
              </button>
            )}
          </div>
          {error && <div className='admin-categories-page__error'>{error}</div>}
        </form>
      )}
      <ul className='admin-categories-page__list'>
        {categories.map((cat) => {
          const tr =
            cat.translations?.[i18n.language as Lang] ||
            cat.translations?.[i18n.language.split('-')[0] as Lang] ||
            cat.translations?.en;
          return (
            <li key={cat._id} className='admin-categories-page__item'>
              {cat.logo && (
                <img
                  src={resolveLogoUrl(cat.logo)}
                  alt={tr?.name}
                  className='admin-categories-page__cat-logo'
                  style={{ height: 26, marginRight: 8 }}
                />
              )}
              <b>{tr?.name || '[untitled]'}</b>
              <span className='admin-categories-page__desc'>{tr?.description || ''}</span>
              <button className='admin-categories-page__edit' onClick={() => startEdit(cat)}>
                {t('admin.edit')}
              </button>
              <button
                className='admin-categories-page__delete'
                onClick={() => handleDelete(cat._id)}>
                {t('admin.delete')}
              </button>
            </li>
          );
        })}
        {categories.length === 0 && <li>{t('adminCategoryForm.noCategories')}</li>}
      </ul>
    </div>
  );
};

export default AdminCategoriesPage;
