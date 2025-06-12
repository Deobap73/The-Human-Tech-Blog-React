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
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import '../../../features/post/styles/WritePage.scss';
import { toast } from 'react-hot-toast';

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Language = (typeof LANGUAGES)[number];

const emptyTranslations = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

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

  // Editor instance for each language (using useEditor)
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

  // Keep editors content in sync with translations state
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

  // Image upload - Always refresh CSRF before mutating requests
  const handleImageUpload = async (file: File) => {
    // (1) Always fetch CSRF before uploading (preflight)
    await api.get('/auth/csrf', { withCredentials: true });
    const csrfToken = Cookies.get('XSRF-TOKEN');
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post('/posts/upload', formData, {
      headers: {
        'x-csrf-token': csrfToken || '',
      },
      withCredentials: true,
    });
    setCoverUrl(res.data.imageUrl);
    toast.success('Image uploaded!');
  };

  /**
   * Validate only EN fields, tags, categories
   * @returns true if valid, false otherwise
   */
  const validateEnglishFields = (): boolean => {
    const missing = [];
    if (!translations.en.title.trim()) missing.push('Title (EN)');
    if (!translations.en.content.trim()) missing.push('Content (EN)');
    if (!translations.en.description.trim()) missing.push('Description (EN)');
    if (tags.length === 0) missing.push('At least one Tag (EN)');
    if (categories.length === 0) missing.push('At least one Category (EN)');
    if (missing.length) {
      const msg = `Required: ${missing.join(', ')}`;
      setError(msg);
      toast.error(msg);
      return false;
    }
    setError('');
    return true;
  };

  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // (1) Sync ALL editors' content to translations before validation
    const updatedTranslations = { ...translations };
    LANGUAGES.forEach((lang) => {
      const editor = editors[lang];
      if (editor) {
        updatedTranslations[lang].content = editor.getHTML();
      }
    });
    setTranslations(updatedTranslations);

    // (2) Validate only EN fields (other languages are optional)
    if (!validateEnglishFields()) {
      setSaving(false);
      return;
    }

    try {
      // (3) Always refresh CSRF before mutation (prevent 403)
      await api.get('/auth/csrf', { withCredentials: true });
      const csrfToken = Cookies.get('XSRF-TOKEN');

      const payload = {
        translations: updatedTranslations,
        image: coverUrl,
        status: status === 'archived' ? 'draft' : status,
        tags,
        categories,
      };

      if (id) {
        await api.patch(`/posts/${id}`, payload, {
          headers: { 'x-csrf-token': csrfToken || '' },
          withCredentials: true,
        });
        toast.success('Post updated!');
      } else {
        await api.post('/posts', payload, {
          headers: { 'x-csrf-token': csrfToken || '' },
          withCredentials: true,
        });
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
              availableCategories
                .filter((cat) => !!cat._id)
                .map((cat) => (
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
