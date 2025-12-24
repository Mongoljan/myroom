'use client';

import { useCallback } from 'react';
import { X, Filter, Trash2 } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface FilterState {
  propertyTypes: number[];
  popularSearches: string[];
  priceRange: [number, number];
  roomFeatures: number[];
  generalServices: number[];
  bedTypes: string[] | Record<string, number>; // Support both old string[] and new Record<string, number>
  popularPlaces: string[];
  discounted: boolean;
  starRating: number[];
  outdoorAreas: number[];
  facilities: string[];
  roomTypes: string[];
}

interface FilterSummaryProps {
  filters: FilterState;
  onRemoveFilter: (filterType: string, value?: string | number) => void;
  onClearAll: () => void;
  apiData?: {
    property_types?: { id: number; name_mn: string; }[];
    facilities?: { id: number; name_mn: string; }[];
  } | null;
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

export default function FilterSummary({ filters, onRemoveFilter, onClearAll, apiData }: FilterSummaryProps) {
  const { t } = useHydratedTranslation();

  const getActiveFilters = useCallback(() => {
    const active: { type: string; label: string; value: string | number }[] = [];

    // Property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filters.propertyTypes.forEach(typeId => {
        const propertyType = apiData?.property_types?.find(pt => pt.id === typeId);
        active.push({
          type: 'propertyTypes',
          label: propertyType?.name_mn || `Property Type ${typeId}`,
          value: typeId
        });
      });
    }

    // Popular searches
    if (filters.popularSearches && filters.popularSearches.length > 0) {
      filters.popularSearches.forEach(search => {
        active.push({
          type: 'popularSearches',
          label: search,
          value: search
        });
      });
    }

    // Price range filter - only show if different from default range
    if (filters.priceRange && (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000000)) {
      active.push({
        type: 'priceRange',
        label: `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`,
        value: 'priceRange'
      });
    }

    // Room features
    if (filters.roomFeatures && filters.roomFeatures.length > 0) {
      filters.roomFeatures.forEach(featureId => {
        const facility = apiData?.facilities?.find(f => f.id === featureId);
        active.push({
          type: 'roomFeatures',
          label: facility?.name_mn || `Room Feature ${featureId}`,
          value: featureId
        });
      });
    }

    // General services
    if (filters.generalServices && filters.generalServices.length > 0) {
      filters.generalServices.forEach(serviceId => {
        const facility = apiData?.facilities?.find(f => f.id === serviceId);
        active.push({
          type: 'generalServices',
          label: facility?.name_mn || `Service ${serviceId}`,
          value: serviceId
        });
      });
    }

    // Bed types
    if (filters.bedTypes) {
      if (Array.isArray(filters.bedTypes) && filters.bedTypes.length > 0) {
        // Old format: array of bed type strings
        filters.bedTypes.forEach(bedType => {
          active.push({
            type: 'bedTypes',
            label: bedType,
            value: bedType
          });
        });
      } else if (typeof filters.bedTypes === 'object' && !Array.isArray(filters.bedTypes)) {
        // New format: object with counts
        const bedTypeLabels: Record<string, string> = {
          single: 'Ганц ор',
          double: 'Давхар ор',
          queen: 'Хатан ор',
          king: 'Хаан ор'
        };
        Object.entries(filters.bedTypes).forEach(([bedType, count]) => {
          if (count > 0) {
            active.push({
              type: 'bedTypes',
              label: `${bedTypeLabels[bedType] || bedType}: ${count}`,
              value: bedType
            });
          }
        });
      }
    }

    // Popular places
    if (filters.popularPlaces && filters.popularPlaces.length > 0) {
      filters.popularPlaces.forEach(place => {
        active.push({
          type: 'popularPlaces',
          label: place,
          value: place
        });
      });
    }

    // Discounted
    if (filters.discounted) {
      active.push({
        type: 'discounted',
        label: t('search.discountedPrice'),
        value: 'discounted'
      });
    }

    // Star rating filters
    if (filters.starRating && filters.starRating.length > 0) {
      filters.starRating.forEach(rating => {
        active.push({
          type: 'starRating',
          label: `${rating}+ од`,
          value: rating
        });
      });
    }

    // Outdoor areas
    if (filters.outdoorAreas && filters.outdoorAreas.length > 0) {
      filters.outdoorAreas.forEach(areaId => {
        const facility = apiData?.facilities?.find(f => f.id === areaId);
        active.push({
          type: 'outdoorAreas',
          label: facility?.name_mn || `Outdoor ${areaId}`,
          value: areaId
        });
      });
    }

    // Facility filters (legacy support)
    if (filters.facilities && filters.facilities.length > 0) {
      filters.facilities.forEach(facility => {
        active.push({
          type: 'facilities',
          label: FACILITY_LABELS[facility] || facility,
          value: facility
        });
      });
    }

    // Room type filters (legacy support)
    if (filters.roomTypes && filters.roomTypes.length > 0) {
      filters.roomTypes.forEach(roomType => {
        active.push({
          type: 'roomTypes',
          label: roomType,
          value: roomType
        });
      });
    }

    return active;
  }, [filters, apiData, t]);

  const activeFilters = getActiveFilters();

  return (
    <div className="">
      <div className="flex  ">
        <div className="flex items-center gap-1.5 w-[160px] ">
          <Filter className="w-3.5 h-3.5 text-gray-600" />
          <h3 className="text-xs font-medium text-gray-700">
            {t('search.activeFilters')}:
          </h3>
        </div>
        {activeFilters.length > 0 && (
        <div className="flex flex-wrap  gap-1.5">
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
           {activeFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex cursor-pointer items-center gap-1 text-xs ml-2 text-primary hover:underline transition-all"
          >
            <Trash2 className="w-3 h-3" />
            {t('search.clearAll')}
          </button>
        )}
        </div>
      )}
       
      </div>

      
    </div>
  );
}