'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  X,
  Star,
  Building
} from 'lucide-react';
import CustomGuestSelector from './CustomGuestSelector';

interface SearchData {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'city' | 'hotel' | 'landmark';
  location: string;
  popular?: boolean;
}

const mockLocationSuggestions: LocationSuggestion[] = [
  { id: '1', name: 'London', type: 'city', location: 'United Kingdom', popular: true },
  { id: '2', name: 'The Montcalm At Brewery London City', type: 'hotel', location: 'Westminster Borough, London' },
  { id: '3', name: 'Barcelona', type: 'city', location: 'Spain', popular: true },
  { id: '4', name: 'Ciutat Vella', type: 'landmark', location: 'Barcelona, Spain' },
  { id: '5', name: 'New York', type: 'city', location: 'United States', popular: true },
];

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
    if (searchData.location.trim()) {
      const filtered = mockLocationSuggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(searchData.location.toLowerCase()) ||
        suggestion.location.toLowerCase().includes(searchData.location.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(mockLocationSuggestions.filter(s => s.popular));
    }
  }, [searchData.location]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSearchData(prev => ({ ...prev, location: suggestion.name }));
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
      location: searchData.location,
      check_in: searchData.checkIn,
      check_out: searchData.checkOut,
      adults: searchData.adults.toString(),
      children: searchData.children.toString(),
      rooms: searchData.rooms.toString(),
    });
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
      case 'hotel': return <Building className="w-4 h-4" />;
      case 'landmark': return <MapPin className="w-4 h-4" />;
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
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                <input
                  type="text"
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                  onFocus={() => setShowLocationSuggestions(true)}
                  placeholder="Where are you going?"
                  className="w-full text-sm text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
              </div>
              {searchData.location && (
                <button
                  onClick={() => setSearchData(prev => ({ ...prev, location: '' }))}
                  className="text-gray-400 hover:text-gray-600 ml-2"
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
                    <div className="text-xs font-medium text-gray-500 mb-3">
                      {searchData.location ? 'Search results' : 'Popular destinations'}
                    </div>
                    <div className="space-y-1">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleLocationSelect(suggestion)}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="text-gray-400 mr-3">
                            {getLocationIcon(suggestion.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {suggestion.name}
                              </span>
                              {suggestion.popular && (
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {suggestion.location}
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
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Check in - Check out</div>
                <div className="text-sm text-gray-900">
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
                      <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          value={searchData.checkIn}
                          onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={searchData.checkOut}
                          onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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