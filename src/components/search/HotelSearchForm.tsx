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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const finalCheckIn = checkIn || today;
    const finalCheckOut = checkOut || tomorrow;
    
    if (new Date(finalCheckOut) <= new Date(finalCheckIn)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    const params = new URLSearchParams({
      check_in: finalCheckIn,
      check_out: finalCheckOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString(),
      acc_type: 'hotel'
    });

    if (selectedLocationSuggestion) {
      const locationParams = locationService.formatLocationForSearchAPI(selectedLocationSuggestion);
      Object.entries(locationParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      saveSearch(selectedLocationSuggestion, finalCheckIn, finalCheckOut, adults, children, rooms);
    } else {
      params.append('location', destination);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handleLocationSearch = async (value: string) => {
    setDestination(value);
    setSelectedLocationSuggestion(null);
    
    if (value.length < 2) {
      setShowLocationSuggestions(false);
      return;
    }

    setShowLocationSuggestions(true);
    setIsLoadingSuggestions(true);
    
    try {
      const suggestions = await locationService.searchLocations(value);
      setLocationSuggestions(suggestions);
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

  const handleGuestChange = (newAdults: number, newChildren: number, newRooms: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
    setRooms(newRooms);
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
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-xl border border-blue-200/20 overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            
            {/* Location Input */}
            <div ref={locationRef} className="relative p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    {t('search.destination', 'Хаашаа')}
                  </label>
                  <input
                    ref={locationInputRef}
                    type="text"
                    value={destination}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    placeholder={t('search.destinationPlaceholder', 'Хот, дүүрэг оруулна уу')}
                    className="w-full text-base text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none font-medium"
                  />
                </div>
                {destination && (
                  <button
                    type="button"
                    onClick={clearLocationSearch}
                    className="text-gray-400 hover:text-gray-600 ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    {t('search.checkInOut', 'Хугацаа')}
                  </label>
                  <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onDateChange={(newCheckIn, newCheckOut) => {
                      setCheckIn(newCheckIn);
                      setCheckOut(newCheckOut);
                    }}
                    placeholder={t('search.selectDates', 'Огноо сонгох')}
                    minimal={true}
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="p-6 hover:bg-gray-50/50 transition-colors">
              <CustomGuestSelector
                adults={adults}
                childrenCount={children}
                rooms={rooms}
                onGuestChange={handleGuestChange}
              />
            </div>

            {/* Search Button */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
              >
                <Search className="w-6 h-6" />
                <span>{t('search.searchButton', 'Хайх')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

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
              top: locationRef.current ? locationRef.current.getBoundingClientRect().bottom + 8 : 0,
              left: locationRef.current ? locationRef.current.getBoundingClientRect().left : 0,
              width: locationRef.current ? locationRef.current.getBoundingClientRect().width : 300,
              minWidth: '300px',
            }}
          >
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">{t('search.searching', 'Хайж байна...')}</span>
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
                        {suggestion.type === 'property' ? (
                          <Hotel className="w-4 h-4 text-gray-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {suggestion.fullName}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-3">
                Хайлтын үр дүн олдсонгүй
              </div>
            )}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}