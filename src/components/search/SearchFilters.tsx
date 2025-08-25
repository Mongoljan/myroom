'use client';

import { useState } from 'react';
import { X, Filter } from 'lucide-react';

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
}

export default function SearchFilters({ isOpen, onClose, onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [50000, 500000],
    starRating: [],
    facilities: [],
    roomTypes: []
  });

  const facilities = [
    'Free Wi-Fi',
    'Restaurant', 
    'Room Service',
    'Parking',
    'Fitness Center',
    'Spa & Wellness Center',
    'Pool',
    'Conference Room',
    '24-hour Front Desk'
  ];

  const roomTypes = [
    'Single',
    'Double', 
    'Twin',
    'Family',
    'Suite'
  ];

  const handlePriceChange = (value: number, index: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters };
    
    if (category === 'starRating') {
      const ratings = newFilters.starRating;
      const numValue = value as number;
      
      if (ratings.includes(numValue)) {
        newFilters.starRating = ratings.filter(r => r !== numValue);
      } else {
        newFilters.starRating = [...ratings, numValue];
      }
    } else if (category === 'facilities' || category === 'roomTypes') {
      const items = newFilters[category] as string[];
      const strValue = value as string;
      
      if (items.includes(strValue)) {
        newFilters[category] = items.filter(item => item !== strValue) as string[];
      } else {
        newFilters[category] = [...items, strValue] as string[];
      }
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [50000, 500000],
      starRating: [],
      facilities: [],
      roomTypes: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Filters Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-full overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Шүүлтүүр</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="text-blue-600 text-sm hover:underline"
              >
                Цэвэрлэх
              </button>
              <button
                onClick={onClose}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4">Үнийн хязгаар (₮)</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Хамгийн бага</label>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="10000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), 0)}
                  className="w-full mt-2"
                />
                <div className="text-sm font-medium">₮{formatPrice(filters.priceRange[0])}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Хамгийн их</label>
                <input
                  type="range"
                  min="50000"
                  max="1000000" 
                  step="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), 1)}
                  className="w-full mt-2"
                />
                <div className="text-sm font-medium">₮{formatPrice(filters.priceRange[1])}</div>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4">Од үнэлгээ</h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <label key={stars} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.starRating.includes(stars)}
                    onChange={() => handleCheckboxChange('starRating', stars)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(stars)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm ml-1">{stars} од</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4">Тохижилт</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {facilities.map((facility) => (
                <label key={facility} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.facilities.includes(facility)}
                    onChange={() => handleCheckboxChange('facilities', facility)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4">Өрөөний төрөл</h4>
            <div className="space-y-3">
              {roomTypes.map((roomType) => (
                <label key={roomType} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roomTypes.includes(roomType)}
                    onChange={() => handleCheckboxChange('roomTypes', roomType)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">{roomType}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}