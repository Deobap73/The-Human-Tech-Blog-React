// /src/shared/components/LanguageSelector.tsx

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import './styles/LanguageSelector.scss';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'de', label: 'DE' },
  { code: 'es', label: 'ES' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: currentLang } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18n_lang', lng);
    setIsOpen(false);

    const pathParts = location.pathname.split('/');
    if (LANGUAGES.some((l) => l.code === pathParts[1])) {
      pathParts[1] = lng;
    } else {
      pathParts.splice(1, 0, lng);
    }
    navigate(pathParts.join('/') + location.search);
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <div className={`language-selector ${isOpen ? 'language-selector--open' : ''}`}>
      <button className='language-selector__current' onClick={() => setIsOpen(!isOpen)}>
        {currentLanguage.label}
      </button>

      {isOpen && (
        <div className='language-selector__dropdown'>
          {LANGUAGES.filter((lang) => lang.code !== i18n.language).map((lang) => (
            <button
              key={lang.code}
              className='language-selector__option'
              onClick={() => handleChange(lang.code)}>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
