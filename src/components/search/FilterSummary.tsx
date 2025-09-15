'use client';

import { useState, useCallback } from 'react';
import { X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
  priceRange: [number, number];
  starRating: number[];
  facilities: string[];
  roomTypes: string[];
}

interface FilterSummaryProps {
  filters: FilterState;
  onRemoveFilter: (filterType: string, value?: string | number) => void;
  onClearAll: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0
  }).format(price).replace('MNT', '₮');
};

const FACILITY_LABELS: Record<string, string> = {
  wifi: 'Free Wi-Fi',
  parking: 'Parking',
  restaurant: 'Restaurant',
  pool: 'Pool',
  gym: 'Fitness Center',
  spa: 'Spa',
  business: 'Business Center',
  '24h': '24h Front Desk'
};

export default function FilterSummary({ filters, onRemoveFilter, onClearAll }: FilterSummaryProps) {
  const [isVisible, setIsVisible] = useState(true);

  const getActiveFilters = useCallback(() => {
    const active = [];
    
    // Price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
      active.push({
        type: 'priceRange',
        label: `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`,
        value: 'priceRange'
      });
    }

    // Star rating filters
    filters.starRating.forEach(rating => {
      active.push({
        type: 'starRating',
        label: `${rating}+ од`,
        value: rating
      });
    });

    // Facility filters
    filters.facilities.forEach(facility => {
      active.push({
        type: 'facilities',
        label: FACILITY_LABELS[facility] || facility,
        value: facility
      });
    });

    // Room type filters
    filters.roomTypes.forEach(roomType => {
      active.push({
        type: 'roomTypes',
        label: roomType,
        value: roomType
      });
    });

    return active;
  }, [filters]);

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-gray-600" />
          <h3 className="text-xs font-medium text-gray-700">
            Идэвхтэй шүүлтүүр ({activeFilters.length})
          </h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
        >
          Арилгах
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {activeFilters.map((filter) => (
          <div
            key={`${filter.type}-${filter.value}`}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md border border-gray-200"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="hover:text-gray-900 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}