// /src/features/post/components/SinglePostContent.tsx

import { useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface SinglePostContentProps {
  content: string;
  className?: string;
}

/**
 * Normalizes language names for highlight.js compatibility.
 * For example, "react" should be treated as "javascript".
 */
function getHighlightLanguage(lang: string): string {
  if (!lang) return '';
  // Add mappings as needed
  if (lang.toLowerCase() === 'react') return 'javascript';
  if (lang.toLowerCase() === 'csharp' || lang.toLowerCase() === 'c#') return 'csharp';
  return lang.toLowerCase();
}

/**
 * Processes the HTML content and ensures that all <code data-language="xxx">
 * nodes also get a proper class="language-xxx" for highlight.js to work.
 */
function addLanguageClassesToCodeBlocks(html: string): string {
  // Regex: find <code ... data-language="xxx"...>
  return html.replace(
    /<code([^>]*)data-language=["']?([a-zA-Z0-9#_-]+)["']?([^>]*)>/g,
    (match, preAttrs, lang, postAttrs) => {
      const normalizedLang = getHighlightLanguage(lang);
      // Avoid duplicate language-xxx class if already present
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

  // Memoize processed HTML to avoid unnecessary recalculations
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
