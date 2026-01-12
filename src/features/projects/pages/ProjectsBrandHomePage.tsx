// /src/features/projects/pages/ProjectsBrandHomePage.tsx
'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import BrandHeader from '../BrandHeader/BrandHeader';
import ServicesStrip from '../ServicesStrip/ServicesStrip';
import FeaturedProjects from '../FeaturedProjects/FeaturedProjects';

import FiltersBar from '../FiltersBar/FiltersBar';
import type { SortOption } from '../FiltersBar/FiltersBar';

import ProjectsGrid from '../ProjectsGrid/ProjectsGrid';
import type { ProjectGridItem } from '../ProjectsGrid/ProjectsGrid';

import Pagination from '../Pagination/Pagination';

import { fetchProjects } from '../../../shared/services/projectService';
import type { Project } from '../../../shared/types/Project';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

import './ProjectsBrandHomePage.scss';

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((t) => typeof t === 'string' && t.trim().length > 0) as string[];
}

function buildLangPath(lang: string | undefined, path: string): string {
  const l = (lang || '').trim();
  if (!l) return path.startsWith('/') ? path : `/${path}`;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `/${l}${p}`;
}

function toGridItem(p: Project, lang: string | undefined): ProjectGridItem {
  const title = safeStr(p.title);
  const excerpt = safeStr(p.excerpt);
  const imageSrc = safeStr(p.coverImage);

  const detailsHref = buildLangPath(lang, `/projects/${encodeURIComponent(p.slug)}`);

  const live = p.links?.live ? String(p.links.live) : undefined;
  const github = p.links?.github ? String(p.links.github) : undefined;

  const tags = normalizeTags(p.tags);

  return {
    id: p._id,
    title,
    subtitle: p.type,
    excerpt,
    imageSrc,
    imageAlt: title,
    tags,
    links: {
      live,
      repo: github,
      details: detailsHref,
    },
  };
}

function sortItems(items: ProjectGridItem[], mode: SortOption): ProjectGridItem[] {
  const cloned = [...items];

  if (mode === 'az') {
    cloned.sort((a, b) => a.title.localeCompare(b.title));
    return cloned;
  }

  if (mode === 'za') {
    cloned.sort((a, b) => b.title.localeCompare(a.title));
    return cloned;
  }

  if (mode === 'oldest') {
    return cloned;
  }

  return cloned;
}

export default function ProjectsBrandHomePage() {
  const { t } = useTranslation();
  const { lang } = useParams();

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebouncedValue(search, 350);

  const [sort, setSort] = useState<SortOption>('newest');
  const [compact, setCompact] = useState<boolean>(false);

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 9;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [rawItems, setRawItems] = useState<Project[]>([]);
  const [total, setTotal] = useState<number>(0);

  const controllerRef = React.useRef<AbortController | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    rawItems.forEach((p) => normalizeTags(p.tags).forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rawItems]);

  const filteredItems: ProjectGridItem[] = useMemo(() => {
    let items = rawItems.map((p) => toGridItem(p, lang));

    if (activeTags.length > 0) {
      items = items.filter((it) => {
        const tags = it.tags ?? [];
        return activeTags.every((x) => tags.includes(x));
      });
    }

    return sortItems(items, sort);
  }, [rawItems, activeTags, sort, lang]);

  const featuredItems: ProjectGridItem[] = useMemo(
    () => filteredItems.slice(0, 3),
    [filteredItems]
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError('');

    fetchProjects(undefined, page, limit, debouncedSearch, controller.signal, true)
      .then((res) => {
        setRawItems(res.items ?? []);
        setTotal(res.total ?? 0);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setError(t('projectsPage.loadError', 'Could not load projects.'));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page, limit, debouncedSearch, t]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const toggleTag = (tag: string): void => {
    setPage(1);
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  };

  const clearFilters = (): void => {
    setSearch('');
    setActiveTags([]);
    setSort('newest');
    setPage(1);
  };

  const contactHref = buildLangPath(lang, '/contact');

  return (
    <main className='projectsBrand'>
      <BrandHeader
        title='The Human Tech Digitals'
        subtitle={t('projectsBrand.subtitle', 'Frontend, product, automation, and content')}
        description={t(
          'projectsBrand.description',
          'I build calm, clear web experiences, and I ship them with strong structure, clean UI, and practical automation.'
        )}
        primaryCtaHref={contactHref}
        primaryCtaLabel={t('projectsBrand.ctaPrimary', 'Work with me')}
        secondaryCtaHref='https://github.com/Deobap73'
        secondaryCtaLabel={t('projectsBrand.ctaSecondary', 'GitHub')}
        tertiaryCtaHref='https://thehumantechblog.com/'
        tertiaryCtaLabel={t('projectsBrand.ctaTertiary', 'Read the blog')}
      />

      <ServicesStrip />

      {/* <FeaturedProjects items={featuredItems} compact={compact} /> */}

      <section className='projectsBrand__controls'>
        <FiltersBar
          search={search}
          onSearch={setSearch}
          sort={sort}
          onSort={setSort}
          tags={allTags}
          activeTags={activeTags}
          onToggleTag={toggleTag}
          compact={compact}
          onToggleCompact={setCompact}
        />
      </section>

      <section className='projectsBrand__content'>
        <div className='projectsBrand__inner'>
          {error && (
            <div className='projectsBrand__error' role='status'>
              {error}
            </div>
          )}

          {loading ? (
            <div className='projectsBrand__loading' role='status'>
              {t('common.loading', 'Loading...')}
            </div>
          ) : (
            <ProjectsGrid
              items={filteredItems}
              compact={compact}
              emptyText={t('projectsPage.empty', 'No projects found for this filter.')}
            />
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            compact={compact}
            ariaLabel={t('projectsPage.pagination', 'Projects pagination')}
          />
        </div>
      </section>

      <section
        className='projectsBrand__cta'
        aria-label={t('projectsBrand.footerCta', 'Footer call to action')}>
        <div className='projectsBrand__ctaInner'>
          <h2 className='projectsBrand__ctaTitle'>
            {t('projectsBrand.footerTitle', 'Want to build something clear and useful')}
          </h2>
          <p className='projectsBrand__ctaText'>
            {t(
              'projectsBrand.footerText',
              'If you have a project in mind, I can help you shape it, build it, and ship it with clean structure.'
            )}
          </p>
          <a className='projectsBrand__ctaBtn' href={contactHref}>
            {t('projectsBrand.footerBtn', 'Contact')}
          </a>
        </div>
      </section>

      <div className='projectsBrand__debug' aria-hidden='true'>
        <button type='button' className='projectsBrand__debugBtn' onClick={clearFilters}>
          {t('common.clear', 'Clear')}
        </button>
      </div>
    </main>
  );
}
