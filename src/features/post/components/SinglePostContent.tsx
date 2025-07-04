// src/features/post/components/SinglePostContent.tsx

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface SinglePostContentProps {
  content: string;
  className?: string;
}

const SinglePostContent = ({ content, className }: SinglePostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      hljs.highlightAll();
    }
  }, [content]);

  return (
    <div ref={contentRef} className={className} dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default SinglePostContent;
