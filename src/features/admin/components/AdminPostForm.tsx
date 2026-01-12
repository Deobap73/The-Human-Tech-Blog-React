// ./src/features/admin/components/AdminPostForm.tsx
'use strict';

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import type { Tag } from '../../../shared/types/Tag';
import type { Category } from '../../../shared/types/Category';
import type { Post, PostTranslation, PostPayload } from '../../../shared/types/Post';
import { createPost } from '../../../shared/services/postService';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../shared/hooks/useToast';
import Loader from '../../../shared/components/Loader';
import api from '../../../shared/utils/axios';
import '../../../features/admin/styles/AdminPostForm.scss';

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Lang = (typeof LANGUAGES)[number];

const emptyTranslations: Record<Lang, PostTranslation> = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

interface Props {
  initialPost?: Partial<Post>;
  onSubmit?: (data: PostPayload) => void;
}

type UploadResponse = {
  success: boolean;
  imageUrl: string;
  publicId: string;
  displayName: string;
  ticketSeq: number;
  folder: string;
  folderName: string;
  reason: string;
};

const AdminPostForm = ({ initialPost, onSubmit }: Props) => {
  const { t } = useTranslation();
  const { success, error: errorToast } = useToast();

  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [translations, setTranslations] = useState<Record<Lang, PostTranslation>>(
    initialPost?.translations
      ? {
          en: initialPost.translations.en ?? { title: '', description: '', content: '' },
          pt: initialPost.translations.pt ?? { title: '', description: '', content: '' },
          de: initialPost.translations.de ?? { title: '', description: '', content: '' },
          es: initialPost.translations.es ?? { title: '', description: '', content: '' },
        }
      : emptyTranslations
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTags(), fetchCategories()])
      .then(([tagsData, catData]) => {
        setAvailableTags(tagsData);
        setAvailableCategories(catData);
      })
      .catch(() => errorToast(t('adminPostForm.error', 'Failed to load tags or categories')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTranslationChange = (field: keyof PostTranslation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
    if (activeLang === 'en') setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setTags(selected);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setCategories(selected);
  };

  const validateFields = (): boolean => {
    const errorsMap: { [key: string]: string } = {};
    if (!translations.en.title.trim())
      errorsMap.title = t('adminPostForm.requiredTitle', 'Title is required (EN)');
    if (!translations.en.description.trim())
      errorsMap.description = t(
        'adminPostForm.requiredDescription',
        'Description is required (EN)'
      );
    if (!translations.en.content.trim())
      errorsMap.content = t('adminPostForm.requiredContent', 'Content is required (EN)');
    setFieldErrors(errorsMap);
    return Object.keys(errorsMap).length === 0;
  };

  const uploadCoverViaApi = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const categoryId = categories.length > 0 ? categories[0] : '';
    if (categoryId) formData.append('categoryId', categoryId);

    // AdminPostForm does not manage these flags, so we default
    formData.append('isQuickPost', 'false');
    formData.append('isAiPrompt', 'false');

    const resToken = await api.get('/auth/csrf', { withCredentials: true });
    const csrfToken = resToken.data.csrfToken as string;

    const res = await api.post<UploadResponse>('/uploads/post-cover', formData, {
      headers: { 'x-csrf-token': csrfToken },
      withCredentials: true,
    });

    if (!res.data?.success) {
      throw new Error('Upload failed');
    }

    return res.data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) return;

    setLoading(true);

    try {
      let imgUrl = imageUrl;

      if (image) {
        imgUrl = await uploadCoverViaApi(image);
        setImageUrl(imgUrl);
      }

      const data: PostPayload = {
        translations,
        tags,
        categories,
        status,
        image: imgUrl,
      };

      if (onSubmit) {
        await onSubmit(data);
      } else {
        await createPost(data as any);
        success(t('adminPostForm.createSuccess', 'Post created successfully!'));
        navigate('/admin/posts');
      }
    } catch (err: unknown) {
      errorToast(t('adminPostForm.error', 'Failed to save post'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <form onSubmit={handleSubmit} className='admin-post-form' autoComplete='off'>
        {loading && <Loader />}
        {error && <div className='admin-post-form__error'>{error}</div>}

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
          {imageUrl && (
            <img
              src={imageUrl}
              alt='Post Cover'
              style={{ height: 100, margin: 8 }}
              loading='lazy'
            />
          )}
        </div>

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

        <label>
          {t('adminPostForm.status', 'Status:')}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
            <option value='draft'>{t('adminPostForm.draft', 'Draft')}</option>
            <option value='published'>{t('adminPostForm.published', 'Published')}</option>
          </select>
        </label>

        <button type='submit' className='admin-post-form__submit'>
          {t('adminPostForm.save', 'Save')}
        </button>
      </form>
    </>
  );
};

export default AdminPostForm;
