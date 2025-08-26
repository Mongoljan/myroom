'use client';

import { useState } from 'react';
import { X, Filter, Star, Wifi, Car, Utensils, Users, Dumbbell, Waves, Building, Clock } from 'lucide-react';

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
    { id: 'Free Wi-Fi', label: 'Free Wi-Fi', icon: <Wifi className="w-4 h-4" />, count: 245 },
    { id: 'Restaurant', label: 'Restaurant', icon: <Utensils className="w-4 h-4" />, count: 189 },
    { id: 'Room Service', label: 'Room Service', icon: <Users className="w-4 h-4" />, count: 156 },
    { id: 'Parking', label: 'Parking', icon: <Car className="w-4 h-4" />, count: 203 },
    { id: 'Fitness Center', label: 'Fitness Center', icon: <Dumbbell className="w-4 h-4" />, count: 134 },
    { id: 'Spa & Wellness Center', label: 'Spa & Wellness', icon: <Users className="w-4 h-4" />, count: 87 },
    { id: 'Pool', label: 'Pool', icon: <Waves className="w-4 h-4" />, count: 98 },
    { id: 'Conference Room', label: 'Conference Room', icon: <Building className="w-4 h-4" />, count: 112 },
    { id: '24-hour Front Desk', label: '24/7 Front Desk', icon: <Clock className="w-4 h-4" />, count: 167 }
  ];

  const roomTypes = [
    { id: 'Single', label: 'Single Room', count: 89 },
    { id: 'Double', label: 'Double Room', count: 156 },
    { id: 'Twin', label: 'Twin Beds', count: 134 },
    { id: 'Family', label: 'Family Room', count: 78 },
    { id: 'Suite', label: 'Suite', count: 45 }
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

  const getActiveFiltersCount = () => {
    return filters.starRating.length + filters.facilities.length + filters.roomTypes.length + 
           (filters.priceRange[0] > 50000 || filters.priceRange[1] < 500000 ? 1 : 0);
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
        transform transition-transform duration-300 ease-in-out md:rounded-2xl md:border md:border-gray-100
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto md:sticky md:top-4
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Шүүлтүүр</h3>
                {getActiveFiltersCount() > 0 && (
                  <p className="text-xs text-blue-600">
                    {getActiveFiltersCount()} шүүлтүүр идэвхтэй
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Цэвэрлэх
                </button>
              )}
              <button
                onClick={onClose}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-base">Үнийн хязгаар</h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                ₮{formatPrice(filters.priceRange[0])} - ₮{formatPrice(filters.priceRange[1])}
              </span>
            </div>
            
            <div className="space-y-5">
              {/* Price Range Visual */}
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full relative"
                    style={{
                      marginLeft: `${((filters.priceRange[0] - 50000) / 950000) * 100}%`,
                      width: `${((filters.priceRange[1] - filters.priceRange[0]) / 950000) * 100}%`
                    }}
                  >
                    <div className="absolute -right-1 -top-1 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-sm"></div>
                    <div className="absolute -left-1 -top-1 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* Min Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Хамгийн бага үнэ</label>
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
                    ₮{formatPrice(filters.priceRange[0])}
                  </div>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="10000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), 0)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
              </div>
              
              {/* Max Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Хамгийн их үнэ</label>
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
                    ₮{formatPrice(filters.priceRange[1])}
                  </div>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000" 
                  step="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), 1)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
              </div>
              
              {/* Quick Price Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { label: '< 100к', min: 50000, max: 100000 },
                  { label: '100к-200к', min: 100000, max: 200000 },
                  { label: '200к-300к', min: 200000, max: 300000 },
                  { label: '> 300к', min: 300000, max: 500000 }
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      handlePriceChange(range.min, 0);
                      handlePriceChange(range.max, 1);
                    }}
                    className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                      filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-base">Од үнэлгээ</h4>
              {filters.starRating.length > 0 && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {filters.starRating.length} сонгогдсон
                </span>
              )}
            </div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const isSelected = filters.starRating.includes(stars);
                return (
                  <label 
                    key={stars} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50 ${
                      isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange('starRating', stars)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(stars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          {[...Array(5-stars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-gray-300" />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{stars} од</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {Math.floor(Math.random() * 50) + 20}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-base">Тохижилт</h4>
              {filters.facilities.length > 0 && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {filters.facilities.length} сонгогдсон
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {facilities.map((facility) => {
                const isSelected = filters.facilities.includes(facility.id);
                return (
                  <label 
                    key={facility.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50 ${
                      isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange('facilities', facility.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                          {facility.icon}
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                          {facility.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {facility.count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Room Types */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-base">Өрөөний төрөл</h4>
              {filters.roomTypes.length > 0 && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {filters.roomTypes.length} сонгогдсон
                </span>
              )}
            </div>
            <div className="space-y-2">
              {roomTypes.map((roomType) => {
                const isSelected = filters.roomTypes.includes(roomType.id);
                return (
                  <label 
                    key={roomType.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50 ${
                      isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange('roomTypes', roomType.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {roomType.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {roomType.count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* Apply Filters Button for Mobile */}
          <div className="md:hidden sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} шүүлтүүр хэрэглэх` : 'Шүүлтүүр хэрэглэх'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Custom Scrollbar and Slider Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}