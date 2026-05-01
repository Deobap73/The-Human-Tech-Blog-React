// /src/features/admin/components/projects/AdminProjectEditModal.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import type { Project, ProjectType } from '../../../../shared/types/Project';
import type { UpdateProjectPayloadLoose } from '../../../../shared/services/adminProjectService';
import '../../styles/AdminProjectEditModal.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: (data: UpdateProjectPayloadLoose) => Promise<void> | void;
}

/**
 * AdminProjectEditModal
 * - Full edit form for a Project.
 * - UX aligned with AdminProjectCreateModal (same grid, inputs, buttons).
 */
const AdminProjectEditModal: React.FC<Props> = ({ isOpen, onClose, project, onSave }) => {
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [type, setType] = useState<ProjectType>('frontend-ui');
  const [tagsInput, setTagsInput] = useState<string>('');

  const [excerpt, setExcerpt] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [coverUrl, setCoverUrl] = useState<string>('');

  const [githubUrl, setGithubUrl] = useState<string>('');
  const [githubRepo, setGithubRepo] = useState<string>('');
  const [figmaUrl, setFigmaUrl] = useState<string>('');
  const [figmaKey, setFigmaKey] = useState<string>('');
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [blogUrl, setBlogUrl] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<{
    title?: boolean;
    type?: boolean;
    slug?: boolean;
  }>({});

  // Prefill state when modal opens or project changes
  useEffect(() => {
    if (!isOpen || !project) return;

    setTitle(project.title || '');
    setSlug(project.slug || '');
    setType(project.type || 'frontend-ui');
    setTagsInput((project.tags || []).join(', '));

    setExcerpt(project.excerpt || '');
    setDescription(project.description || '');

    setCoverUrl(project.coverImage || '');

    setGithubUrl(project.links?.github || '');
    setGithubRepo(project.meta?.github?.repo || '');
    setFigmaUrl(project.links?.figma || '');
    setFigmaKey(project.meta?.figma?.fileKey || '');
    setLiveUrl(project.links?.live || '');
    setBlogUrl(project.links?.blog || '');

    setSubmitting(false);
    setTouched({});
  }, [isOpen, project]);

  // Basic local slugify from title (used only if slug empty)
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

  function resetForm(): void {
    setSubmitting(false);
    setTouched({});
  }

  async function handleSave(): Promise<void> {
    setTouched({ title: true, type: true, slug: true });
    if (!title || !type || !slug) return;

    const payload: UpdateProjectPayloadLoose = {
      title,
      slug,
      type,
      tags,
      excerpt,
      description,
      coverUrl: coverUrl || undefined,
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
      await onSave(payload);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='adminProjectEdit' aria-hidden={!isOpen}>
      <div className='adminProjectEdit__overlay' onClick={onClose} aria-hidden />
      <div
        className='adminProjectEdit__modal'
        role='dialog'
        aria-modal='true'
        aria-label='Edit Project'>
        <h3 className='adminProjectEdit__title'>Edit Project</h3>

        <div className='adminProjectEdit__grid'>
          {/* Title */}
          <label className='adminProjectEdit__label'>
            Title
            <input
              className='adminProjectEdit__input'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder='My updated project title'
              required
            />
            {errors.title && <span className='adminProjectEdit__error'>{errors.title}</span>}
          </label>

          {/* Slug */}
          <label className='adminProjectEdit__label'>
            Slug
            <input
              className='adminProjectEdit__input'
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              onBlur={() => setTouched((t) => ({ ...t, slug: true }))}
              placeholder='my-updated-project'
              required
            />
            {errors.slug && <span className='adminProjectEdit__error'>{errors.slug}</span>}
          </label>

          {/* Type */}
          <label className='adminProjectEdit__label'>
            Type
            <select
              className='adminProjectEdit__input adminProjectEdit__select'
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              onBlur={() => setTouched((t) => ({ ...t, type: true }))}
              required>
              <option value='frontend-ui'>Frontend UI</option>
              <option value='ux-figma'>UX · Figma</option>
              <option value='full'>Full</option>
              <option value='automation'>Automation</option>
            </select>
            {errors.type && <span className='adminProjectEdit__error'>{errors.type}</span>}
          </label>

          {/* Tags */}
          <label className='adminProjectEdit__label'>
            Tags (comma-separated)
            <input
              className='adminProjectEdit__input'
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder='react, typescript, figma'
            />
          </label>

          {/* Excerpt */}
          <label className='adminProjectEdit__label'>
            Excerpt
            <textarea
              className='adminProjectEdit__input adminProjectEdit__textarea'
              value={excerpt}
              rows={3}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder='Short summary for lists and cards'
            />
          </label>

          {/* Description */}
          <label className='adminProjectEdit__label'>
            Description
            <textarea
              className='adminProjectEdit__input adminProjectEdit__textarea'
              value={description}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Full description of the project (optional)'
            />
          </label>

          {/* GitHub URL */}
          <label className='adminProjectEdit__label'>
            GitHub URL
            <input
              className='adminProjectEdit__input'
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder='https://github.com/owner/repo'
              inputMode='url'
            />
          </label>

          {/* GitHub repo (owner/name) */}
          <label className='adminProjectEdit__label'>
            GitHub repo (owner/name)
            <input
              className='adminProjectEdit__input'
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder='owner/repo'
            />
          </label>

          {/* Figma public URL */}
          <label className='adminProjectEdit__label'>
            Figma public URL
            <input
              className='adminProjectEdit__input'
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              placeholder='https://www.figma.com/file/FILEKEY/Name'
              inputMode='url'
            />
          </label>

          {/* Figma file key */}
          <label className='adminProjectEdit__label'>
            Figma file key
            <input
              className='adminProjectEdit__input'
              value={figmaKey}
              onChange={(e) => setFigmaKey(e.target.value)}
              placeholder='FILEKEY'
            />
          </label>

          {/* Live URL */}
          <label className='adminProjectEdit__label'>
            Live URL
            <input
              className='adminProjectEdit__input'
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder='https://example.com'
              inputMode='url'
            />
          </label>

          {/* Blog URL */}
          <label className='adminProjectEdit__label'>
            Blog URL
            <input
              className='adminProjectEdit__input'
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
              placeholder='https://thehumantechblog.com/en/posts/some-article'
              inputMode='url'
            />
          </label>

          {/* Cover image URL */}
          <label className='adminProjectEdit__label'>
            Cover image URL
            <input
              className='adminProjectEdit__input'
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder='https://... (Cloudinary or remote image)'
              inputMode='url'
            />
            <small className='adminProjectEdit__hint'>
              If you change this URL, the new image will be used as the cover and can be fetched
              through Cloudinary in the backend.
            </small>
          </label>
        </div>

        <div className='adminProjectEdit__actions'>
          <button
            className='adminProjectEdit__btn adminProjectEdit__btn--secondary'
            onClick={onClose}
            disabled={submitting}>
            Cancel
          </button>
          <button
            className='adminProjectEdit__btn adminProjectEdit__btn--primary'
            onClick={handleSave}
            aria-busy={submitting}
            disabled={submitting || hasErrors}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectEditModal;
