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
        className="fixed bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 z-[100000] max-h-[480px] overflow-y-auto w-[580px] max-w-[95vw]"
        style={{ 
          top: locationRef.current ? locationRef.current.getBoundingClientRect().bottom + 8 : 0,
          left: locationRef.current ? Math.max(8, Math.min(locationRef.current.getBoundingClientRect().left, window.innerWidth - 596)) : 0,
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          {/* Recent Searches Section */}
          {destination.length < 2 && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {t('search.recentSearches')}
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 3).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => onLocationSelect(search.location)}
                    className="w-full flex items-center p-2 text-left hover:bg-slate-50/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-gray-600"
                  >
                    <div className="text-slate-900 mr-3">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-slate-900 dark:group-hover:text-white">
                        {search.location.fullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {search.checkIn} - {search.checkOut} • {search.guests.adults} {t('hotel.adults')}, {search.guests.children} {t('hotel.children')} • {search.guests.rooms} {t('hotel.rooms')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>
            </div>
          )}

          {/* Popular Locations / Search Results Section */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {destination.length < 2 ? t('search.popularLocations') : t('search.searchResults')}
          </div>
          
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
            </div>
          ) : destination.length < 2 ? (
            /* Popular destinations — flex-wrap pill boxes */
            <div className="flex flex-wrap gap-2">
              {locationSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => onLocationSelect(suggestion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary/5 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors"
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  {suggestion.name}
                </button>
              ))}
              {locationSuggestions.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                  {t('search.noResults')}
                </div>
              )}
            </div>
          ) : (
            /* Search results — vertical list */
            <div className="space-y-1">
              {locationSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => onLocationSelect(suggestion)}
                  className="w-full flex items-center p-2 text-left hover:bg-slate-50/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="mr-3">
                    {suggestion.type === 'property' ? (
                      <Hotel className="w-4 h-4 text-slate-900" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {suggestion.fullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.type === 'property' ? t('search.property') : t('search.hotelsCount', { count: suggestion.property_count })}
                    </div>
                  </div>
                </button>
              ))}
              {locationSuggestions.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
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