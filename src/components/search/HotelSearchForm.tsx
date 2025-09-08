'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, Clock, Hotel } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomGuestSelector from './CustomGuestSelector';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { locationService, type LocationSuggestion } from '@/services/locationApi';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { TYPOGRAPHY } from '@/styles/containers';

export default function HotelSearchForm() {
  const { t } = useHydratedTranslation();
  const { recentSearches, saveSearch } = useRecentSearches();
  const urlSearchParams = useSearchParams();
  const router = useRouter();
  
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocationSuggestion, setSelectedLocationSuggestion] = useState<LocationSuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [locationModalPosition, setLocationModalPosition] = useState({ top: 0, left: 0 });
  
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load current search params from URL
  useEffect(() => {
    setDestination(urlSearchParams.get('location') || '');
    setCheckIn(urlSearchParams.get('check_in') || '');
    setCheckOut(urlSearchParams.get('check_out') || '');
    setAdults(parseInt(urlSearchParams.get('adults') || '2'));
    setChildren(parseInt(urlSearchParams.get('children') || '0'));
    setRooms(parseInt(urlSearchParams.get('rooms') || '1'));
  }, [urlSearchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Use default dates if none are provided
    const getDefaultCheckInDate = () => {
      return new Date().toISOString().split('T')[0]; // Today
    };

    const getDefaultCheckOutDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0]; // Tomorrow
    };

    const finalCheckIn = checkIn || getDefaultCheckInDate();
    const finalCheckOut = checkOut || getDefaultCheckOutDate();
    
    // Validate final dates
    if (new Date(finalCheckOut) <= new Date(finalCheckIn)) {
      alert(t('hero.invalidDates', 'Check-out date must be after check-in date'));
      return;
    }
    
    // Build search parameters with location data
    const params = new URLSearchParams({
      check_in: finalCheckIn,
      check_out: finalCheckOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString(),
      acc_type: 'hotel'
    });

    // Add location parameters based on selected suggestion
    if (selectedLocationSuggestion) {
      const locationParams = locationService.formatLocationForSearchAPI(selectedLocationSuggestion);
      Object.entries(locationParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      // Save this search for recent searches
      saveSearch({
        destination: selectedLocationSuggestion.name,
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
        guests: adults + children,
        rooms
      });
    } else if (destination) {
      // Fallback for basic text search
      params.append('location', destination);
      
      saveSearch({
        destination,
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
        guests: adults + children,
        rooms
      });
    }

    router.push(`/search?${params.toString()}`);
  };

  // Location search functionality
  const handleLocationSearch = async (query: string) => {
    setDestination(query);
    
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const suggestions = await locationService.searchLocations(query);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
      
      // Position the modal
      if (locationRef.current) {
        const rect = locationRef.current.getBoundingClientRect();
        setLocationModalPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
    } catch (error) {
      console.error('Location search failed:', error);
      setLocationSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setDestination(suggestion.name);
    setSelectedLocationSuggestion(suggestion);
    setShowLocationSuggestions(false);
  };

  const clearLocationSearch = () => {
    setDestination('');
    setSelectedLocationSuggestion(null);
    setShowLocationSuggestions(false);
    locationInputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node) &&
          locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mx-auto"
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-2 relative z-10"
            style={{ 
              overflow: 'visible',
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            }}
            whileHover={{ 
              borderColor: "rgba(59, 130, 246, 0.3)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <form onSubmit={handleSearch} className="relative z-[1]">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-0">
                
                {/* Location Input */}
                <div ref={locationRef} className="relative border-b lg:border-b-0 lg:border-r border-gray-100 last:border-r-0">
                  <div className="p-4 min-h-[72px] flex items-center">
                    <div className="flex items-center w-full">
                      <MapPin className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-900 mb-1">
                          {t('search.destination')}
                        </label>
                        <div className="relative">
                          <input
                            ref={locationInputRef}
                            type="text"
                            value={destination}
                            onChange={(e) => handleLocationSearch(e.target.value)}
                            placeholder={t('search.destinationPlaceholder')}
                            className="w-full text-sm text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none p-0"
                            autoComplete="off"
                          />
                          {destination && (
                            <button
                              type="button"
                              onClick={clearLocationSearch}
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Range Picker */}
                <div className="border-b lg:border-b-0 lg:border-r border-gray-100 last:border-r-0">
                  <div className="p-4 min-h-[72px] flex items-center">
                    <Calendar className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-medium text-gray-900 mb-1">
                        {t('search.checkInOut')}
                      </label>
                      <DateRangePicker
                        checkInDate={checkIn}
                        checkOutDate={checkOut}
                        onCheckInChange={setCheckIn}
                        onCheckOutChange={setCheckOut}
                        className="relative z-[1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Guest Selector */}
                <div className="border-b lg:border-b-0 lg:border-r border-gray-100 last:border-r-0">
                  <CustomGuestSelector
                    adults={adults}
                    childrenCount={children}
                    rooms={rooms}
                    onGuestChange={(newAdults, newChildren, newRooms) => {
                      setAdults(newAdults);
                      setChildren(newChildren);
                      setRooms(newRooms);
                    }}
                    className="relative z-[1]"
                  />
                </div>

                {/* Search Button */}
                <div className="p-4">
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ 
                      boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ 
                      boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.2)"
                    }}
                    className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm w-full lg:w-auto"
                  >
                    <Search className="w-5 h-5" />
                    <span className="font-semibold tracking-wide">{t('search.searchButton')}</span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Location Suggestions Modal - Portal */}
        {isClient && showLocationSuggestions && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            <motion.div
              ref={locationDropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto"
              style={{ 
                top: Math.max(8, locationModalPosition.top),
                left: Math.max(8, Math.min(locationModalPosition.left, window.innerWidth - 416)),
                width: Math.min(400, window.innerWidth - 16),
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
              }}
            >
              {isLoadingSuggestions ? (
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{t('search.searching')}</span>
                  </div>
                </div>
              ) : locationSuggestions.length > 0 ? (
                <div className="py-2">
                  {locationSuggestions.slice(0, 8).map((suggestion, index) => (
                    <motion.button
                      key={`${suggestion.type}-${suggestion.name}-${index}`}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center"
                      whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 mr-3">
                          {suggestion.type === 'destination' ? (
                            <MapPin className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Hotel className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.name}
                          </div>
                          {suggestion.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {suggestion.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {t('search.noResults')}
                </div>
              )}

              {/* Recent Searches */}
              {!isLoadingSuggestions && locationSuggestions.length === 0 && destination.length < 2 && recentSearches.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="p-3 bg-gray-50">
                    <div className="flex items-center text-xs font-medium text-gray-700">
                      <Clock className="w-3 h-3 mr-2" />
                      {t('search.recentSearches')}
                    </div>
                  </div>
                  <div className="py-2">
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDestination(search.destination);
                          setCheckIn(search.checkIn);
                          setCheckOut(search.checkOut);
                          setAdults(search.guests > search.rooms ? search.guests - search.rooms : search.guests);
                          setChildren(0);
                          setRooms(search.rooms);
                          setShowLocationSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-sm text-gray-900">{search.destination}</div>
                        <div className="text-xs text-gray-500">
                          {search.checkIn} - {search.checkOut} • {search.guests} guests • {search.rooms} room{search.rooms > 1 ? 's' : ''}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
}