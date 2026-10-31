import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationKey } from '../data/translations';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  t: TranslationKey;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('miar_language');
      if (saved === 'en' || saved === 'ur') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const direction: 'ltr' | 'rtl' = language === 'ur' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      localStorage.setItem('miar_language', language);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', direction);

    // Apply Urdu class to body for natural font styling
    if (language === 'ur') {
      document.body.classList.add('font-naskh');
    } else {
      document.body.classList.remove('font-naskh');
    }
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, direction, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
