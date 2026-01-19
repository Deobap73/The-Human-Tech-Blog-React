// /src/features/post/components/SinglePostContent.tsx
'use strict';

import { useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import '../styles/SinglePostContent.scss';

import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import csharp from 'highlight.js/lib/languages/csharp';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import yaml from 'highlight.js/lib/languages/yaml';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

// Important: no @tiptap/html needed
import { generateHTML } from '@tiptap/core';

import { CustomCodeBlock } from '../../../shared/extensions/CustomCodeBlock';

function safeRegister(name: string, lang: any) {
  if (!hljs.getLanguage(name)) {
    hljs.registerLanguage(name, lang);
  }
}

safeRegister('typescript', typescript);
safeRegister('javascript', javascript);
safeRegister('react', javascript);
safeRegister('html', xml);
safeRegister('xml', xml);
safeRegister('css', css);
safeRegister('scss', scss);
safeRegister('json', json);
safeRegister('python', python);
safeRegister('java', java);
safeRegister('go', go);
safeRegister('rust', rust);
safeRegister('csharp', csharp);
safeRegister('sql', sql);
safeRegister('bash', bash);
safeRegister('markdown', markdown);
safeRegister('yaml', yaml);

interface SinglePostContentProps {
  content: string;
  className?: string;
}

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

function getHighlightLanguage(lang: string): string {
  if (!lang) return '';
  const lower = lang.toLowerCase();
  if (lower === 'react' || lower === 'jsx') return 'javascript';
  if (lower === 'c#' || lower === 'csharp') return 'csharp';
  if (lower === 'js') return 'javascript';
  if (lower === 'ts' || lower === 'tsx') return 'typescript';
  if (lower === 'sh' || lower === 'shell') return 'bash';
  if (lower === 'yml') return 'yaml';
  return lower;
}

function addLanguageClassesToCodeBlocks(html: string): string {
  return html.replace(
    /<code([^>]*)data-language=["']?([a-zA-Z0-9#_.-]+)["']?([^>]*)>/g,
    (match, preAttrs, lang, postAttrs) => {
      const normalized = getHighlightLanguage(lang);
      if (!normalized) return match;
      if (match.includes(`language-${normalized}`)) return match;

      const hasClass = /class=["'][^"']*["']/.test(match);
      if (hasClass) {
        return match.replace(
          /class=["']([^"']*)["']/,
          (_m, cls) => `class="${cls} language-${normalized}"`,
        );
      }

      return `<code${preAttrs}class="language-${normalized}" data-language="${lang}"${postAttrs}>`;
    },
  );
}

function tiptapJsonStringToHtml(jsonString: string): string {
  try {
    const doc = JSON.parse(jsonString);

    if (!isPlainObject(doc) || doc.type !== 'doc') return '';

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
        openOnClick: true,
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

    return generateHTML(doc as any, extensions as any);
  } catch {
    return '';
  }
}

const SinglePostContent = ({ content, className }: SinglePostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const processedContent = useMemo(() => {
    const rawHtml = looksLikeTiptapJsonString(content) ? tiptapJsonStringToHtml(content) : content;
    const safeHtml = typeof rawHtml === 'string' ? rawHtml : '';
    return addLanguageClassesToCodeBlocks(safeHtml);
  }, [content]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const blocks = root.querySelectorAll<HTMLElement>('pre code');
    blocks.forEach((el) => {
      try {
        hljs.highlightElement(el);
      } catch {
        // ignore
      }
    });
  }, [processedContent]);

  const combinedClassName = className ? `single-post-page ${className}` : 'single-post-page';

  return (
    <div
      ref={contentRef}
      className={combinedClassName}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default SinglePostContent;
