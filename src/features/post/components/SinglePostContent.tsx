// src/features/post/components/SinglePostContent.tsx

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface SinglePostContentProps {
  content: string;
  className?: string;
}

/**
 * Renders the post content with syntax highlighting and ensures
 * BEM class 'single-post-page' is always present for correct styling.
 */
const SinglePostContent = ({ content, className }: SinglePostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      hljs.highlightAll();
    }
  }, [content]);

  // Ensures 'single-post-page' is always present
  const combinedClassName = className ? `single-post-page ${className}` : 'single-post-page';

  return (
    <div
      ref={contentRef}
      className={combinedClassName}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default SinglePostContent;
