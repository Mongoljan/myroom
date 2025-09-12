'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomGuestSelector from './CustomGuestSelector';
import DateRangePicker from '@/components/common/DateRangePicker';
import SearchFormContainer from './SearchFormContainer';
import LocationInput from './LocationInput';
import LocationSuggestionsModal from './LocationSuggestionsModal';
import SearchButton from './SearchButton';
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

  const handleLocationFocus = () => {
    setShowLocationSuggestions(true);
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
        <SearchFormContainer>
          <form onSubmit={handleSearch}>
            <div 
              className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200" 
              style={{ overflow: 'visible' }}
            >
              {/* Location Input */}
              <div ref={locationRef}>
                <LocationInput
                  destination={destination}
                  locationInputRef={locationInputRef}
                  onLocationChange={handleLocationSearch}
                  onLocationClear={clearLocationSearch}
                  onLocationFocus={handleLocationFocus}
                />
              </div>

              {/* Date Range Picker */}
              <div className="lg:flex-1 p-4 w-full">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-gray-700 mr-4" />
                  <div className="flex-1">
                    <div className="relative z-[1]">
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
              </div>

              {/* Guests */}
              <div className="lg:flex-1 w-full relative z-[1]">
                <CustomGuestSelector
                  adults={adults}
                  childrenCount={children}
                  rooms={rooms}
                  onGuestChange={handleGuestChange}
                  className="relative z-[1]"
                />
              </div>

              {/* Search Button */}
              <SearchButton onClick={() => {}} />
            </div>
          </form>
        </SearchFormContainer>

        {/* Location Suggestions Modal */}
        <LocationSuggestionsModal
          isClient={isClient}
          showLocationSuggestions={showLocationSuggestions}
          locationDropdownRef={locationDropdownRef}
          locationRef={locationRef}
          destination={destination}
          recentSearches={recentSearches}
          isLoadingSuggestions={isLoadingSuggestions}
          locationSuggestions={locationSuggestions}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </div>
  );
}