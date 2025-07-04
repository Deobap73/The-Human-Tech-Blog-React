// src/features/post/pages/WritePage.tsx

import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
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
import ScrollToTop from '../../../shared/components/ScrollToTop';

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Language = (typeof LANGUAGES)[number];
type PostStatus = 'draft' | 'published' | 'archived';

const emptyTranslations = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

/**
 * Utility to guarantee EN translation is always present and valid for TypeScript strict.
 * Returns object with en (required) and other languages (optional, only if filled).
 */
function getValidTranslationsForUpdate(
  current: typeof emptyTranslations,
  original: typeof emptyTranslations
): { en: { title: string; description: string; content: string } } & Partial<
  typeof emptyTranslations
> {
  // EN is always required and validated before calling this function.
  const result: any = {};
  result['en'] = current.en;

  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    const cur = current[lang];
    if (cur.title.trim() || cur.content.trim() || cur.description.trim()) {
      result[lang] = cur;
    } else if (
      original &&
      original[lang] &&
      (original[lang].title || original[lang].content || original[lang].description)
    ) {
      result[lang] = original[lang];
    }
  }
  return result;
}

const WritePage = () => {
  const { id, lang } = useParams<{ id?: string; lang?: string }>();
  const navigate = useNavigate();
  const activeLang: Language = (lang as Language) || 'en';

  const [currentLang, setCurrentLang] = useState<Language>(activeLang);
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [originalTranslations, setOriginalTranslations] = useState({ ...emptyTranslations }); // Track original state
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
  const [postLoaded, setPostLoaded] = useState(false);

  // Editor instances per language
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
        Link,
      ],
      content: translations[lang].content,
    });
    return acc;
  }, {} as Record<Language, ReturnType<typeof useEditor>>);

  // Load tags and categories on mount
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // Load post for editing, save original state
  useEffect(() => {
    if (!id) return;

    fetchPost(id)
      .then((post) => {
        setTranslations({
          en: post.translations?.en || { title: '', description: '', content: '' },
          pt: post.translations?.pt || { title: '', description: '', content: '' },
          de: post.translations?.de || { title: '', description: '', content: '' },
          es: post.translations?.es || { title: '', description: '', content: '' },
        });
        setOriginalTranslations({
          en: post.translations?.en || { title: '', description: '', content: '' },
          pt: post.translations?.pt || { title: '', description: '', content: '' },
          de: post.translations?.de || { title: '', description: '', content: '' },
          es: post.translations?.es || { title: '', description: '', content: '' },
        });

        setTags(post.tags?.map((tag: any) => tag._id || tag) || []);
        setCategories(post.categories?.map((cat: any) => cat._id || cat) || []);
        setCoverUrl(post.image || '');
        setStatus(post.status || 'published');
        setIsQuickPost(post.isQuickPost || false);
        setPostLoaded(true);
      })
      .catch(() => {
        toast.error('Failed to load post');
      });
  }, [id]);

  // Sync editor content with translations
  useEffect(() => {
    LANGUAGES.forEach((lang) => {
      editors[lang]?.commands.setContent(translations[lang].content || '');
    });
    // eslint-disable-next-line
  }, [translations]);

  // Save editor state before tab change
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

  // Input handlers for title/description
  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        [field]: value,
      },
    }));
  };

  // Tag and category selection handlers
  const handleTags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setTags(selected);
  };
  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setCategories(selected);
  };

  // Upload cover image
  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadPostImage(file);
      setCoverUrl(res.imageUrl);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error('Failed to upload image');
    }
  };

  /**
   * Submit handler: syncs editor, validates EN, builds valid translation object
   * with strict types for backend, and never deletes non-empty translations.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // EN is always required for valid post
    if (
      !translations.en.title.trim() ||
      !translations.en.description.trim() ||
      !translations.en.content.trim()
    ) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }

    // Sync current editor tab content before submit
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

    // Wait for React state update
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Only send filled translations, preserve others
    const cleanTranslations = getValidTranslationsForUpdate(translations, originalTranslations);

    const payload = {
      translations: cleanTranslations,
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
      // Redirect to post list in current lang
      navigate(`/${activeLang}/admin/posts`);
    } catch (err: any) {
      setError('Failed to submit post');
      toast.error('Failed to submit post');
    }
    setSaving(false);
  };

  return (
    <>
      <ScrollToTop />
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
            <select
              multiple
              value={postLoaded ? tags : []}
              onChange={handleTags}
              className='write-page__select'>
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
              value={postLoaded ? categories : []}
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
    </>
  );
};

export default WritePage;
