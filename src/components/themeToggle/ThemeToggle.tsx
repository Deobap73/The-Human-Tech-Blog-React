// The-Human-Tech-Blog-React\src\components\themeToggle\ThemeToggle.tsx
'use client';

import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.scss';
import images from '../../assets/imageIndex';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className='theme-toggle'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <img src={images.moon} alt='Moon' width={14} height={14} className='theme-toggle__icon' />
      <div
        className={`theme-toggle__ball ${
          theme === 'dark' ? 'theme-toggle__ball--dark' : 'theme-toggle__ball--light'
        }`}
      />
      <img src={images.sun} alt='Sun' width={14} height={14} className='theme-toggle__icon' />
    </button>
  );
};

export default ThemeToggle;
