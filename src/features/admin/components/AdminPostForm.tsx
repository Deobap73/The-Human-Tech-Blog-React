// src/features/admin/components/AdminPostForm.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import { Post, PostTranslation } from '../../../shared/types/Post';
import api from '../../../shared/utils/axios';
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
  const [activeLang, setActiveLang] = useState('en');

  // Corrigir inicialização multilíngue (NUNCA undefined)
  const initialTranslations: { [lang: string]: PostTranslation } = {
    en: initialPost?.translations?.en ?? { title: '', description: '', content: '' },
    pt: initialPost?.translations?.pt ?? { title: '', description: '', content: '' },
    de: initialPost?.translations?.de ?? { title: '', description: '', content: '' },
    es: initialPost?.translations?.es ?? { title: '', description: '', content: '' },
  };

  const [translations, setTranslations] = useState<{ [lang: string]: PostTranslation }>(
    initialTranslations
  );

  // Tags e categorias salvos como IDs (string)
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [categories, setCategories] = useState<string[]>(
    initialPost?.categories
      ? initialPost.categories.map((cat: any) => (typeof cat === 'string' ? cat : cat._id))
      : []
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // Status só pode ser draft ou published
  const initialStatus =
    initialPost?.status === 'published' || initialPost?.status === 'draft'
      ? initialPost.status
      : 'draft';
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialPost?.image || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => setError('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => setError('Failed to load categories'));
  }, []);

  const handleTranslationChange = (field: keyof PostTranslation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setTags(selected);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setCategories(selected);
  };

  // Imagem upload para Cloudinary (ajustar para seu projeto real)
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_preset'); // Troque pelo seu preset
    const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imgUrl = imageUrl;
      if (image) {
        imgUrl = await uploadImage(image);
        setImageUrl(imgUrl);
      }

      // Corrigir envio: garantir formato correto esperado pelo backend!
      const data: Partial<Post> = {
        translations: {
          en: translations.en,
          pt: translations.pt,
          de: translations.de,
          es: translations.es,
        },
        tags,
        categories: categories.map((catId) => ({ _id: catId })), // <-- ajuste!
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
      setError(err?.response?.data?.message || 'Failed to save post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='admin-post-form'>
      {error && <div className='admin-post-form__error'>{error}</div>}

      {/* Tabs por idioma */}
      <div className='admin-post-form__tabs'>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type='button'
            className={`admin-post-form__tab${activeLang === lang ? ' active' : ''}`}
            onClick={() => setActiveLang(lang)}>
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Campos multilíngue */}
      <div className='admin-post-form__fields'>
        <input
          type='text'
          placeholder='Title'
          value={translations[activeLang]?.title || ''}
          required={activeLang === 'en'}
          onChange={(e) => handleTranslationChange('title', e.target.value)}
        />
        <textarea
          placeholder='Description'
          value={translations[activeLang]?.description || ''}
          required={activeLang === 'en'}
          onChange={(e) => handleTranslationChange('description', e.target.value)}
        />
        <textarea
          placeholder='Content'
          value={translations[activeLang]?.content || ''}
          required={activeLang === 'en'}
          onChange={(e) => handleTranslationChange('content', e.target.value)}
        />
      </div>

      {/* Upload de Imagem */}
      <div className='admin-post-form__img'>
        <label>Post Image:</label>
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

      {/* Tags e Categorias */}
      <label>
        Tags:
        <select multiple value={tags} onChange={handleTagChange}>
          {availableTags.map((tag) => (
            <option value={tag._id} key={tag._id}>
              {tag.translations?.en?.name || ''}
            </option>
          ))}
        </select>
      </label>
      <label>
        Categories:
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
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
          <option value='draft'>Draft</option>
          <option value='published'>Published</option>
        </select>
      </label>
      <button type='submit'>Save</button>
    </form>
  );
};

export default AdminPostForm;
