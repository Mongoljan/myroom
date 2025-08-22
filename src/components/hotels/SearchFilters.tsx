'use client'
import { useState } from "react";
import { useTranslation } from "react-i18next";

const SearchFilters = () => {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>('');

  const starOptions = [1, 2, 3, 4, 5];
  const facilityOptions = [
    'Free Wi-Fi',
    'Breakfast included',
    'Romantic',
    'Luxury',
    'Family friendly',
    'Business',
    'Room service',
    '24-hour front desk',
    'Fitness center',
    'Non-smoking rooms',
    'Airport shuttle',
    'Spa & wellness center',
    'Electric vehicle charging station',
    'Guest Laundry'
  ];

  const ratingOptions = [
    { value: 'any', label: 'Any', count: 95 },
    { value: 'wonderful', label: 'Wonderful 4.5+', count: 49 },
    { value: 'very-good', label: 'Very good 4+', count: 78 },
    { value: 'good', label: 'Good 3.5+', count: 78 }
  ];

  const neighborhoodOptions = [
    { name: 'Central London', count: 32 },
    { name: 'Queens Square area', count: 45 },
    { name: 'Westminster Borough', count: 21 },
    { name: 'Kensington and Chelsea', count: 18 },
    { name: 'Oxford Street', count: 67 }
  ];

  const handleStarToggle = (star: number) => {
    setSelectedStars(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
  };

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
    }).format(price).replace('MNT', '₮');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filter by</h3>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Price per night</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Star Rating</h4>
        <div className="space-y-3">
          {starOptions.map(star => (
            <label key={star} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStars.includes(star)}
                onChange={() => handleStarToggle(star)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="ml-3 flex items-center">
                {[...Array(star)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-700">{star} Star</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Guest Rating */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Guest Rating</h4>
        <div className="space-y-3">
          {ratingOptions.map(option => (
            <label key={option.value} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={option.value}
                  checked={selectedRating === option.value}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-sm text-gray-500">{option.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popular Filters */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Popular Filters</h4>
        <div className="space-y-3">
          {facilityOptions.slice(0, 6).map(facility => (
            <label key={facility} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility)}
                onChange={() => handleFacilityToggle(facility)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Style</h4>
        <div className="space-y-3">
          {['Budget', 'Mid-range', 'Luxury', 'Family friendly', 'Business'].map(style => (
            <label key={style} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">{style}</span>
              </div>
              <span className="text-sm text-gray-500">
                {style === 'Budget' ? '32' : style === 'Mid-range' ? '45' : style === 'Luxury' ? '21' : style === 'Family friendly' ? '78' : '19'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Neighborhood */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Neighborhood</h4>
        <div className="space-y-3">
          {neighborhoodOptions.map(neighborhood => (
            <label key={neighborhood.name} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">{neighborhood.name}</span>
              </div>
              <span className="text-sm text-gray-500">{neighborhood.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
        Clear all filters
      </button>
    </div>
  );
};

export default SearchFilters;