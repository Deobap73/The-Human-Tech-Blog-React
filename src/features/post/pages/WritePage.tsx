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

// Supported languages for the blog
const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Language = (typeof LANGUAGES)[number];

// Default translations structure
const emptyTranslations = {
  en: { title: '', description: '', content: '' },
  pt: { title: '', description: '', content: '' },
  de: { title: '', description: '', content: '' },
  es: { title: '', description: '', content: '' },
};

type PostStatus = 'draft' | 'published' | 'archived';

const WritePage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [draftId, setDraftId] = useState<string | null>(id || null);

  // Track last draft saved data for comparison (to prevent redundant saves)
  const lastDraftRef = useRef<any>(null);

  // Editor instance for each language
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

  // Fetch tags and categories on mount
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // Load draft for editing if id is present
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
        setStatus('draft');
        lastDraftRef.current = {
          translations: draft.translations || {},
          tags: draft.tags || [],
          categories: (draft.categories || []).map((cat: any) =>
            typeof cat === 'string' ? cat : cat._id
          ),
          image: draft.image || '',
          status: 'draft',
        };
      })
      .catch(() => toast.error('Failed to load draft'));
    // eslint-disable-next-line
  }, [draftId]);

  // Sync editors' content with translations state
  useEffect(() => {
    LANGUAGES.forEach((lang) => {
      editors[lang]?.commands.setContent(translations[lang].content || '');
    });
    // eslint-disable-next-line
  }, [translations]);

  // Handle language tab switch (persist editor content)
  const handleTabChange = (lang: Language) => {
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

  // Input handler for multilingual fields (title, description)
  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value,
      },
    }));
  };

  // Tag selection handler (only valid IDs)
  const handleTags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions)
      .map((o) => o.value)
      .filter((id) => availableTags.some((t) => t._id === id));
    setTags(selected);
  };
  // Category selection handler (only valid IDs)
  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions)
      .map((o) => o.value)
      .filter((id) => availableCategories.some((c) => c._id === id));
    setCategories(selected);
  };

  // Image upload handler (refresh CSRF before uploading)
  const handleImageUpload = async (file: File) => {
    try {
      // Get CSRF token (if your backend requires it)
      const resToken = await api.get('/auth/csrf', { withCredentials: true });
      const csrfToken = resToken.data.csrfToken;
      const formData = new FormData();
      formData.append('image', file);

      // Get JWT from storage/context
      const jwt = localStorage.getItem('jwt') || (document.cookie.match(/jwt=([^;]+)/) || [])[1];

      const headers: any = {
        'x-csrf-token': csrfToken,
      };
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }

      const res = await api.post('/posts/upload', formData, {
        headers,
        withCredentials: true,
      });

      setCoverUrl(res.data.imageUrl);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error('Failed to upload image: ' + (err?.response?.data?.message || err.message));
    }
  };

  // ============ AUTO-SAVE LOGIC ==============
  // Compare objects shallowly (prevent redundant saves)
  const isDraftChanged = (prev: any, next: any) => {
    return JSON.stringify(prev) !== JSON.stringify(next);
  };

  // Prevent auto-save with empty required fields
  const isDraftValid = (draft: any) => {
    return (
      draft.title &&
      draft.title.trim() !== '' &&
      draft.description &&
      draft.description.trim() !== '' &&
      draft.content &&
      draft.content.trim() !== ''
    );
  };

  // Auto-save every 60s (only if changed AND valid)
  useEffect(() => {
    const interval = setInterval(() => {
      // Build current draft data
      const draftData = {
        title: translations.en.title,
        description: translations.en.description,
        content: translations.en.content,
        tags,
        categories,
        image: coverUrl,
      };
      // Only save if changed AND valid (required fields present)
      if (isDraftChanged(lastDraftRef.current, draftData) && isDraftValid(draftData)) {
        handleAutoSave(draftData);
      }
    }, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [translations, tags, categories, coverUrl]);

  // Save draft function (POST or PATCH)
  const handleAutoSave = async (draftData: any) => {
    setAutoSaveState('saving');
    try {
      let response;
      if (!draftId) {
        response = await createDraft(draftData);
        setDraftId(response._id);
        toast.success('Draft created (auto-save)');
      } else {
        response = await updateDraft(draftId, draftData);
        toast.success('Draft updated (auto-save)');
      }
      setAutoSaveState('saved');
      setLastAutoSave(new Date());
      lastDraftRef.current = draftData;
    } catch (err) {
      setAutoSaveState('error');
    }
    setTimeout(() => setAutoSaveState('idle'), 4000);
  };
  // ============ END AUTO-SAVE LOGIC ==============

  // Submit post handler (manual publish)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Validate English fields before publish
    if (!translations.en.title || !translations.en.description || !translations.en.content) {
      setError('Title, Description, and Content (EN) are required!');
      setSaving(false);
      return;
    }
    try {
      const resToken = await api.get('/auth/csrf', { withCredentials: true });
      const csrfToken = resToken.data.csrfToken;
      // Example: PATCH /drafts/:id/publish
      const res = await api.post(
        `/drafts/${draftId}/publish`,
        {},
        {
          headers: { 'x-csrf-token': csrfToken },
          withCredentials: true,
        }
      );
      toast.success('Post published!');
      navigate('/admin/posts');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to publish post');
      toast.error(err?.response?.data?.message || 'Failed to publish post');
    }
    setSaving(false);
  };

  // Auto-resize textarea for description
  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement> | { target: HTMLTextAreaElement }) {
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }

  // ============= UI Render ==============
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
        {/* ====== Editor Block with Sticky Toolbar ====== */}
        {editors[activeLang] && (
          <div className='write-page__editor-block'>
            <div className='write-page__toolbar-sticky'>
              <Toolbar editor={editors[activeLang]!} onPublish={() => undefined} />
            </div>
            <div className='write-page__editor-content'>
              <EditorContent editor={editors[activeLang]!} />
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
        <button type='submit' className='write-page__btn' disabled={saving}>
          {saving ? 'Publishing...' : draftId ? 'Publish' : 'Create Draft'}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
