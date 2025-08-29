"use client";
import Link from 'next/link';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';

export default function RecommendedHotels() {
  const { t } = useHydratedTranslation();

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`${TYPOGRAPHY.heading.h2} text-gray-900 mb-1`}>{t('hotel.recommended', 'Recommended Hotels')}</h2>
            <p className={`${TYPOGRAPHY.body.standard} text-gray-600`}>{t('hotel.recommendedDesc', 'Discover our handpicked selection of exceptional hotels')}</p>
          </div>
          <Link 
            href="/hotels/recommended" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            {t('common.viewAll', 'View All')}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: t('hotel.filters.all', 'All'), active: true },
            { key: 'luxury', label: t('hotel.filters.luxury', 'Luxury') },
            { key: 'budget', label: t('hotel.filters.budget', 'Budget') },
            { key: 'boutique', label: t('hotel.filters.boutique', 'Boutique') },
            { key: 'business', label: t('hotel.filters.business', 'Business') },
          ].map((filter) => (
            <button
              key={filter.key}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">{t('hotel.recommendedDesc', 'Discover our handpicked selection of exceptional hotels')}</p>
        </div>
      </div>
    </section>
  );
}