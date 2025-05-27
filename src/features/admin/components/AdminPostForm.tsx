// src/features/admin/components/AdminPostForm.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import { Post, PostTranslation } from '../../../shared/types/Post';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import '../../../features/admin/styles/AdminPostForm.scss';

const LANGUAGES = ['en', 'pt', 'de', 'es'];

const emptyTranslations: { [lang: string]: PostTranslation } = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

interface Props {
  initialPost?: Partial<Post>;
  onSubmit?: (data: Partial<Post>) => void;
}

const AdminPostForm = ({ initialPost, onSubmit }: Props) => {
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState('en');

  // Multilanguage initialization, never undefined
  const initialTranslations: { [lang: string]: PostTranslation } = {
    en: initialPost?.translations?.en ?? { title: '', description: '', content: '' },
    pt: initialPost?.translations?.pt ?? { title: '', description: '', content: '' },
    de: initialPost?.translations?.de ?? { title: '', description: '', content: '' },
    es: initialPost?.translations?.es ?? { title: '', description: '', content: '' },
  };

  const [translations, setTranslations] = useState<{ [lang: string]: PostTranslation }>(
    initialTranslations
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [categories, setCategories] = useState<string[]>(
    initialPost?.categories
      ? initialPost.categories.map((cat: any) => (typeof cat === 'string' ? cat : cat._id))
      : []
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const initialStatus =
    initialPost?.status === 'published' || initialPost?.status === 'draft'
      ? initialPost.status
      : 'draft';
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialPost?.image || '');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => setError(t('adminPostForm.error', 'Failed to load tags')));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => setError(t('adminPostForm.error', 'Failed to load categories')));
  }, [t]);

  const handleTranslationChange = (field: keyof PostTranslation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
    // Clear field error on edit
    if (activeLang === 'en') {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setTags(selected);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setCategories(selected);
  };

  // Image upload (Cloudinary)
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_preset'); // Replace by your preset
    const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  // Multilanguage validation (EN required)
  const validateFields = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!translations.en.title.trim())
      errors.title = t('adminPostForm.requiredTitle', 'Title is required (EN)');
    if (!translations.en.description.trim())
      errors.description = t('adminPostForm.requiredDescription', 'Description is required (EN)');
    if (!translations.en.content.trim())
      errors.content = t('adminPostForm.requiredContent', 'Content is required (EN)');
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) return;

    try {
      let imgUrl = imageUrl;
      if (image) {
        imgUrl = await uploadImage(image);
        setImageUrl(imgUrl);
      }
      const data: Partial<Post> = {
        translations: {
          en: translations.en,
          pt: translations.pt,
          de: translations.de,
          es: translations.es,
        },
        tags,
        categories,
        status,
        image: imgUrl,
      };
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await api.post('/posts', data);
        navigate('/admin/posts');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || t('adminPostForm.error', 'Failed to save post'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className='admin-post-form' autoComplete='off'>
      {error && <div className='admin-post-form__error'>{error}</div>}

      {/* Multilanguage tabs */}
      <div className='admin-post-form__tabs'>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type='button'
            className={`admin-post-form__tab${activeLang === lang ? ' active' : ''}`}
            onClick={() => setActiveLang(lang)}>
            {lang.toUpperCase()}
            {lang === 'en' && <span className='admin-post-form__tab-required'>*</span>}
          </button>
        ))}
      </div>

      {/* Multilanguage fields */}
      <div className={`admin-post-form__fields admin-post-form__fields--${activeLang}`}>
        <label className='admin-post-form__label'>
          {t('adminPostForm.title', 'Title')}
          {activeLang === 'en' && <span className='admin-post-form__asterisk'>*</span>}
          <input
            type='text'
            placeholder={t('adminPostForm.titlePlaceholder', 'Post title')}
            value={translations[activeLang]?.title || ''}
            required={activeLang === 'en'}
            className={
              activeLang === 'en' && fieldErrors.title ? 'admin-post-form__input-error' : ''
            }
            onChange={(e) => handleTranslationChange('title', e.target.value)}
            autoComplete='off'
          />
          {activeLang === 'en' && fieldErrors.title && (
            <span className='admin-post-form__field-error'>{fieldErrors.title}</span>
          )}
        </label>
        <label className='admin-post-form__label'>
          {t('adminPostForm.description', 'Description')}
          {activeLang === 'en' && <span className='admin-post-form__asterisk'>*</span>}
          <textarea
            placeholder={t('adminPostForm.descriptionPlaceholder', 'Short description')}
            value={translations[activeLang]?.description || ''}
            required={activeLang === 'en'}
            className={
              activeLang === 'en' && fieldErrors.description ? 'admin-post-form__input-error' : ''
            }
            onChange={(e) => handleTranslationChange('description', e.target.value)}
            rows={3}
            autoComplete='off'
          />
          {activeLang === 'en' && fieldErrors.description && (
            <span className='admin-post-form__field-error'>{fieldErrors.description}</span>
          )}
        </label>
        <label className='admin-post-form__label'>
          {t('adminPostForm.content', 'Content')}
          {activeLang === 'en' && <span className='admin-post-form__asterisk'>*</span>}
          <textarea
            placeholder={t('adminPostForm.contentPlaceholder', 'Full content')}
            value={translations[activeLang]?.content || ''}
            required={activeLang === 'en'}
            className={
              activeLang === 'en' && fieldErrors.content ? 'admin-post-form__input-error' : ''
            }
            onChange={(e) => handleTranslationChange('content', e.target.value)}
            rows={6}
            autoComplete='off'
          />
          {activeLang === 'en' && fieldErrors.content && (
            <span className='admin-post-form__field-error'>{fieldErrors.content}</span>
          )}
        </label>
      </div>

      {/* Image upload */}
      <div className='admin-post-form__img'>
        <label>{t('adminPostForm.image', 'Post Image:')}</label>
        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);
            if (file) setImageUrl(URL.createObjectURL(file));
          }}
        />
        {imageUrl && <img src={imageUrl} alt='Post Cover' style={{ height: 100, margin: 8 }} />}
      </div>

      {/* Tags and Categories */}
      <label>
        {t('adminPostForm.tags', 'Tags:')}
        <select multiple value={tags} onChange={handleTagChange}>
          {availableTags.map((tag) => (
            <option value={tag._id} key={tag._id}>
              {tag.translations?.en?.name || ''}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('adminPostForm.categories', 'Categories:')}
        <select multiple value={categories} onChange={handleCategoryChange}>
          {availableCategories.map((cat) => (
            <option value={cat._id} key={cat._id}>
              {cat.translations?.en?.name || ''}
            </option>
          ))}
        </select>
      </label>

      {/* Status */}
      <label>
        {t('adminPostForm.status', 'Status:')}
        <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
          <option value='draft'>{t('adminPostForm.draft', 'Draft')}</option>
          <option value='published'>{t('adminPostForm.published', 'Published')}</option>
        </select>
      </label>
      <button type='submit' className='admin-post-form__submit'>
        {t('adminPostForm.save', 'Save')}
      </button>
    </form>
  );
};

export default AdminPostForm;
