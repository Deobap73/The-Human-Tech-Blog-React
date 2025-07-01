// /src/pages/WritePage.tsx

import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { CustomCodeBlock } from '../../../shared/extensions/CustomCodeBlock';
import Toolbar from '../components/EditorToolbar';

import { useNavigate, useParams } from 'react-router-dom';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import {
  createPost,
  updatePost,
  fetchPost,
  uploadPostImage,
} from '../../../shared/services/postService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import { toast } from 'react-hot-toast';
import '../styles/WritePage.scss';
import '../styles/CodeBlock.scss';
import EditorWrapper from '../components/EditorWrapper';

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
  const { id, lang } = useParams<{ id?: string; lang?: string }>();
  const navigate = useNavigate();
  const activeLang: Language = (lang as Language) || 'en';

  const [currentLang, setCurrentLang] = useState<Language>(activeLang);
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [status, setStatus] = useState<PostStatus>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [isQuickPost, setIsQuickPost] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const editors = LANGUAGES.reduce((acc, lang) => {
    acc[lang] = useEditor({
      extensions: [
        StarterKit.configure({ codeBlock: false }),
        Underline,
        Image,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        }),
        CustomCodeBlock,
      ],
      content: translations[lang].content,
    });
    return acc;
  }, {} as Record<Language, ReturnType<typeof useEditor>>);

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  useEffect(() => {
    if (!id) return;
    console.log('[DEBUG] Loading post with ID:', id);
    fetchPost(id)
      .then((post) => {
        console.log('[DEBUG] Post fetched successfully:', post);
        setTranslations({
          en: post.translations?.en || { title: '', description: '', content: '' },
          pt: post.translations?.pt || { title: '', description: '', content: '' },
          de: post.translations?.de || { title: '', description: '', content: '' },
          es: post.translations?.es || { title: '', description: '', content: '' },
        });

        // ✅ Map over tags and categories to extract only the IDs (string[])
        setTags(post.tags?.map((tag: any) => tag._id || tag) || []);
        setCategories(post.categories?.map((cat: any) => cat._id || cat) || []);
        setCoverUrl(post.image || '');
        setStatus(post.status || 'published');
        setIsQuickPost(post.isQuickPost || false);
      })
      .catch((err) => {
        console.error('[ERROR] Failed to fetch post:', err);
        toast.error('Failed to load post');
      });
  }, [id]);

  useEffect(() => {
    LANGUAGES.forEach((lang) => {
      editors[lang]?.commands.setContent(translations[lang].content || '');
    });
  }, [translations]);

  const handleTabChange = (lang: Language) => {
    const editor = editors[currentLang];
    if (editor) {
      setTranslations((prev) => ({
        ...prev,
        [currentLang]: {
          ...prev[currentLang],
          content: editor.getHTML(),
        },
      }));
    }
    setCurrentLang(lang);
  };

  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        [field]: value,
      },
    }));
  };

  const handleTags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setTags(selected);
  };

  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setCategories(selected);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadPostImage(file);
      setCoverUrl(res.imageUrl);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!translations.en.title || !translations.en.description || !translations.en.content) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }

    const payload = {
      translations,
      tags,
      categories,
      image: coverUrl,
      isQuickPost,
      status,
    };

    try {
      if (id) {
        await updatePost(id, payload);
        toast.success('Post updated!');
      } else {
        await createPost(payload);
        toast.success('Post created!');
      }
      navigate(`/${activeLang}/admin/posts`);
    } catch (err: any) {
      setError('Failed to submit post');
      toast.error('Failed to submit post');
    }
    setSaving(false);
  };

  return (
    <div className='write-page'>
      <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
      <div className='write-page__tabs'>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`write-page__tab${currentLang === lang ? ' write-page__tab--active' : ''}`}
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
          value={translations[currentLang].title}
          onChange={(e) => handleInput('title', e.target.value)}
          required={currentLang === 'en'}
          className='write-page__input'
        />
        <textarea
          placeholder='Description'
          value={translations[currentLang].description}
          onChange={(e) => handleInput('description', e.target.value)}
          className='write-page__textarea'
        />
        {editors[currentLang] && (
          <div className='write-page__editor-block'>
            <div className='write-page__toolbar-sticky'>
              <Toolbar editor={editors[currentLang]!} onPublish={() => undefined} />
            </div>
            <div className='write-page__editor-content'>
              <EditorWrapper editor={editors[currentLang]!} />
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
              await handleImageUpload(file);
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
          <select multiple value={tags} onChange={handleTags} className='write-page__select'>
            {availableTags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.translations?.en?.name || '[no name]'}
              </option>
            ))}
          </select>
        </label>
        <label className='write-page__label'>
          Categories:
          <select
            multiple
            value={categories}
            onChange={handleCategories}
            className='write-page__select'>
            {availableCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.translation?.name || '[no name]'}
              </option>
            ))}
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
        <label className='write-page__label'>
          <input
            type='checkbox'
            checked={isQuickPost}
            onChange={(e) => setIsQuickPost(e.target.checked)}
          />{' '}
          This is a QuickPost (Tech Short)
        </label>
        <button type='submit' className='write-page__btn' disabled={saving}>
          {saving ? 'Publishing...' : id ? 'Update Post' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
