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

interface HotelSearchFormProps {
  compact?: boolean;
}

export default function HotelSearchForm({ compact = false }: HotelSearchFormProps) {
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
  const [showLocationError, setShowLocationError] = useState(false);
  const hasLoadedFromUrl = useRef(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load search params from URL
  useEffect(() => {
    // Always update date/guest params
    setCheckIn(urlSearchParams.get('check_in') || '');
    setCheckOut(urlSearchParams.get('check_out') || '');
    setAdults(parseInt(urlSearchParams.get('adults') || '2'));
    setChildren(parseInt(urlSearchParams.get('children') || '0'));
    setRooms(parseInt(urlSearchParams.get('rooms') || '1'));

    // Only load location from URL once to prevent interference with user typing
    if (!hasLoadedFromUrl.current) {
      const loadLocationFromUrl = async () => {
        const locationParam = urlSearchParams.get('location');
        const nameParam = urlSearchParams.get('name');
        const nameIdParam = urlSearchParams.get('name_id');
        const provinceIdParam = urlSearchParams.get('province_id');
        const soumIdParam = urlSearchParams.get('soum_id');
        const districtParam = urlSearchParams.get('district');

        // Set destination based on available URL parameters
        if (nameParam) {
          setDestination(nameParam);
        } else if (locationParam) {
          setDestination(locationParam);
        } else if (districtParam) {
          setDestination(districtParam);
        } else if (provinceIdParam || soumIdParam || nameIdParam) {
          // For ID-based searches, fetch the actual location name
          try {
            if (provinceIdParam) {
              const provinceId = parseInt(provinceIdParam);
              const provinceSuggestion = await locationService.getLocationById('province', provinceId);
              
              if (provinceSuggestion) {
                setDestination(provinceSuggestion.name);
                setSelectedLocationSuggestion(provinceSuggestion);
              }
            } else if (soumIdParam) {
              const soumId = parseInt(soumIdParam);
              const soumSuggestion = await locationService.getLocationById('soum', soumId);
              
              if (soumSuggestion) {
                setDestination(soumSuggestion.fullName);
                setSelectedLocationSuggestion(soumSuggestion);
              }
            }
            // For nameIdParam (property/hotel), we would need a different API
            // Leave empty for now - user can re-search
          } catch (error) {
            console.error('Failed to load location from URL params:', error);
            setDestination('');
          }
        }
      };

      loadLocationFromUrl();
      hasLoadedFromUrl.current = true;
    }
  }, [urlSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('HotelSearchForm - handleSearch called');
    console.log('HotelSearchForm - Current destination:', destination);
    console.log('HotelSearchForm - Current selectedLocationSuggestion:', selectedLocationSuggestion);

    // Validate location selection - block search if no location
    if (!destination || !selectedLocationSuggestion) {
      setShowLocationError(true);
      locationInputRef.current?.focus();
      // Hide error after 3 seconds
      setTimeout(() => setShowLocationError(false), 3000);
      return; // Block search
    }

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
      console.log('HotelSearchForm - Selected suggestion:', selectedLocationSuggestion);
      console.log('HotelSearchForm - Location params to append:', locationParams);

      Object.entries(locationParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
          console.log(`HotelSearchForm - Appending ${key}=${value}`);
        }
      });
      saveSearch(selectedLocationSuggestion, finalCheckIn, finalCheckOut, adults, children, rooms);
    } else if (destination) {
      console.log('HotelSearchForm - No selectedLocationSuggestion, using destination text:', destination);
      params.append('location', destination);
    }

    const finalUrl = `/search?${params.toString()}`;
    console.log('HotelSearchForm - Final URL:', finalUrl);
    console.log('HotelSearchForm - URL params:', params.toString());
    router.push(finalUrl);
  };

  const handleLocationSearch = async (value: string) => {
    setDestination(value);

    // Always clear selectedLocationSuggestion when user types to allow free editing
    if (selectedLocationSuggestion) {
      console.log('HotelSearchForm - Clearing selectedLocationSuggestion because user is typing');
      setSelectedLocationSuggestion(null);
    }

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
    console.log('HotelSearchForm - handleLocationSelect called with:', suggestion);
    // For properties/hotels, show the full name, for locations show formatted name
    const displayName = suggestion.type === 'property' ? suggestion.name : suggestion.fullName;
    setDestination(displayName);
    setSelectedLocationSuggestion(suggestion);
    console.log('HotelSearchForm - selectedLocationSuggestion set to:', suggestion);
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
    setShowLocationError(false);
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
      <div className={compact ? 'w-full' : 'max-w-7xl mx-auto relative'}>
        <SearchFormContainer compact={compact}>
          <form onSubmit={handleSearch}>
            <div 
              className={`flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 ${compact ? '' : 'lg:divide-x divide-gray-200'}`}
              style={{ overflow: 'visible' }}
            >
              {/* Location Input */}
              <div ref={locationRef} className="relative">
                <LocationInput
                  destination={destination}
                  locationInputRef={locationInputRef}
                  onLocationChange={handleLocationSearch}
                  onLocationClear={clearLocationSearch}
                  onLocationFocus={handleLocationFocus}
                  compact={compact}
                />
                {/* Location Error Tooltip */}
                {showLocationError && (
                  <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
                    <div className="bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-g relative">
                      <div className="absolute -top-1 left-8 w-2 h-2 bg-red-500 transform rotate-45"></div>
                      <span>{t('search.selectLocation')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range Picker */}
              <div className={`lg:flex-1 ${compact ? 'p-2' : 'p-4'} w-full`}>
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
                        placeholder={t('search.selectDates')}
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
                  compact={compact}
                />
              </div>

              {/* Search Button (submit triggers form onSubmit) */}
              <SearchButton />
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