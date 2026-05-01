// /src/features/admin/components/projects/AdminProjectCreateModal.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/AdminProjectCreateModal.scss';

type ProjectType = 'frontend-ui' | 'ux-figma' | 'full' | 'automation';

export interface CreateProjectPayload {
  title: string;
  slug: string;
  type: ProjectType;
  tags: string[];
  // NOVO: permite enviar a capa escolhida manualmente
  coverUrl?: string; // será normalizado para coverImage no service
  links?: {
    github?: string;
    figma?: string;
    live?: string;
    blog?: string;
  };
  meta?: {
    github?: { repo?: string };
    figma?: { fileKey?: string };
  };
  isPublic?: boolean;
}

/**
 * AdminProjectCreateModal
 * - Modal de criação com campo dedicado para "Cover image URL".
 * - Se a capa for preenchida, sobrepõe qualquer fallback (GitHub OG / Figma).
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateProjectPayload) => Promise<void> | void;
}

const AdminProjectCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [type, setType] = useState<ProjectType>('frontend-ui');
  const [tagsInput, setTagsInput] = useState<string>('');

  const [coverUrl, setCoverUrl] = useState<string>(''); // NOVO

  const [githubUrl, setGithubUrl] = useState<string>('');
  const [githubRepo, setGithubRepo] = useState<string>('');
  const [figmaUrl, setFigmaUrl] = useState<string>('');
  const [figmaKey, setFigmaKey] = useState<string>('');
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [blogUrl, setBlogUrl] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ title?: boolean; type?: boolean; slug?: boolean }>({});

  // Basic local slugify to avoid external deps.
  const slugFromTitle = useMemo(() => {
    const s = (title || '')
      .toLowerCase()
      .trim()
      .replace(/['".,()[\]{}]/g, '')
      .replace(/\s+|\/|\\|_+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return s;
  }, [title]);

  // If slug is empty keep in sync with title.
  useEffect(() => {
    setSlug((prev) => (prev ? prev : slugFromTitle));
  }, [slugFromTitle]);

  if (!isOpen) return null;

  const tags = (tagsInput || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const errors = {
    title: touched.title && !title ? 'Title is required' : '',
    type: touched.type && !type ? 'Type is required' : '',
    slug: touched.slug && !slug ? 'Slug is required' : '',
  };

  const hasErrors = Boolean(errors.title || errors.type || errors.slug);

  function resetForm() {
    setTitle('');
    setSlug('');
    setType('frontend-ui');
    setTagsInput('');
    setCoverUrl(''); // NOVO
    setGithubUrl('');
    setGithubRepo('');
    setFigmaUrl('');
    setFigmaKey('');
    setLiveUrl('');
    setBlogUrl('');
    setIsPublic(true);
    setSubmitting(false);
    setTouched({});
  }

  async function handleCreate() {
    setTouched({ title: true, type: true, slug: true });
    if (!title || !type || !slug) return;

    const payload: CreateProjectPayload = {
      title,
      slug,
      type,
      tags,
      isPublic,
      // se preenchido, este URL será usado como cover e sobrepõe fallback
      coverUrl: coverUrl || undefined, // NOVO
      links: {
        github: githubUrl || undefined,
        figma: figmaUrl || undefined,
        live: liveUrl || undefined,
        blog: blogUrl || undefined,
      },
      meta: {
        github: { repo: githubRepo || undefined },
        figma: { fileKey: figmaKey || undefined },
      },
    };

    try {
      setSubmitting(true);
      await onCreate(payload);
      resetForm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  // pré-visualização simples da capa
  const canPreviewCover = coverUrl && /^https?:\/\//i.test(coverUrl);

  return (
    <div className='adminProjectCreate' aria-hidden={!isOpen}>
      <div className='adminProjectCreate__overlay' onClick={onClose} aria-hidden />
      <div
        className='adminProjectCreate__modal'
        role='dialog'
        aria-modal='true'
        aria-label='Create Project'>
        <h3 className='adminProjectCreate__title'>New Project</h3>

        <div className='adminProjectCreate__grid'>
          {/* Title */}
          <label className='adminProjectCreate__label'>
            Title
            <input
              className='adminProjectCreate__input'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder='My awesome project'
              required
            />
            {errors.title && <span className='adminProjectCreate__error'>{errors.title}</span>}
          </label>

          {/* Slug */}
          <label className='adminProjectCreate__label'>
            Slug
            <input
              className='adminProjectCreate__input'
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              onBlur={() => setTouched((t) => ({ ...t, slug: true }))}
              placeholder='my-awesome-project'
              required
            />
            {errors.slug && <span className='adminProjectCreate__error'>{errors.slug}</span>}
          </label>

          {/* Type */}
          <label className='adminProjectCreate__label'>
            Type
            <select
              className='adminProjectCreate__select'
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              onBlur={() => setTouched((t) => ({ ...t, type: true }))}
              required>
              <option value='frontend-ui'>Frontend UI</option>
              <option value='ux-figma'>UX · Figma</option>
              <option value='full'>Full</option>
              <option value='automation'>Automation</option>
            </select>
            {errors.type && <span className='adminProjectCreate__error'>{errors.type}</span>}
          </label>

          {/* Tags */}
          <label className='adminProjectCreate__label'>
            Tags (comma-separated)
            <input
              className='adminProjectCreate__input'
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder='react, typescript, figma'
            />
          </label>

          {/* GitHub URL */}
          <label className='adminProjectCreate__label'>
            GitHub URL
            <input
              className='adminProjectCreate__input'
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder='https://github.com/owner/repo'
              inputMode='url'
            />
          </label>

          {/* GitHub repo (owner/name) */}
          <label className='adminProjectCreate__label'>
            GitHub repo (owner/name)
            <input
              className='adminProjectCreate__input'
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder='owner/repo'
            />
          </label>

          {/* Figma public URL */}
          <label className='adminProjectCreate__label'>
            Figma public URL
            <input
              className='adminProjectCreate__input'
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              placeholder='https://www.figma.com/file/FILEKEY/Name'
              inputMode='url'
            />
          </label>

          {/* Figma file key */}
          <label className='adminProjectCreate__label'>
            Figma file key
            <input
              className='adminProjectCreate__input'
              value={figmaKey}
              onChange={(e) => setFigmaKey(e.target.value)}
              placeholder='FILEKEY'
            />
          </label>

          {/* Live URL */}
          <label className='adminProjectCreate__label'>
            Live URL
            <input
              className='adminProjectCreate__input'
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder='https://example.com'
              inputMode='url'
            />
          </label>

          {/* Blog URL */}
          <label className='adminProjectCreate__label'>
            Blog URL
            <input
              className='adminProjectCreate__input'
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
              placeholder='https://thehumantechblog.com/en/posts/some-article'
              inputMode='url'
            />
          </label>

          {/* Cover image URL — NOVO */}
          <label className='adminProjectCreate__label'>
            Cover image URL (overrides GitHub/Figma)
            <input
              className='adminProjectCreate__input'
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder='https://... (Cloudinary, site próprio, etc.)'
              inputMode='url'
            />
            <small className='adminProjectCreate__hint'>
              Se preencheres, esta imagem será usada como capa e substituirá a imagem automática do
              GitHub/Figma. (Será otimizada no backend via Cloudinary fetch, se configurado.)
            </small>
          </label>

          {/* Public */}
          <label className='adminProjectCreate__check'>
            <input
              type='checkbox'
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Public</span>
          </label>
        </div>

        <div className='adminProjectCreate__actions'>
          <button
            className='adminProjectCreate__btn adminProjectCreate__btn--secondary'
            onClick={onClose}
            disabled={submitting}>
            Cancel
          </button>
          <button
            className='adminProjectCreate__btn adminProjectCreate__btn--primary'
            onClick={handleCreate}
            aria-busy={submitting}
            disabled={submitting || hasErrors}>
            {submitting ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectCreateModal;
