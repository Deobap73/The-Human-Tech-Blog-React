// /src/pages/WritePage.tsx

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
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
type PostStatus = 'draft' | 'published' | 'archived';

const emptyTranslations = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

const WritePage = () => {
  const { user } = useAuth();
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const activeLang: Language = (lang as Language) || 'en';

  const [currentLang, setCurrentLang] = useState<Language>(activeLang);
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [isQuickPost, setIsQuickPost] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
    ],
    content: '',
  });

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const postData = {
      title: translations.en.title,
      description: translations.en.description,
      content: editor?.getHTML() || '',
      tags,
      categories,
      image: coverUrl,
      isQuickPost,
    };

    if (!postData.title || !postData.description || !postData.content) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }

    try {
      const resToken = await api.get('/auth/csrf', { withCredentials: true });
      const csrfToken = resToken.data.csrfToken;
      await api.post('/posts', postData, {
        headers: { 'x-csrf-token': csrfToken },
        withCredentials: true,
      });
      toast.success('Post published!');
      navigate(`/${activeLang}/admin/posts`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to publish post');
      toast.error(err?.response?.data?.message || 'Failed to publish post');
    }

    setSaving(false);
  };

  return (
    <div className='write-page'>
      <h2>Create Post</h2>
      <form className='write-page__form' onSubmit={handleSubmit}>
        {error && <div className='write-page__error'>{error}</div>}
        <input
          type='text'
          placeholder='Title'
          value={translations[currentLang].title}
          onChange={(e) => handleInput('title', e.target.value)}
          className='write-page__input'
          required
        />
        <textarea
          placeholder='Description'
          value={translations[currentLang].description}
          onChange={(e) => handleInput('description', e.target.value)}
          className='write-page__textarea'
          rows={2}
        />
        {editor && (
          <div className='write-page__editor-block'>
            <div className='write-page__toolbar-sticky'>
              <Toolbar editor={editor} onPublish={() => undefined} />
            </div>
            <div className='write-page__editor-content'>
              <EditorContent editor={editor} />
            </div>
          </div>
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
              const formData = new FormData();
              formData.append('image', file);
              const resToken = await api.get('/auth/csrf', { withCredentials: true });
              const csrfToken = resToken.data.csrfToken;
              const jwt =
                localStorage.getItem('jwt') || (document.cookie.match(/jwt=([^;]+)/) || [])[1];
              const headers: any = { 'x-csrf-token': csrfToken };
              if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
              const res = await api.post('/posts/upload', formData, {
                headers,
                withCredentials: true,
              });
              setCoverUrl(res.data.imageUrl);
              toast.success('Image uploaded!');
            }
          }}
        />
        {coverUrl && (
          <div className='write-page__cover-preview'>
            <img src={coverUrl} alt='Cover Preview' className='write-page__cover-img' />
          </div>
        )}
        <label className='write-page__label'>
          Tags:
          <select
            multiple
            value={tags}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              setTags(selected);
            }}
            className='write-page__select'>
            {availableTags.length ? (
              availableTags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.translations?.en?.name || '[no name]'}
                </option>
              ))
            ) : (
              <option disabled>No tags available</option>
            )}
          </select>
        </label>
        <label className='write-page__label'>
          Categories:
          <select
            multiple
            value={categories}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              setCategories(selected);
            }}
            className='write-page__select'>
            {availableCategories.length ? (
              availableCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.translation?.name || '[no name]'}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </label>
        <label className='write-page__label'>
          <input
            type='checkbox'
            checked={isQuickPost}
            onChange={(e) => setIsQuickPost(e.target.checked)}
          />{' '}
          This is a QuickPost (Tech Short)
        </label>
        <button type='submit' className='write-page__btn' disabled={saving}>
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
