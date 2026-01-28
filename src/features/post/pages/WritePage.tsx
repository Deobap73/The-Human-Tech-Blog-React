// ./src/features/post/pages/WritePage.tsx
'use strict';

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
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

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
  uploadPostInstagramImage,
} from '../../../shared/services/postService';
import type { Tag } from '../../../shared/types/Tag';
import type { Category } from '../../../shared/types/Category';
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

type TranslationShape = { title: string; description: string; content: string };

const emptyTranslations: Record<Language, TranslationShape> = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function looksLikeTiptapJsonString(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const s = value.trim();
  if (!s.startsWith('{') || !s.endsWith('}')) return false;
  try {
    const parsed = JSON.parse(s);
    return isPlainObject(parsed) && parsed.type === 'doc' && Array.isArray(parsed.content);
  } catch {
    return false;
  }
}

function parseTiptapJsonString(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value);
    if (isPlainObject(parsed) && parsed.type === 'doc' && Array.isArray(parsed.content)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function toEditorContent(value: unknown): string | Record<string, unknown> {
  if (looksLikeTiptapJsonString(value)) {
    const parsed = parseTiptapJsonString(String(value));
    if (parsed) return parsed;
  }
  return typeof value === 'string' ? value : '';
}

function editorToStoredContent(editor: any): string {
  try {
    const json = editor.getJSON();
    return JSON.stringify(json);
  } catch {
    return '';
  }
}

function toIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item: any) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && typeof item._id === 'string') return item._id;
      return '';
    })
    .filter((v: string) => Boolean(v));
}

function getValidTranslationsForUpdate(
  current: Record<Language, TranslationShape>,
  original: Record<Language, TranslationShape>,
): { en: TranslationShape } & Partial<Record<Language, TranslationShape>> {
  const result: Record<string, unknown> = {};
  result.en = current.en;

  for (const lng of LANGUAGES) {
    if (lng === 'en') continue;

    const cur = current[lng];
    const hadOriginal =
      Boolean(original[lng]?.title) ||
      Boolean(original[lng]?.description) ||
      Boolean(original[lng]?.content);

    if (cur.title.trim() || cur.description.trim() || cur.content.trim()) {
      (result as any)[lng] = cur;
      continue;
    }

    if (hadOriginal) {
      (result as any)[lng] = original[lng];
    }
  }

  return result as { en: TranslationShape } & Partial<Record<Language, TranslationShape>>;
}

