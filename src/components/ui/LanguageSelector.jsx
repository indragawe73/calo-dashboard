import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import './LanguageSelector.scss';

const LanguageSelector = ({ variant = 'default', className = '' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'id',
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia',
      flag: '🇮🇩'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`language-selector language-selector--${variant} ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="language-selector__trigger"
        onClick={toggleDropdown}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <div className="language-selector__current">
          <Globe size={16} className="language-selector__icon" />
          <span className="language-selector__flag">{currentLanguage.flag}</span>
          <span className="language-selector__name">{currentLanguage.code.toUpperCase()}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`language-selector__arrow ${isOpen ? 'language-selector__arrow--open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="language-selector__dropdown">
          <div className="language-selector__list">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                className={`language-selector__option ${
                  language.code === i18n.language ? 'language-selector__option--active' : ''
                }`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className="language-selector__option-flag">{language.flag}</span>
                <div className="language-selector__option-text">
                  <span className="language-selector__option-name">{language.name}</span>
                  <span className="language-selector__option-native">{language.nativeName}</span>
                </div>
                {language.code === i18n.language && (
                  <div className="language-selector__option-check">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
