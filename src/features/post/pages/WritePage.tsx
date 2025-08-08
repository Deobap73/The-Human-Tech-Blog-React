// Path: /src/features/post/pages/WritePage.tsx
import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

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
import '../styles/EditorTables.scss';
import EditorWrapper from '../components/EditorWrapper';
import ScrollToTop from '../../../shared/components/ScrollToTop';
import TagSelector from '../components/TagSelector';

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
 * Gather only non-empty translations beyond EN, preserving originals.
 * Ensures strict typing for the payload.
 */
function getValidTranslationsForUpdate(
  current: typeof emptyTranslations,
  original: typeof emptyTranslations
): { en: { title: string; description: string; content: string } } & Partial<
  typeof emptyTranslations
> {
  const result: Record<string, unknown> = {};
  result.en = current.en;

  for (const lng of LANGUAGES) {
    if (lng === 'en') continue;
    const cur = current[lng];
    if (cur.title.trim() || cur.content.trim() || cur.description.trim()) {
      (result as any)[lng] = cur;
    } else if (
      original[lng] &&
      (original[lng].title || original[lng].content || original[lng].description)
    ) {
      (result as any)[lng] = original[lng];
    }
  }
  return result as any;
}

const WritePage = () => {
  const { id, lang } = useParams<{ id?: string; lang?: string }>();
  const navigate = useNavigate();
  const activeLang: Language = (lang as Language) || 'en';

  const [currentLang, setCurrentLang] = useState<Language>(activeLang);
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [originalTranslations, setOriginalTranslations] = useState({ ...emptyTranslations });
  const [status, setStatus] = useState<PostStatus>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [isQuickPost, setIsQuickPost] = useState<boolean>(false);
  const [isAiPrompt, setIsAiPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [postLoaded, setPostLoaded] = useState<boolean>(false);

  // Initialize Tiptap editors for each language
  const editors = LANGUAGES.reduce((acc, lng) => {
    acc[lng] = useEditor({
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
        LinkExtension.configure({
          openOnClick: false,
          autolink: true,
          protocols: ['http', 'https', 'mailto'],
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: { class: 'thtb-table' },
        }),
        TableRow.configure({
          HTMLAttributes: { class: 'thtb-table__row' },
        }),
        TableHeader.configure({
          HTMLAttributes: { class: 'thtb-table__header' },
        }),
        TableCell.configure({
          HTMLAttributes: { class: 'thtb-table__cell' },
        }),
      ],
      content: translations[lng].content,
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

  // Load existing post if editing
  useEffect(() => {
    if (!id) return;
    fetchPost(id)
      .then((post) => {
        setTranslations({
          en: post.translations.en,
          pt: post.translations.pt || emptyTranslations.pt,
          de: post.translations.de || emptyTranslations.de,
          es: post.translations.es || emptyTranslations.es,
        });
        setOriginalTranslations({
          en: post.translations.en,
          pt: post.translations.pt || emptyTranslations.pt,
          de: post.translations.de || emptyTranslations.de,
          es: post.translations.es || emptyTranslations.es,
        });
        setTags(post.tags || []);
        setCategories(post.categories || []); // prefill selection
        setCoverUrl(post.image || '');
        setStatus(post.status);
        setIsQuickPost(post.isQuickPost || false);
        setIsAiPrompt(post.isAiPrompt || false);
        setPostLoaded(true);
      })
      .catch(() => toast.error('Failed to load post'));
  }, [id]);

  // Sync editor content into translations state
  useEffect(() => {
    LANGUAGES.forEach((lng) => {
      editors[lng]?.commands.setContent(translations[lng].content || '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translations]);

  // Switch language tab and capture current editor HTML
  const handleTabChange = (lng: Language) => {
    const editor = editors[currentLang];
    if (editor) {
      setTranslations((prev) => ({
        ...prev,
        [currentLang]: { ...prev[currentLang], content: editor.getHTML() },
      }));
    }
    setCurrentLang(lng);
  };

  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLang]: { ...prev[currentLang], [field]: value },
    }));
  };

  const handleTags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTags(Array.from(e.target.selectedOptions).map((o) => o.value));
  };

  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategories(Array.from(e.target.selectedOptions).map((o) => o.value));
  };

  // Upload cover image
  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadPostImage(file);
      setCoverUrl(res.imageUrl);
      toast.success('Image uploaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Sync current editor content
    const editor = editors[currentLang];
    let updatedTranslations = translations;
    if (editor) {
      const html = editor.getHTML();
      updatedTranslations = {
        ...translations,
        [currentLang]: { ...translations[currentLang], content: html },
      };
      setTranslations(updatedTranslations);
      await new Promise((r) => setTimeout(r, 10));
    }

    // Validate English fields
    if (
      !updatedTranslations.en.title.trim() ||
      !updatedTranslations.en.description.trim() ||
      !updatedTranslations.en.content.trim()
    ) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }

    // Prepare clean translations
    const cleanTranslations = getValidTranslationsForUpdate(
      updatedTranslations,
      originalTranslations
    );

    const payload = {
      translations: cleanTranslations,
      tags,
      categories,
      image: coverUrl,
      isQuickPost,
      isAiPrompt,
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
    } catch (err) {
      console.error(err);
      setError('Failed to submit post');
      toast.error('Failed to submit post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className='write-page'>
        <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
        <div className='write-page__tabs'>
          {LANGUAGES.map((lng) => (
            <button
              key={lng}
              type='button'
              className={
                'write-page__tab' + (currentLang === lng ? ' write-page__tab--active' : '')
              }
              onClick={() => handleTabChange(lng)}>
              {lng.toUpperCase()}
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

          <label className='write-page__label' htmlFor='cover-upload'>
            Upload cover
          </label>
          <input
            id='cover-upload'
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0] ?? null;
              if (file) {
                setCover(file);
                await handleImageUpload(file);
              }
            }}
          />
          {coverUrl && (
            <div className='write-page__cover-preview'>
              <img
                src={coverUrl}
                alt='Cover Preview'
                className='write-page__cover-img'
                loading='lazy'
              />
            </div>
          )}

          <TagSelector selectedTags={tags} setSelectedTags={setTags} />

          <label className='write-page__label'>
            Categories:
            <select
              multiple
              value={categories}
              onChange={handleCategories}
              className='write-page__select'>
              {availableCategories.map((cat: Category) => (
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

          <label className='write-page__label'>
            <input
              type='checkbox'
              checked={isAiPrompt}
              onChange={(e) => setIsAiPrompt(e.target.checked)}
            />{' '}
            This is an AI Prompt
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
