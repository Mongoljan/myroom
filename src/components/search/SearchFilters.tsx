'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Star, Wifi, Car, Utensils, Users, Dumbbell, Waves, Building, Clock, X } from 'lucide-react';
import FilterSummary from './FilterSummary';

interface FilterState {
  priceRange: [number, number];
  starRating: number[];
  facilities: string[];
  roomTypes: string[];
}

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  embedded?: boolean;
}

const STORAGE_KEY = 'hotel_search_filters';

export default function SearchFilters({ isOpen, onClose, onFilterChange, embedded = false }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [50000, 500000],
    starRating: [],
    facilities: [],
    roomTypes: []
  });

  // Load filters from localStorage on mount
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        onFilterChangeRef.current(parsedFilters);
      }
    } catch (error) {
      console.warn('Failed to load saved filters:', error);
    }
  }, []); // Only run once on mount

  // Save filters to localStorage whenever they change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters));
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  }, [filters, onFilterChange]);

  const handleRemoveFilter = useCallback((filterType: string, value?: string | number) => {
    switch (filterType) {
      case 'priceRange':
        updateFilters({ priceRange: [50000, 500000] });
        break;
      case 'starRating':
        updateFilters({ 
          starRating: filters.starRating.filter(rating => rating !== value) 
        });
        break;
      case 'facilities':
        updateFilters({ 
          facilities: filters.facilities.filter(facility => facility !== value) 
        });
        break;
      case 'roomTypes':
        updateFilters({ 
          roomTypes: filters.roomTypes.filter(roomType => roomType !== value) 
        });
        break;
    }
  }, [filters, updateFilters]);

  const handleClearAllFilters = useCallback(() => {
    const defaultFilters = {
      priceRange: [50000, 500000] as [number, number],
      starRating: [],
      facilities: [],
      roomTypes: []
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved filters:', error);
    }
  }, [onFilterChange]);

  const facilities = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: <Wifi className="w-3.5 h-3.5" /> },
    { id: 'parking', label: 'Parking', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'restaurant', label: 'Restaurant', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'pool', label: 'Pool', icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'gym', label: 'Fitness Center', icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { id: 'spa', label: 'Spa', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'business', label: 'Business Center', icon: <Building className="w-3.5 h-3.5" /> },
    { id: '24h', label: '24h Front Desk', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  if (embedded) {
    return (
      <>
        <FilterSummary 
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
        <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Шүүлтүүр</h3>
        
        {/* Price Range - Compact Design */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-gray-700">Үнийн хязгаар</h4>
            <span className="text-xs text-gray-500">
              ₮{filters.priceRange[0].toLocaleString()}-{filters.priceRange[1].toLocaleString()}
            </span>
          </div>
          
          {/* Compact Price Range Options */}
          <div className="space-y-1.5">
            {[
              { label: '< 100K', min: 0, max: 100000 },
              { label: '100K - 300K', min: 100000, max: 300000 },
              { label: '300K - 500K', min: 300000, max: 500000 },
              { label: '> 500K', min: 500000, max: 1000000 },
            ].map((range) => {
              const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
              return (
                <button
                  key={range.label}
                  onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
                  className={`w-full p-2 rounded-md border text-xs transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Star Rating */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1.5">Од үнэлгээ</h4>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const isSelected = filters.starRating.includes(stars);
              return (
                <button
                  key={stars}
                  onClick={() => updateFilters({ 
                    starRating: isSelected
                      ? filters.starRating.filter(s => s !== stars)
                      : [...filters.starRating, stars]
                  })}
                  className={`flex items-center gap-1.5 w-full p-1.5 rounded-md border text-xs transition-colors ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: stars }, (_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-700">{stars}+ од</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1.5">Тохижилт</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {facilities.map((facility) => (
              <button
                key={facility.id}
                onClick={() => updateFilters({ 
                  facilities: filters.facilities.includes(facility.id)
                    ? filters.facilities.filter(f => f !== facility.id)
                    : [...filters.facilities, facility.id]
                })}
                className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                  filters.facilities.includes(facility.id)
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {facility.icon}
                  <span className="text-gray-700">{facility.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        </div>
      </>
    );
  }

  // Mobile modal version
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/25" onClick={onClose} />
        <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Шүүлтүүр</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Шүүлтүүр</h3>
              
              {/* Same content as embedded version */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-base">Budget Range</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ₮{filters.priceRange[0].toLocaleString()} - ₮{filters.priceRange[1].toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: '< 100K', min: 0, max: 100000 },
                    { label: '100K - 300K', min: 100000, max: 300000 },
                    { label: '300K - 500K', min: 300000, max: 500000 },
                    { label: '> 500K', min: 500000, max: 1000000 },
                  ].map((range) => {
                    const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/30 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{range.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-2">Од үнэлгээ</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      className="flex items-center gap-2 w-full p-2 rounded-lg border border-gray-200 hover:border-blue-200"
                    >
                      <div className="flex gap-0.5">
                        {Array.from({ length: stars }, (_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-700">{stars}+ од</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-2">Тохижилт</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {facilities.map((facility) => (
                    <button
                      key={facility.id}
                      className="flex items-center justify-between w-full p-2 rounded-lg border border-gray-200 hover:border-blue-200"
                    >
                      <div className="flex items-center gap-2">
                        {facility.icon}
                        <span className="text-sm text-gray-700">{facility.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}