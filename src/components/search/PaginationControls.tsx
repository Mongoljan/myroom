'use client';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface PaginationControlsProps {
  totalResults: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function PaginationControls({
  totalResults,
  currentPage = 1,
  itemsPerPage = 12
}: PaginationControlsProps) {
  const { t } = useHydratedTranslation();
  if (totalResults <= itemsPerPage) {
    return null;
  }

  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className="mt-12">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Results info */}
          <div className="text-sm text-gray-800">
            {t('search.pagination.resultsText', { start: startItem, end: endItem, total: totalResults })}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:underline transition-all rounded-lg border border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{t('search.pagination.previous')}</span>
            </button>

            <div className="flex items-center gap-1 mx-2">
              {[1, 2, 3, '...', totalPages].map((page, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'text-gray-900 hover:bg-gray-100 hover:underline'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-primary hover:underline transition-all rounded-lg border border-gray-200">
              <span>{t('search.pagination.next')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}