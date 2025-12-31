'use client';

import { Filter, MapPin } from 'lucide-react';
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
  onShowMapView?: () => void;
}

export default function MobileFilterControls({
  filters,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortBy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewMode,
  onShowFilters,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSort,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onViewModeChange,
  onShowMapView
}: MobileFilterControlsProps) {
  const filterCount = filters.starRating.length + filters.facilities.length + filters.roomTypes.length;

  return (
    <div className="lg:hidden mb-4">
      <div className="flex gap-2">
        {/* Show on Map Button */}
        {onShowMapView && (
          <button
            onClick={onShowMapView}
            className="bg-primary text-white border border-primary rounded-lg px-3 py-2 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Газрын зураг</span>
          </button>
        )}
        
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