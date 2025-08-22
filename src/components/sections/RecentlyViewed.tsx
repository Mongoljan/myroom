"use client";
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function RecentlyViewed() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('hotel.recentlyViewed')}</h2>
            <p className="text-gray-600">{t('hotel.recentlyViewedDesc')}</p>
          </div>
          <Link 
            href="/hotels/recent" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            {t('common.viewAll')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <p className="text-gray-600">{t('hotel.recentlyViewedDesc')}</p>
        </div>
      </div>
    </section>
  );
}