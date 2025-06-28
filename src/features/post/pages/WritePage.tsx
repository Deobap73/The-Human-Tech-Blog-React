// /src/pages/WritePage.tsx

import { useEffect, useRef, useState } from 'react';
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
import { createDraft, updateDraft, getDraftById } from '../../../shared/services/draftService';
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
  const { id, lang } = useParams<{ id?: string; lang?: string }>();
  const navigate = useNavigate();
  const activeLang: Language = (lang as Language) || 'en';

  const [currentLang, setCurrentLang] = useState<Language>(activeLang);
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [status, setStatus] = useState<PostStatus>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [isQuickPost, setIsQuickPost] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(id || null);
  const lastDraftRef = useRef<any>(null);

  const editors = LANGUAGES.reduce((acc, lang) => {
    acc[lang] = useEditor({
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
    if (!draftId) return;
    getDraftById(draftId)
      .then((draft) => {
        setTranslations({
          en: {
            title: draft.title || '',
            description: draft.description || '',
            content: draft.content || '',
          },
          pt: draft.translations?.pt || { title: '', description: '', content: '' },
          de: draft.translations?.de || { title: '', description: '', content: '' },
          es: draft.translations?.es || { title: '', description: '', content: '' },
        });
        setTags(draft.tags || []);
        setCategories(
          (draft.categories || []).map((cat: any) => (typeof cat === 'string' ? cat : cat._id))
        );
        setCoverUrl(draft.image || '');
        setStatus(draft.status || 'draft');
        setIsQuickPost(draft.isQuickPost || false);
        lastDraftRef.current = draft;
      })
      .catch(() => toast.error('Failed to load draft'));
  }, [draftId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!translations.en.title || !translations.en.description || !translations.en.content) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }

    try {
      let currentDraftId = draftId;
      if (!currentDraftId) {
        const draftData = {
          title: translations.en.title,
          description: translations.en.description,
          content: translations.en.content,
          tags,
          categories,
          image: coverUrl,
          isQuickPost,
        };
        const response = await createDraft(draftData);
        currentDraftId = response._id;
        setDraftId(currentDraftId);
      }

      const resToken = await api.get('/auth/csrf', { withCredentials: true });
      const csrfToken = resToken.data.csrfToken;
      await api.post(
        `/drafts/${currentDraftId}/publish`,
        {},
        {
          headers: { 'x-csrf-token': csrfToken },
          withCredentials: true,
        }
      );
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
      <h2>{draftId ? 'Edit Draft' : 'Create Draft'}</h2>
      {/* Auto-save status */}
      <div className='write-page__autosave'>
        {autoSaveState === 'saving' && <span>Saving draft...</span>}
        {autoSaveState === 'saved' && lastAutoSave && (
          <span>
            Draft saved at{' '}
            {lastAutoSave.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        )}
        {autoSaveState === 'error' && <span style={{ color: 'red' }}>Auto-save error!</span>}
      </div>
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
          onChange={(e) => {
            handleInput('description', e.target.value);
            autoResize(e);
          }}
          className='write-page__textarea'
          ref={(el) => {
            if (el) autoResize({ target: el } as any);
          }}
          rows={2}
        />
        {/* Editor Block with Sticky Toolbar */}
        {editors[currentLang] && (
          <div className='write-page__editor-block'>
            <div className='write-page__toolbar-sticky'>
              <Toolbar editor={editors[currentLang]!} onPublish={() => undefined} />
            </div>
            <div className='write-page__editor-content'>
              <EditorContent editor={editors[currentLang]!} />
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
        <label className='write-page__label' style={{ marginTop: 16 }}>
          Tags:
          <select multiple value={tags} onChange={handleTags} className='write-page__select'>
            {availableTags && availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.translations && tag.translations.en && tag.translations.en.name
                    ? tag.translations.en.name
                    : '[no name]'}
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
        <label className='write-page__label'>
          <input
            type='checkbox'
            checked={isQuickPost}
            onChange={(e) => setIsQuickPost(e.target.checked)}
          />{' '}
          This is a QuickPost (Tech Short)
        </label>
        <button type='submit' className='write-page__btn' disabled={saving}>
          {saving ? 'Publishing...' : draftId ? 'Publish' : 'Create Draft'}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
