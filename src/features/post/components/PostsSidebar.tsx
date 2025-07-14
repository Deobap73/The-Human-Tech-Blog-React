// src\features\post\components\PostsSidebar.tsx

import { ReactNode } from 'react';
import '../styles/PostsSidebar.scss';

type PostsSidebarProps = {
  children: ReactNode;
  className?: string;
};

const PostsSidebar = ({ children, className = '' }: PostsSidebarProps) => {
  return (
    <aside className={`sidebar ${className}`} aria-label='Sidebar'>
      {children}
    </aside>
  );
};

export default PostsSidebar;
