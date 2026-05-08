"use client";
import { Globe } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function LanguageSwitcher() {
  const { i18n, mounted } = useHydratedTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'mn' ? 'en' : 'mn');
  };

  return (
    <button
      onClick={toggle}
      className="h-10 flex items-center gap-1.5 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-100"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium tracking-wide">
        {mounted ? i18n.language?.toUpperCase() : 'MN'}
      </span>
    </button>
  );
}
