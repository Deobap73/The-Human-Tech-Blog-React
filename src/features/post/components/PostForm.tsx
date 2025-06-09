// src/features/post/components/PostForm.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import { Post, PostTranslations, PostTranslation } from '../../../shared/types/Post';

interface Props {
  initialPost?: Partial<Post>;
  onSubmit?: (data: Partial<Post>) => void;
}

const EMPTY_TRANSLATION: PostTranslation = { title: '', description: '', content: '' };

const LANGS = ['en', 'pt', 'de', 'es'] as const;

const DEFAULT_TRANSLATIONS: PostTranslations = LANGS.reduce((acc, lang) => {
  acc[lang] = { ...EMPTY_TRANSLATION };
  return acc;
}, {} as PostTranslations);

const normalizeStatus = (status?: string): 'draft' | 'published' =>
  status === 'published' ? 'published' : 'draft';

const normalizeTranslations = (input?: Partial<PostTranslations>): PostTranslations => {
  const result: PostTranslations = { ...DEFAULT_TRANSLATIONS };
  LANGS.forEach((lang) => {
    result[lang] = {
      title: input?.[lang]?.title ?? '',
      description: input?.[lang]?.description ?? '',
      content: input?.[lang]?.content ?? '',
    };
  });
  // Mantém outros idiomas extras caso existam (ex: "fr", etc)
  Object.keys(input || {}).forEach((lang) => {
    if (!LANGS.includes(lang as any)) {
      result[lang] = {
        title: input?.[lang as keyof typeof input]?.title ?? '',
        description: input?.[lang as keyof typeof input]?.description ?? '',
        content: input?.[lang as keyof typeof input]?.content ?? '',
      };
    }
  });
  return result;
};

const PostForm = ({ initialPost, onSubmit }: Props) => {
  const [translations, setTranslations] = useState<PostTranslations>(
    normalizeTranslations(initialPost?.translations)
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [categories, setCategories] = useState<string[]>(initialPost?.categories || []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>(normalizeStatus(initialPost?.status));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => setError('Failed to load tags'));
    fetchCategories()
      .then(setAvailableCategories)
      .catch(() => setError('Failed to load categories'));
  }, []);

  // Multilíngue input handler, garantido sempre "full translation"
  const handleTranslationChange = (lang: string, field: keyof PostTranslation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...((prev[lang] as PostTranslation) || EMPTY_TRANSLATION),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { translations, tags, categories, status };
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await api.post('/posts', data);
        navigate('/admin/posts');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save post');
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setTags(selected);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setCategories(selected);
  };

  function getTagName(tag: Tag, lang: string = 'en'): string {
    return tag.translations?.[lang]?.name || Object.values(tag.translations)[0]?.name || tag.slug;
  }

  return (
    <form onSubmit={handleSubmit} className='post-form'>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Tabs para cada idioma */}
      {LANGS.map((lang) => (
        <fieldset key={lang} style={{ border: '1px solid #eee', marginBottom: 16 }}>
          <legend style={{ padding: '0 6px' }}>{lang.toUpperCase()}</legend>
          <input
            type='text'
            placeholder={`Title (${lang})`}
            value={translations[lang]?.title || ''}
            required={lang === 'en'}
            onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
          />
          <textarea
            placeholder={`Description (${lang})`}
            value={translations[lang]?.description || ''}
            required={lang === 'en'}
            onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
          />
          <textarea
            placeholder={`Content (${lang})`}
            value={translations[lang]?.content || ''}
            required={lang === 'en'}
            onChange={(e) => handleTranslationChange(lang, 'content', e.target.value)}
          />
        </fieldset>
      ))}

      <label>
        Tags:
        <select multiple value={tags} onChange={handleTagChange}>
          {availableTags.map((tag) => (
            <option value={tag._id} key={tag._id}>
              {getTagName(tag)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Categories:
        <select multiple value={categories} onChange={handleCategoryChange}>
          {availableCategories.map((cat) => {
            console.log('CAT:', cat);
            const lang = 'en';
            const catTranslation = cat.translations?.[lang] ||
              Object.values(cat.translations || {}).find(Boolean) || {
                name: cat.slug,
                description: '',
              };
            return (
              <option value={cat._id} key={cat._id}>
                {catTranslation.name ?? ''}
              </option>
            );
          })}
        </select>
      </label>
      <label>
        Status:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value === 'published' ? 'published' : 'draft')}>
          <option value='draft'>Draft</option>
          <option value='published'>Published</option>
        </select>
      </label>
      <button type='submit'>Save</button>
    </form>
  );
};

export default PostForm;
