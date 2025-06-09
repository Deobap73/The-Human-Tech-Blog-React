// The-Human-Tech-Blog-React/src/features/post/pages/WritePage.tsx

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
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import '../../../features/post/styles/WritePage.scss';
import { toast } from 'react-hot-toast';

// Multilíngue — definição dos idiomas suportados
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

const WritePage = () => {
  const { user } = useAuth();
  const { id } = useParams(); // Se editar, tem id
  const navigate = useNavigate();

  // Estado multilíngue
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [translations, setTranslations] = useState({ ...emptyTranslations });
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Editor — um por idioma (usando tiptap)
  const editors = LANGUAGES.reduce((acc, lang) => {
    acc[lang] = useEditor({
      extensions: [StarterKit, Underline, Image],
      content: translations[lang].content,
    });
    return acc;
  }, {} as Record<Language, ReturnType<typeof useEditor>>);

  // Fetch tags/categorias ao montar
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => toast.error('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // Carrega post existente (modo editar)
  useEffect(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then((res) => {
        const post = res.data;
        setStatus(post.status || 'draft');
        setTranslations({
          en: post.translations.en || { title: '', description: '', content: '' },
          pt: post.translations.pt || { title: '', description: '', content: '' },
          de: post.translations.de || { title: '', description: '', content: '' },
          es: post.translations.es || { title: '', description: '', content: '' },
        });
        setTags(post.tags || []);
        setCategories(post.categories.map((cat: any) => cat._id) || []);
        setCoverUrl(post.image || '');
        // Set editor content por idioma
        LANGUAGES.forEach((lang) => {
          editors[lang]?.commands.setContent(post.translations[lang]?.content || '');
        });
      })
      .catch(() => toast.error('Failed to load post'));
    // eslint-disable-next-line
  }, [id]);

  // Atualiza state do editor ao mudar de idioma
  useEffect(() => {
    LANGUAGES.forEach((lang) => {
      editors[lang]?.commands.setContent(translations[lang].content || '');
    });
    // eslint-disable-next-line
  }, [translations]);

  // Handler das tabs
  const handleTabChange = (lang: Language) => {
    // Salva conteúdo do editor corrente antes de trocar
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

  // Handler campos de input multilíngue
  const handleInput = (field: 'title' | 'description', value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value,
      },
    }));
  };

  // Handler tags/categorias
  const handleTags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTags(Array.from(e.target.selectedOptions).map((o) => o.value));
  };
  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategories(Array.from(e.target.selectedOptions).map((o) => o.value));
  };

  // Upload de imagem (único)
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/posts/upload', formData);
    setCoverUrl(res.data.imageUrl);
    toast.success('Image uploaded!');
  };

  // Submeter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Salva o conteúdo do editor atual antes de submeter
      if (editors[activeLang]) {
        setTranslations((prev) => ({
          ...prev,
          [activeLang]: {
            ...prev[activeLang],
            content: editors[activeLang]?.getHTML() || '',
          },
        }));
      }

      // EN obrigatório
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
        status,
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
                {cat.translations?.en?.name || '[no name]'}
              </option>
            ))}
          </select>
        </label>
        <label className='write-page__label'>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
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
