'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { locationService, type LocationSuggestion } from '@/services/locationApi';

interface LocationSuggestionsProps {
  destination: string;
  showLocationSuggestions: boolean;
  locationSuggestions: LocationSuggestion[];
  selectedLocationSuggestion: LocationSuggestion | null;
  isLoadingSuggestions: boolean;
  locationModalPosition: { top: number; left: number };
  recentSearches: Array<{
    id: string;
    location: { name: string };
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number; rooms: number };
  }>;
  onDestinationChange: (value: string) => void;
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  onRecentSearchSelect: (search: {
    id: string;
    location: { name: string };
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number; rooms: number };
  }) => void;
  onClose: () => void;
  locationInputRef: React.RefObject<HTMLInputElement | null>;
  locationDropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function LocationSuggestions(props: LocationSuggestionsProps) {
  const {
    destination,
    showLocationSuggestions,
    locationSuggestions,
    isLoadingSuggestions,
    locationModalPosition,
    recentSearches,
    onLocationSelect,
    onRecentSearchSelect,
    onClose,
    locationDropdownRef
  } = props;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle location search
  const handleLocationSearch = async (query: string) => {
    if (query.length >= 2) {
      try {
        const suggestions = await locationService.searchLocations(query);
        // Handle suggestions here - this would be passed up via props
      } catch (error) {
        console.error('Location search failed:', error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (destination.trim()) {
        handleLocationSearch(destination);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [destination]);

  if (!isClient || !showLocationSuggestions) return null;

  const dropdownContent = (
    <motion.div
      ref={locationDropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-[400px] overflow-y-auto min-w-[320px] max-w-[500px]"
      style={{
        top: locationModalPosition.top,
        left: locationModalPosition.left,
        transform: 'translateY(8px)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Газар сонгох</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="p-2">
        {/* Loading state */}
        {isLoadingSuggestions && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Хайж байна...</p>
          </div>
        )}

        {/* Location suggestions */}
        {!isLoadingSuggestions && locationSuggestions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 px-3 py-2">Хайлтын үр дүн</p>
            {locationSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => onLocationSelect(suggestion)}
                className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3"
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{suggestion.name}</p>
                  <p className="text-sm text-gray-500 truncate">{suggestion.fullName}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Recent searches */}
        {!isLoadingSuggestions && recentSearches.length > 0 && (
          <div className="space-y-1 mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 px-3 py-2">Сүүлийн хайлтууд</p>
            {recentSearches.slice(0, 3).map((search, index) => (
              <motion.button
                key={index}
                onClick={() => onRecentSearchSelect(search)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{search.location.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {search.checkIn} - {search.checkOut} • {search.guests.adults + search.guests.children} хүн
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoadingSuggestions && locationSuggestions.length === 0 && destination.length >= 2 && (
          <div className="p-4 text-center">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Илэрц олдсонгүй</p>
            <p className="text-xs text-gray-400 mt-1">Өөр түлхүүр үг оруулж үзээрэй</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return createPortal(dropdownContent, document.body);
}