const WritePage = () => {
  const { id, lang } = useParams<{ id?: string; lang?: string }>();
  const navigate = useNavigate();
  const activeLang: Language = (lang as Language) || 'en';

  const [currentLang, setCurrentLang] = useState<Language>(activeLang);
  const [translations, setTranslations] = useState<Record<Language, TranslationShape>>({
    ...emptyTranslations,
  });
  const [originalTranslations, setOriginalTranslations] = useState<
    Record<Language, TranslationShape>
  >({
    ...emptyTranslations,
  });

  const [status, setStatus] = useState<PostStatus>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>('');

  const [instagramImage, setInstagramImage] = useState<string>(''); // APENAS STRING

  const [isQuickPost, setIsQuickPost] = useState<boolean>(false);
  const [isAiPrompt, setIsAiPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const extensions = [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    Image,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    TextStyle,
    Color,
    CustomCodeBlock,
    LinkExtension.configure({
      openOnClick: false,
      autolink: true,
      protocols: ['http', 'https', 'mailto'],
      HTMLAttributes: { class: 'thtb-link' },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: 'thtb-table' },
    }),
    TableRow.configure({ HTMLAttributes: { class: 'thtb-table__row' } }),
    TableHeader.configure({ HTMLAttributes: { class: 'thtb-table__header' } }),
    TableCell.configure({ HTMLAttributes: { class: 'thtb-table__cell' } }),
  ];

  const editors = LANGUAGES.reduce(
    (acc, lng) => {
      acc[lng] = useEditor({
        extensions,
        content: toEditorContent(translations[lng].content),
      });
      return acc;
    },
    {} as Record<Language, ReturnType<typeof useEditor>>,
  );

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

    fetchPost(id)
      .then((post: any) => {
        const nextTranslations: Record<Language, TranslationShape> = {
          en: post.translations?.en ?? emptyTranslations.en,
          pt: post.translations?.pt ?? emptyTranslations.pt,
          de: post.translations?.de ?? emptyTranslations.de,
          es: post.translations?.es ?? emptyTranslations.es,
        };

        setTranslations(nextTranslations);
        setOriginalTranslations(nextTranslations);

        setTags(toIdArray(post.tags));
        setCategories(toIdArray(post.categories));

        setCoverUrl(post.image || '');
        setStatus(post.status);
        setIsQuickPost(Boolean(post.isQuickPost));
        setIsAiPrompt(Boolean(post.isAiPrompt));

        // InstagramImage agora é apenas string
        setInstagramImage(typeof post.instagramImage === 'string' ? post.instagramImage : '');
      })
      .catch(() => toast.error('Failed to load post'));
  }, [id]);

  useEffect(() => {
    LANGUAGES.forEach((lng) => {
      const editor = editors[lng];
      if (!editor) return;

      const contentForEditor = toEditorContent(translations[lng].content);
      try {
        editor.commands.setContent(contentForEditor as any);
      } catch {
        editor.commands.setContent('');
      }
    });
  }, [translations]);

  const persistCurrentEditorIntoState = (lng: Language): void => {
    const editor = editors[lng];
    if (!editor) return;

    const stored = editorToStoredContent(editor);

    setTranslations((prev) => ({
      ...prev,
      [lng]: { ...prev[lng], content: stored },
    }));
  };

  const handleTabChange = (lng: Language): void => {
    persistCurrentEditorIntoState(currentLang);
    setCurrentLang(lng);
  };

  const handleInput = (field: 'title' | 'description', value: string): void => {
    setTranslations((prev) => ({
      ...prev,
      [currentLang]: { ...prev[currentLang], [field]: value },
    }));
  };

  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setCategories(Array.from(e.target.selectedOptions).map((o) => o.value));
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    try {
      const categoryId = categories.length > 0 ? categories[0] : undefined;

      const res = await uploadPostImage({
        file,
        isQuickPost,
        isAiPrompt,
        categoryId,
      });

      if (!res.success) {
        toast.error('Failed to upload image');
        return;
      }

      setCoverUrl(res.imageUrl);
      toast.success(`Image uploaded: ${res.displayName}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    }
  };

  const handleInstagramImageUpload = async (file: File): Promise<void> => {
    try {
      const res = await uploadPostInstagramImage({
        file,
        postId: id,
        slug: id
          ? undefined
          : translations.en.title.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 60),
      });

      if (!res.success) {
        toast.error('Failed to upload Instagram image');
        return;
      }

      setInstagramImage(res.imageUrl);
      toast.success('Instagram image uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload Instagram image');
    }
  };

  const clearInstagramImage = (): void => {
    setInstagramImage('');
    toast.success('Instagram image removed');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setError('');

    persistCurrentEditorIntoState(currentLang);

    const en = translations.en;

    if (!en.title.trim() || !en.description.trim() || !en.content.trim()) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }

    const cleanTranslations = getValidTranslationsForUpdate(translations, originalTranslations);

    const payload: any = {
      translations: cleanTranslations,
      tags,
      categories,
      image: coverUrl,
      instagramImage: instagramImage || undefined, // APENAS STRING
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

          <div className='write-page__upload-group'>
            <label className='write-page__upload-btn' htmlFor='cover-upload'>
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
          </div>

          <div className='write-page__instagram'>
            <div className='write-page__instagram-head'>
              <div className='write-page__instagram-title'>Instagram image (URL only)</div>
              <div className='write-page__instagram-hint'>
                Optional. Just the URL string. Stored in database for automation.
              </div>
            </div>

            <div className='write-page__instagram-actions'>
              <label className='write-page__upload-btn' htmlFor='instagram-upload'>
                Upload Instagram image
              </label>
              <input
                id='instagram-upload'
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file) {
                    await handleInstagramImageUpload(file);
                  }
                }}
              />

              <button
                type='button'
                className='write-page__instagram-remove'
                onClick={clearInstagramImage}
                disabled={!instagramImage}>
                Remove Instagram image
              </button>
            </div>

            {instagramImage && (
              <div className='write-page__instagram-preview'>
                <img
                  src={instagramImage}
                  alt='Instagram Preview'
                  className='write-page__instagram-img'
                  loading='lazy'
                />
                <div className='write-page__instagram-url'>
                  <small>{instagramImage}</small>
                </div>
              </div>
            )}
          </div>

          <TagSelector selectedTags={tags} setSelectedTags={setTags} />

          <label className='write-page__label'>
            Categories:
            <select
              multiple
              value={categories}
              onChange={handleCategories}
              className='write-page__select'>
              {availableCategories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.translations?.en?.name || cat.translation?.name || '[no name]'}
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
              <option value='archived'>Archived</option>
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
