// /src/features/post/components/SinglePostContent.tsx

import { useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// === Import and register extra languages for highlight.js ===
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml'; // highlight.js usa 'xml' para HTML
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

// Registar linguagens (chama só uma vez)
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('react', javascript); // Para 'react', usar 'javascript'
hljs.registerLanguage('html', xml); // HTML via 'xml'
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('c#', csharp); // Alias, para segurança
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('markdown', markdown);

interface SinglePostContentProps {
  content: string;
  className?: string;
}

/**
 * Normalizes language names for highlight.js compatibility.
 */
function getHighlightLanguage(lang: string): string {
  if (!lang) return '';
  const lower = lang.toLowerCase();
  // Mapping logic for highlight.js
  if (lower === 'react' || lower === 'jsx') return 'javascript';
  if (lower === 'c#' || lower === 'csharp') return 'csharp';
  if (lower === 'html') return 'html';
  if (lower === 'js') return 'javascript';
  if (lower === 'ts') return 'typescript';
  // add more aliases if needed
  return lower;
}

/**
 * Ensures <code data-language="xxx"> also has class="language-xxx"
 */
function addLanguageClassesToCodeBlocks(html: string): string {
  return html.replace(
    /<code([^>]*)data-language=["']?([a-zA-Z0-9#_-]+)["']?([^>]*)>/g,
    (match, preAttrs, lang, postAttrs) => {
      const normalizedLang = getHighlightLanguage(lang);
      if (match.includes(`language-${normalizedLang}`)) return match;
      return `<code${preAttrs}class="language-${normalizedLang}" data-language="${lang}"${postAttrs}>`;
    }
  );
}

/**
 * Renders the post content with syntax highlighting and ensures
 * BEM class 'single-post-page' is always present for correct styling.
 */
const SinglePostContent = ({ content, className }: SinglePostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Memoize processed HTML
  const processedContent = useMemo(() => addLanguageClassesToCodeBlocks(content), [content]);

  useEffect(() => {
    if (contentRef.current) {
      hljs.highlightAll();
    }
  }, [processedContent]);

  // Ensures 'single-post-page' is always present
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
