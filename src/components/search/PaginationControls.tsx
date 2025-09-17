'use client';

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
            <span className="font-medium text-gray-900">{startItem}-{endItem}</span> из {totalResults} зочид буудлын үр дүн
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg border border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Өмнөх</span>
            </button>

            <div className="flex items-center gap-1 mx-2">
              {[1, 2, 3, '...', totalPages].map((page, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-900 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-lg border border-blue-200">
              <span>Дараах</span>
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