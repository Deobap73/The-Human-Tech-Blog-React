// /src/features/post/components/SinglePostContent.tsx
'use strict';

import { useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// 👇 Importa os estilos desta área (blockquote, inline code, etc.)
import '../styles/SinglePostContent.scss';

// === Import and register extra languages for highlight.js ===
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml'; // highlight.js uses 'xml' for HTML
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

// Register languages only if not already present (prevents HMR double-registration)
function safeRegister(name: string, lang: any) {
  if (!hljs.getLanguage(name)) {
    hljs.registerLanguage(name, lang);
  }
}
safeRegister('typescript', typescript);
safeRegister('javascript', javascript);
safeRegister('react', javascript); // alias to javascript
safeRegister('html', xml);
safeRegister('css', css);
safeRegister('scss', scss);
safeRegister('json', json);
safeRegister('python', python);
safeRegister('java', java);
safeRegister('go', go);
safeRegister('rust', rust);
safeRegister('csharp', csharp);
safeRegister('c#', csharp); // alias
safeRegister('sql', sql);
safeRegister('bash', bash);
safeRegister('markdown', markdown);

interface SinglePostContentProps {
  content: string;
  className?: string;
}

/**
 * Normalize editor language names to highlight.js names.
 */
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

/**
 * Ensure <code data-language="xxx"> also has class="language-xxx".
 * This keeps TipTap/lowlight and highlight.js in sync.
 */
function addLanguageClassesToCodeBlocks(html: string): string {
  return html.replace(
    /<code([^>]*)data-language=["']?([a-zA-Z0-9#_.-]+)["']?([^>]*)>/g,
    (match, preAttrs, lang, postAttrs) => {
      const normalized = getHighlightLanguage(lang);
      if (!normalized) return match;
      if (match.includes(`language-${normalized}`)) return match;
      // preserve existing class attribute if present
      const hasClass = /class=["'][^"']*["']/.test(match);
      if (hasClass) {
        return match.replace(
          /class=["']([^"']*)["']/,
          (_m, cls) => `class="${cls} language-${normalized}"`
        );
      }
      return `<code${preAttrs}class="language-${normalized}" data-language="${lang}"${postAttrs}>`;
    }
  );
}

/**
 * Renders the post content with syntax highlighting and ensures
 * BEM class 'single-post-page' is always present for correct styling.
 *
 * NOTE: content is assumed sanitized on the server before persisted.
 */
const SinglePostContent = ({ content, className }: SinglePostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Process HTML to add language classes once per content change
  const processedContent = useMemo(() => addLanguageClassesToCodeBlocks(content), [content]);

  useEffect(() => {
    // Scope highlighting to this component only
    const root = contentRef.current;
    if (!root) return;

    const blocks = root.querySelectorAll<HTMLElement>('pre code');
    blocks.forEach((el) => {
      try {
        hljs.highlightElement(el);
      } catch {
        // swallow highlight errors so rendering never breaks
      }
    });
  }, [processedContent]);

  // Ensure 'single-post-page' is always present for BEM styles
  const combinedClassName = className ? `single-post-page ${className}` : 'single-post-page';

  return (
    <div
      ref={contentRef}
      className={combinedClassName}
      // Server must sanitize. On client we just render.
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default SinglePostContent;
