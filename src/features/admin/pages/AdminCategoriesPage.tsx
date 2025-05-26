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
import '../../admin/styles/AdminCategoriesPage.scss';

const languages = ['en', 'pt', 'de', 'es'];

const emptyTranslations: {
  en: CategoryTranslation;
  pt: CategoryTranslation;
  de: CategoryTranslation;
  es: CategoryTranslation;
} = {
  en: { name: '', description: '' },
  pt: { name: '', description: '' },
  de: { name: '', description: '' },
  es: { name: '', description: '' },
};

const AdminCategoriesPage = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<typeof emptyTranslations>(emptyTranslations);
  const [logo, setLogo] = useState('');
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      setCategories(await fetchCategories());
    } catch {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInput = (
    lang: keyof typeof emptyTranslations,
    field: keyof CategoryTranslation,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
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
  };

  const clearForm = () => {
    setEditing(null);
    setForm({ ...emptyTranslations });
    setLogo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing._id, { translations: form, logo });
      } else {
        await createCategory({ translations: form, logo });
      }
      await loadCategories();
      clearForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm('Delete this category? Categorias usadas por posts não podem ser apagadas.')
    )
      return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className='admin-categories-page'>
      <h2>Manage Categories</h2>
      <form className='admin-categories-page__form' onSubmit={handleSubmit}>
        <div className='admin-categories-page__langs'>
          {languages.map((lang) => (
            <div key={lang} className='admin-categories-page__lang-group'>
              <label>{lang.toUpperCase()}:</label>
              <input
                type='text'
                placeholder='Name'
                value={form[lang as keyof typeof emptyTranslations]?.name || ''}
                onChange={(e) =>
                  handleInput(lang as keyof typeof emptyTranslations, 'name', e.target.value)
                }
                className='admin-categories-page__input'
                required={lang === 'en'}
              />
              <textarea
                placeholder='Description'
                value={form[lang as keyof typeof emptyTranslations]?.description || ''}
                onChange={(e) =>
                  handleInput(lang as keyof typeof emptyTranslations, 'description', e.target.value)
                }
                className='admin-categories-page__textarea'
                rows={2}
              />
            </div>
          ))}
        </div>
        <label style={{ marginTop: 16 }}>Logo (URL):</label>
        <input
          type='text'
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder='Logo URL'
        />
        <button type='submit' className='admin-categories-page__btn'>
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type='button'
            onClick={clearForm}
            className='admin-categories-page__btn admin-categories-page__btn--cancel'>
            Cancel
          </button>
        )}
        {error && <div className='admin-categories-page__error'>{error}</div>}
      </form>
      <ul className='admin-categories-page__list'>
        {categories.map((cat) => {
          const tr =
            cat.translations?.[i18n.language] ||
            cat.translations?.[i18n.language.split('-')[0]] ||
            cat.translations?.en;
          return (
            <li key={cat._id} className='admin-categories-page__item'>
              {cat.logo && (
                <img
                  src={cat.logo}
                  alt={tr?.name}
                  className='admin-categories-page__cat-logo'
                  style={{ height: 26, marginRight: 8 }}
                />
              )}
              <b>{tr?.name || '[untitled]'}</b>
              <span className='admin-categories-page__desc'>{tr?.description || ''}</span>
              <button className='admin-categories-page__edit' onClick={() => startEdit(cat)}>
                Edit
              </button>
              <button
                className='admin-categories-page__delete'
                onClick={() => handleDelete(cat._id)}>
                Delete
              </button>
            </li>
          );
        })}
        {categories.length === 0 && <li>No categories found.</li>}
      </ul>
    </div>
  );
};

export default AdminCategoriesPage;
