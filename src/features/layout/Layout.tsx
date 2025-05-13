// The-Human-Tech-Blog-React\src\components\layout\Layout.tsx

import './styles/Layout.scss';
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <div className='layout'>{children}</div>;
};
