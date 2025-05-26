//src/features/shared/components/LanguageSelector.tsx

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './LanguageSelector.scss';

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

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18n_lang', lng);

    const pathParts = location.pathname.split('/');
    // Troca prefixo de idioma se já existir
    if (LANGUAGES.some((l) => l.code === pathParts[1])) {
      pathParts[1] = lng;
    } else {
      pathParts.splice(1, 0, lng);
    }
    navigate(pathParts.join('/') + location.search);
  };

  return (
    <div className='language-selector'>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`language-selector__button${
            i18n.language === lang.code ? ' language-selector__button--active' : ''
          }`}
          onClick={() => handleChange(lang.code)}>
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
