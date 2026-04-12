'use client';

import { MapPin } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface NoResultsStateProps {
  searchParams: URLSearchParams;
}

export default function NoResultsState({ searchParams }: NoResultsStateProps) {
  const { t } = useHydratedTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-16 text-center">
      <div className="max-w-lg mx-auto">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-200 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full -z-10 animate-pulse"></div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('hotel.noResults')}
        </h3>

        <p className="text-gray-800 dark:text-gray-300 mb-2 text-lg leading-relaxed">
          {t('hotel.noResultsMessage')}
        </p>

        <p className="text-gray-900 dark:text-gray-200 mb-8">
          {t('search.tryAnotherKeyword')}
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                // Clear filters functionality
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
            >
              {t('filters.clearFilters')}
            </button>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all duration-200"
            >
              {t('common.search')}
            </button>
          </div>

          {/* Popular destinations suggestion */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-800 dark:text-gray-300 mb-3">{t('home.popularDestinationsTitle')}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                t('destinations.ulaanbaatar'),
                'Мөрөн',
                t('destinations.erdenet')
              ].map((city) => (
                <button
                  key={city}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:underline transition-all"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.set('location', city);
                    window.location.href = `/search?${newParams.toString()}`;
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}