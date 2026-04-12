'use client';

import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BreadcrumbNavigationProps {
  searchLocation?: string;
}

export default function BreadcrumbNavigation({ searchLocation }: BreadcrumbNavigationProps) {
  const { t } = useHydratedTranslation();
  return (
    <div className="bg-gradient-to-r from-slate-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 border-b border-slate-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
          <button
            onClick={() => window.location.href = '/'}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            {t('breadcrumb.home')}
          </button>
          <span className="mx-1 text-gray-400 dark:text-gray-500">→</span>
          <span className="whitespace-nowrap">{t('search.searchResults')}</span>
          {searchLocation && (
            <>
              <span className="mx-1 text-gray-400 dark:text-gray-500">→</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap font-medium">{searchLocation}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}