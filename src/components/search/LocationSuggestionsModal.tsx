'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Hotel, MapPin } from 'lucide-react';
import { createPortal } from 'react-dom';
import { LocationSuggestion } from '@/services/locationApi';
import { RecentSearch } from '@/hooks/useRecentSearches';
import { RefObject } from 'react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface LocationSuggestionsModalProps {
  isClient: boolean;
  showLocationSuggestions: boolean;
  locationDropdownRef: RefObject<HTMLDivElement | null>;
  locationRef: RefObject<HTMLDivElement | null>;
  destination: string;
  recentSearches: RecentSearch[];
  isLoadingSuggestions: boolean;
  locationSuggestions: LocationSuggestion[];
  onLocationSelect: (suggestion: LocationSuggestion) => void;
}

export default function LocationSuggestionsModal({
  isClient,
  showLocationSuggestions,
  locationDropdownRef,
  locationRef,
  destination,
  recentSearches,
  isLoadingSuggestions,
  locationSuggestions,
  onLocationSelect
}: LocationSuggestionsModalProps) {
  const { t } = useHydratedTranslation();
  if (!isClient || !showLocationSuggestions || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={locationDropdownRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed bg-white rounded-xl border border-gray-200 z-[100000] max-h-96 overflow-y-auto w-[400px] max-w-[90vw]"
        style={{ 
          top: locationRef.current ? locationRef.current.getBoundingClientRect().bottom + 8 : 0,
          left: locationRef.current ? Math.max(8, Math.min(locationRef.current.getBoundingClientRect().left, window.innerWidth - 416)) : 0,
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          {/* Recent Searches Section */}
          {destination.length < 2 && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {t('search.recentSearches')}
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => onLocationSelect(search.location)}
                    className="w-full flex items-center p-2 text-left hover:bg-slate-50/50 rounded-lg transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <div className="text-slate-900 mr-3">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 group-hover:text-slate-900">
                        {search.location.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {search.checkIn} - {search.checkOut} • {search.guests.adults} {t('hotel.adults')}, {search.guests.children} {t('hotel.children')} • {search.guests.rooms} {t('hotel.rooms')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 my-3"></div>
            </div>
          )}

          {/* Popular Locations / Search Results Section */}
          <div className="text-xs text-gray-500 mb-2">
            {destination.length < 2 ? t('search.popularLocations') : t('search.searchResults')}
          </div>
          
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {locationSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => onLocationSelect(suggestion)}
                  className="w-full flex items-center p-2 text-left hover:bg-slate-50/50 rounded-lg transition-colors"
                >
                  <div className="mr-3">
                    {suggestion.type === 'property' ? (
                      <Hotel className="w-4 h-4 text-slate-900" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      {suggestion.fullName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {suggestion.type === 'property' ? t('search.property') : t('search.hotelsCount', { count: suggestion.property_count })}
                    </div>
                  </div>
                </button>
              ))}
              {locationSuggestions.length === 0 && !isLoadingSuggestions && (
                <div className="text-sm text-gray-500 text-center py-3">
                  {t('search.noResults')}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}