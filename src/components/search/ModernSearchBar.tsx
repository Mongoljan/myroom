'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  X,
  Building
} from 'lucide-react';
import { TYPOGRAPHY } from '@/styles/containers';
import CustomGuestSelector from './CustomGuestSelector';
import { locationService, LocationSuggestion } from '@/services/locationApi';
import { hasCyrillic, hasLatin } from '@/utils/transliteration';

interface SearchData {
  location: string;
  selectedLocationSuggestion?: LocationSuggestion;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

// LocationSuggestion interface is now imported from the service

export default function ModernSearchBar() {
  const [searchData, setSearchData] = useState<SearchData>({
    location: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 1,
    rooms: 1
  });

  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<LocationSuggestion[]>([]);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      try {
        if (searchData.location.trim()) {
          const suggestions = await locationService.searchLocations(searchData.location);
          setFilteredSuggestions(suggestions);
        } else {
          const popularSuggestions = await locationService.getPopularLocations();
          setFilteredSuggestions(popularSuggestions);
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setFilteredSuggestions([]);
      }
    };

    fetchLocationSuggestions();
  }, [searchData.location]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSearchData(prev => ({ 
      ...prev, 
      location: suggestion.fullName,
      selectedLocationSuggestion: suggestion 
    }));
    setShowLocationSuggestions(false);
  };

  const handleGuestChange = (adults: number, children: number, rooms: number) => {
    setSearchData(prev => ({
      ...prev,
      adults,
      children,
      rooms
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      check_in: searchData.checkIn,
      check_out: searchData.checkOut,
      adults: searchData.adults.toString(),
      children: searchData.children.toString(),
      rooms: searchData.rooms.toString(),
      acc_type: 'hotel'
    });

    // Add location-specific parameters based on selected suggestion
    if (searchData.selectedLocationSuggestion) {
      const locationParams = locationService.formatLocationForSearchAPI(searchData.selectedLocationSuggestion);
      
      if (locationParams.name_id) {
        params.append('name_id', locationParams.name_id.toString());
      } else if (locationParams.name) {
        params.append('name', locationParams.name);
      } else {
        if (locationParams.province_id) params.append('province_id', locationParams.province_id.toString());
        if (locationParams.soum_id) params.append('soum_id', locationParams.soum_id.toString());
        if (locationParams.district) params.append('district', locationParams.district);
      }
    } else if (searchData.location) {
      // Fallback to text search if no suggestion was selected
      params.append('location', searchData.location);
    }

    window.location.href = `/search?${params.toString()}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getLocationIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'province': return <MapPin className="w-4 h-4" />;
      case 'soum': return <Building className="w-4 h-4" />;
      case 'district': return <MapPin className="w-4 h-4" />;
      case 'property': return <Building className="w-4 h-4 text-blue-500" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center divide-x divide-gray-200">
          
          {/* Location Input */}
          <div ref={locationRef} className="flex-1 relative">
            <div 
              className="flex items-center p-4 cursor-text"
              onClick={() => setShowLocationSuggestions(true)}
            >
              <MapPin className="w-5 h-5 text-gray-900 mr-3" />
              <div className="flex-1">
                <div className={`${TYPOGRAPHY.form.label} text-gray-900 mb-1`}>Location</div>
                <input
                  type="text"
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                  onFocus={() => setShowLocationSuggestions(true)}
                  placeholder="Where are you going?"
                  className={`w-full ${TYPOGRAPHY.form.input} text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent`}
                />
              </div>
              {searchData.location && (
                <button
                  onClick={() => setSearchData(prev => ({ ...prev, location: '' }))}
                  className="text-gray-900 hover:text-gray-800 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Suggestions Dropdown */}
            <AnimatePresence>
              {showLocationSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 mt-2 max-h-80 overflow-y-auto"
                >
                  <div className="p-4">
                    <div className={`${TYPOGRAPHY.form.label} text-gray-900 mb-3`}>
                      {searchData.location ? (
                        <div className="flex flex-col gap-1">
                          <span>Search results</span>
                          {(hasCyrillic(searchData.location) || hasLatin(searchData.location)) && (
                            <span className="text-xs text-blue-600">
                              Including transliteration matches
                            </span>
                          )}
                        </div>
                      ) : (
                        'Popular destinations'
                      )}
                    </div>
                    <div className="space-y-1">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleLocationSelect(suggestion)}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="text-gray-900 mr-3">
                            {getLocationIcon(suggestion.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`${TYPOGRAPHY.body.standard} text-gray-900`}>
                                {suggestion.name}
                              </span>
                              {suggestion.searchScore && suggestion.searchScore >= 90 && (
                                <span className="w-2 h-2 bg-green-500 rounded-full" title="Exact match"></span>
                              )}
                              {suggestion.property_count > 0 && (
                                <span className={`${TYPOGRAPHY.body.caption} text-blue-600`}>
                                  ({suggestion.property_count} зочид буудал)
                                </span>
                              )}
                            </div>
                            <div className={`${TYPOGRAPHY.body.caption} text-gray-900`}>
                              {suggestion.fullName}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Range Picker */}
          <div ref={dateRef} className="relative">
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-gray-900 mr-3" />
              <div>
                <div className={`${TYPOGRAPHY.form.label} text-gray-900 mb-1`}>Check in - Check out</div>
                <div className={`${TYPOGRAPHY.body.standard} text-gray-900`}>
                  {searchData.checkIn && searchData.checkOut 
                    ? `${formatDate(searchData.checkIn)} - ${formatDate(searchData.checkOut)}`
                    : 'August 15 - September 14'
                  }
                </div>
              </div>
            </button>

            {/* Date Picker Modal */}
            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowDatePicker(false)}
                >
                  <div 
                    className="bg-white rounded-2xl p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`${TYPOGRAPHY.heading.h3} text-gray-900`}>Select Dates</h3>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-gray-900 hover:text-gray-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={`block ${TYPOGRAPHY.form.label} text-gray-900 mb-2`}>
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          value={searchData.checkIn}
                          onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                          className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${TYPOGRAPHY.form.input}`}
                        />
                      </div>
                      <div>
                        <label className={`block ${TYPOGRAPHY.form.label} text-gray-900 mb-2`}>
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={searchData.checkOut}
                          onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                          className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${TYPOGRAPHY.form.input}`}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors ${TYPOGRAPHY.button.standard}`}
                    >
                      Apply Dates
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guest Selector */}
          <div className="relative">
            <CustomGuestSelector
              adults={searchData.adults}
              childrenCount={searchData.children}
              rooms={searchData.rooms}
              onGuestChange={handleGuestChange}
              className="border-none"
            />
          </div>

          {/* Search Button */}
          <div className="p-2">
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}