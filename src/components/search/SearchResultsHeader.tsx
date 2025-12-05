'use client';

import { Search } from 'lucide-react';
import FilterSummary from './FilterSummary';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useState } from 'react';

interface FilterState {
  propertyTypes: number[];
  popularSearches: string[];
  priceRange: [number, number];
  roomFeatures: number[];
  generalServices: number[];
  bedTypes: string[];
  popularPlaces: string[];
  discounted: boolean;
  starRating: number[];
  outdoorAreas: number[];
  facilities: string[];
  roomTypes: string[];
}

interface SearchResultsHeaderProps {
  searchLocation?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
  childrenCount?: string;
  rooms?: string;
  filteredCount: number;
  totalCount: number;
  sortBy: string;
  viewMode: 'grid' | 'list';
  onSort: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  filters?: FilterState;
  onRemoveFilter?: (filterType: string, value?: string | number) => void;
  onClearAllFilters?: () => void;
  apiData?: {
    property_types?: { id: number; name_mn: string; }[];
    facilities?: { id: number; name_mn: string; }[];
  } | null;
  onSearchByName?: (value: string) => void;
}

export default function SearchResultsHeader({
  searchLocation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkIn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkOut,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adults,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  childrenCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rooms,
  filteredCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalCount,
  sortBy,
  viewMode,
  onSort,
  onViewModeChange,
  filters,
  onRemoveFilter,
  onClearAllFilters,
  apiData,
  onSearchByName
}: SearchResultsHeaderProps) {
  const { t } = useHydratedTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="space-y-4">
      {/* Filter Summary - Trip.com style */}


      {/* Main Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="relative flex justify-between items-center gap-x-4 border-b border-gray-100 mb-2 pb-2">

          {/* Search Info Row - Trip.com style */}
          <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                {searchLocation ? `${searchLocation}` : t('hotel.title')}: 
                <span className="text-lg font-semibold text-gray-900"> {filteredCount}</span>
              </h1>

            </div>
          


            {/* Results Count */}
           
          </div>


</div>
          {/* Controls Row - Trip.com style */}
          <div className="flex flex-col gap-2">
            {/* Sort Dropdown - Top Row */}
            <div className="flex items-center">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => onSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-8 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors min-w-[190px]"
                >
                  <option value="default">{t('search.sortOptions.default')}</option>
                  <option value="price_low">{t('search.sortOptions.priceLowToHigh')}</option>
                  <option value="price_high">{t('search.sortOptions.priceHighToLow')}</option>
                  <option value="rating">{t('search.sortOptions.ratingHighToLow')}</option>
                  <option value="recommended">{t('search.sortOptions.recommended')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search by Name - Bottom Row */}
            {onSearchByName && (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearchByName(e.target.value);
                  }}
                  placeholder={t('search.searchByNamePlaceholder')}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-9 pr-3 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors min-w-[220px]"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

            {/* View Toggle */}
            {/* <div className="hidden sm:block">
              <div className="flex bg-gray-100 p-0.5 rounded-md">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Grid</span>
                </button>
              </div>
            </div> */}
          </div>

                     {filters && onRemoveFilter && onClearAllFilters && (
        <FilterSummary
          filters={filters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAllFilters}
          apiData={apiData}
        />
      )}
      </div>
      
    </div>
  );
}