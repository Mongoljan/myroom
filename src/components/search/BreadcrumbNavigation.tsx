'use client';

interface BreadcrumbNavigationProps {
  searchLocation?: string;
}

export default function BreadcrumbNavigation({ searchLocation }: BreadcrumbNavigationProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center text-xs text-gray-600 overflow-x-auto">
          <button
            onClick={() => window.location.href = '/'}
            className="hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            Нүүр хуудас
          </button>
          <span className="mx-1 text-gray-400">→</span>
          <span className="whitespace-nowrap">Хайлт</span>
          {searchLocation && (
            <>
              <span className="mx-1 text-gray-400">→</span>
              <span className="text-gray-800 whitespace-nowrap font-medium">{searchLocation}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}