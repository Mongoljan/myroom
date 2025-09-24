'use client';

import { MapPin } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface NoResultsStateProps {
  searchParams: URLSearchParams;
}

export default function NoResultsState({ searchParams }: NoResultsStateProps) {
  const { t, i18n } = useHydratedTranslation();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="max-w-lg mx-auto">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-50 rounded-full -z-10 animate-pulse"></div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          {t('hotel.noResults')}
        </h3>

        <p className="text-gray-800 mb-2 text-lg leading-relaxed">
          {t('hotel.noResultsMessage')}
        </p>

        <p className="text-gray-900 mb-8">
          {t('search.tryAnotherKeyword')}
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                console.log('Clear filters');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              {t('filters.clearFilters')}
            </button>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              {t('common.search')}
            </button>
          </div>

          {/* Popular destinations suggestion */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-800 mb-3">{t('home.popularDestinationsTitle')}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                t('destinations.ulaanbaatar'),
                'Мөрөн',
                t('destinations.erdenet')
              ].map((city) => (
                <button
                  key={city}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-900 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
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