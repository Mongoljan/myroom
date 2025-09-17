'use client';

import { Filter, List, Grid3X3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterState {
  priceRange: [number, number];
  starRating: number[];
  facilities: string[];
  roomTypes: string[];
}

interface MobileFilterControlsProps {
  filters: FilterState;
  sortBy: string;
  viewMode: 'grid' | 'list';
  onShowFilters: () => void;
  onSort: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function MobileFilterControls({
  filters,
  sortBy,
  viewMode,
  onShowFilters,
  onSort,
  onViewModeChange
}: MobileFilterControlsProps) {
  const filterCount = filters.starRating.length + filters.facilities.length + filters.roomTypes.length;

  return (
    <div className="lg:hidden mb-4">
      <div className="flex gap-2">
        <button
          onClick={onShowFilters}
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">Шүүлтүүр</span>
          {filterCount > 0 && (
            <Badge variant="default" className="w-4 h-4 rounded-full p-0 text-xs font-bold flex items-center justify-center">
              {filterCount}
            </Badge>
          )}
        </button>
        {/* Mobile Sort */}
      </div>
    </div>
  );
}