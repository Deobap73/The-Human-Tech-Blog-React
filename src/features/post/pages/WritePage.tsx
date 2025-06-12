// /src/features/post/pages/WritePage.tsx

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Toolbar from '../components/EditorToolbar';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { refreshCsrfToken } from '../../../shared/services/csrfService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import '../../../features/post/styles/WritePage.scss';
import { toast } from 'react-hot-toast';

// Supported languages for multilanguage content
const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Language = (typeof LANGUAGES)[number];

const emptyTranslations = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

const schema = z.object({
  title: z.string().min(5, 'Title is too short'),
  content: z.string().min(10, 'Content too short'),
});

type PostStatus = 'draft' | 'published' | 'archived';

const WritePage = () => {
  const { user } = useAuth();
  const { id } = useParams(); // Edit mode if id present
  const navigate = useNavigate();

  // Multilingual state
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [status, setStatus] = useState<PostStatus>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Editor per language
  const editors = LANGUAGES.reduce((acc, lang) => {
    acc[lang] = useEditor({
      extensions: [StarterKit, Underline, Image],
      content: translations[lang].content,
    });
    return acc;
  }, {} as Record<Language, ReturnType<typeof useEditor>>);

  // Fetch tags/categories on mount
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // Load post if editing
  useEffect(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then((res) => {
        const post = res.data;
        setStatus(
          ['draft', 'published', 'archived'].includes(post.status)
            ? (post.status as PostStatus)
            : 'draft'
        );
        setTranslations({
          en: post.translations.en || { title: '', description: '', content: '' },
          pt: post.translations.pt || { title: '', description: '', content: '' },
          de: post.translations.de || { title: '', description: '', content: '' },
          es: post.translations.es || { title: '', description: '', content: '' },
        });
        setTags(post.tags || []);
        setCategories(post.categories.map((cat: any) => cat._id) || []);
        setCoverUrl(post.image || '');
        LANGUAGES.forEach((lang) => {
          editors[lang]?.commands.setContent(post.translations[lang]?.content || '');
        });
      })
      .catch(() => toast.error('Failed to load post'));
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    LANGUAGES.forEach((lang) => {
      editors[lang]?.commands.setContent(translations[lang].content || '');
    });
    // eslint-disable-next-line
  }, [translations]);

  // Tab handler (switch language)
  const handleTabChange = (lang: Language) => {
    // Save current editor content before switching
    const editor = editors[activeLang];
    if (editor) {
      setTranslations((prev) => ({
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          content: editor.getHTML(),
        },
      }));
    }
    setActiveLang(lang);
  };

  // Input handler for multilingual fields
  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value,
      },
    }));
  };

  // Tag/category selection: filter to only valid tag/category IDs
  const handleTags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions)
      .map((o) => o.value)
      .filter((id) => availableTags.some((t) => t._id === id));
    setTags(selected);
  };
  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions)
      .map((o) => o.value)
      .filter((id) => availableCategories.some((c) => c._id === id));
    setCategories(selected);
  };

  // Image upload with robust CSRF refresh
  const handleImageUpload = async (file: File) => {
    try {
      await refreshCsrfToken(); // Ensures the CSRF cookie is fresh
      const formData = new FormData();
      formData.append('image', file);

      const csrfToken = Cookies.get('XSRF-TOKEN');
      const res = await api.post('/posts/upload', formData, {
        headers: {
          'x-csrf-token': csrfToken || '',
          // Do NOT set Content-Type manually, axios sets boundary automatically
        },
        withCredentials: true,
      });
      setCoverUrl(res.data.imageUrl);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload image');
    }
  };

  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save content from current editor before submit
      if (editors[activeLang]) {
        setTranslations((prev) => ({
          ...prev,
          [activeLang]: {
            ...prev[activeLang],
            content: editors[activeLang]?.getHTML() || '',
          },
        }));
      }

      // Validate EN fields
      const en = translations.en;
      const result = schema.safeParse({ title: en.title, content: en.content });
      if (!result.success) {
        setError(result.error.issues[0].message);
        toast.error(result.error.issues[0].message);
        setSaving(false);
        return;
      }

      const payload = {
        translations: { ...translations },
        image: coverUrl,
        status: status === 'archived' ? 'draft' : status,
        tags,
        categories,
      };

      if (id) {
        await api.patch(`/posts/${id}`, payload);
        toast.success('Post updated!');
      } else {
        await api.post('/posts', payload);
        toast.success('Post created!');
      }
      navigate('/admin/posts');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save post');
      toast.error(err?.response?.data?.message || 'Failed to save post');
    }
    setSaving(false);
  };

  return (
    <div className='write-page'>
      <h2>{id ? 'Edit Post' : 'Create New Post'}</h2>
      <div className='write-page__tabs'>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`write-page__tab${activeLang === lang ? ' write-page__tab--active' : ''}`}
            onClick={() => handleTabChange(lang)}
            type='button'>
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      <form className='write-page__form' onSubmit={handleSubmit}>
        {error && <div className='write-page__error'>{error}</div>}
        <input
          type='text'
          placeholder='Title'
          value={translations[activeLang].title}
          onChange={(e) => handleInput('title', e.target.value)}
          required={activeLang === 'en'}
          className='write-page__input'
        />
        <textarea
          placeholder='Description'
          value={translations[activeLang].description}
          onChange={(e) => handleInput('description', e.target.value)}
          className='write-page__textarea'
        />
        {editors[activeLang] && (
          <>
            <Toolbar editor={editors[activeLang]!} onPublish={() => undefined} />
            <EditorContent editor={editors[activeLang]!} />
          </>
        )}
        <label htmlFor='cover-upload' className='write-page__upload-btn'>
          Upload cover
        </label>
        <input
          id='cover-upload'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCover(file);
              await handleImageUpload(file);
            }
          }}
        />
        {coverUrl && (
          <div className='write-page__cover-preview'>
            <img src={coverUrl} alt='Cover Preview' className='write-page__cover-img' />
          </div>
        )}
        <label className='write-page__label' style={{ marginTop: 16 }}>
          Tags:
          <select multiple value={tags} onChange={handleTags} className='write-page__select'>
            {availableTags && availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.translations?.en?.name || '[no name]'}
                </option>
              ))
            ) : (
              <option key='no-tags' disabled>
                No tags available
              </option>
            )}
          </select>
        </label>
        <label className='write-page__label'>
          Categories:
          <select
            multiple
            value={categories}
            onChange={handleCategories}
            className='write-page__select'>
            {availableCategories && availableCategories.length > 0 ? (
              availableCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.translation?.name || '[no name]'}
                </option>
              ))
            ) : (
              <option key='no-categories' disabled>
                No categories available
              </option>
            )}
          </select>
        </label>
        <label className='write-page__label'>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className='write-page__select'>
            <option value='draft'>Draft</option>
            <option value='published'>Published</option>
          </select>
        </label>
        <button type='submit' className='write-page__btn' disabled={saving}>
          {saving ? 'Saving...' : id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
