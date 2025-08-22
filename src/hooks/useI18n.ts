import { useTranslation as useReactI18next } from 'react-i18next';

// Custom hook that provides the same interface as your old translation context
// This makes migration easier
export const useTranslation = () => {
  const { t, i18n } = useReactI18next();
  
  return {
    t,
    currentLanguage: i18n.language,
    setLanguage: (lang: string) => i18n.changeLanguage(lang),
  };
};

// Re-export the original hook for direct use
export { useTranslation as useReactI18next } from 'react-i18next';