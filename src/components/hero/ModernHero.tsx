'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, Clock, Hotel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { locationService, type LocationSuggestion } from '@/services/locationApi';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { TYPOGRAPHY } from '@/styles/containers';

export default function ModernHero() {
  const { t } = useHydratedTranslation();
  const { recentSearches, saveSearch } = useRecentSearches();

  // Helper functions for default dates
  const getDefaultCheckInDate = () => {
    return new Date().toISOString().split('T')[0]; // Today
  };

  const getDefaultCheckOutDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Tomorrow
  };

  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState(getDefaultCheckInDate());
  const [checkOut, setCheckOut] = useState(getDefaultCheckOutDate());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocationSuggestion, setSelectedLocationSuggestion] = useState<LocationSuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [locationModalPosition, setLocationModalPosition] = useState({ top: 0, left: 0 });
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);
  const router = useRouter();
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Only render particles on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create deterministic particle positions
  const particles = useMemo(() => {
    if (!isClient) return [];
    
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: seededRandom(i * 123.456) * 100,
      top: seededRandom(i * 789.012) * 100,
      duration: 10 + seededRandom(i * 345.678) * 10,
      delay: seededRandom(i * 901.234) * 5,
      xOffset: seededRandom(i * 567.890) * 50 - 25,
    }));
  }, [isClient]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validate location selection - block search if no location
    if (!destination || !selectedLocationSuggestion) {
      // Close location suggestions modal first, then show tooltip
      setShowLocationSuggestions(false);
      setShowLocationTooltip(true);
      locationInputRef.current?.focus();
      // Hide tooltip after 3 seconds
      setTimeout(() => setShowLocationTooltip(false), 3000);
      return;
    }

    // Use current state values (already have defaults)
    const finalCheckIn = checkIn;
    const finalCheckOut = checkOut;

    // Validate dates
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
      
      // Save to recent searches
      saveSearch(selectedLocationSuggestion, finalCheckIn, finalCheckOut, adults, children, rooms);
    } else {
      // Fallback to simple location string
      params.append('location', destination);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handleGuestChange = (newAdults: number, newChildren: number, newRooms: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
    setRooms(newRooms);
  };

  // Debounced location search
  useEffect(() => {
    const searchLocations = async () => {
      if (destination.length < 2) {
        const popular = await locationService.getPopularLocations();
        setLocationSuggestions(popular);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const suggestions = await locationService.searchLocations(destination);
        setLocationSuggestions(suggestions);
      } catch (error) {
        console.error('Error searching locations:', error);
        setLocationSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [destination]);

  // Load popular locations on mount
  useEffect(() => {
    const loadPopular = async () => {
      try {
        const popular = await locationService.getPopularLocations();
        setLocationSuggestions(popular);
      } catch (error) {
        console.error('Error loading popular locations:', error);
      }
    };
    loadPopular();
  }, []);

  // Calculate location modal position
  const calculateLocationPosition = () => {
    if (!locationInputRef.current) return;
    
    const rect = locationInputRef.current.getBoundingClientRect();
    const modalWidth = 400;
    const modalHeight = 400;
    const padding = 16;
    
    let top = rect.bottom + 8;
    let left = rect.left;
    
    // Adjust if modal would go off screen right
    if (left + modalWidth > window.innerWidth - padding) {
      left = window.innerWidth - modalWidth - padding;
    }
    
    // Adjust if modal would go off screen left
    if (left < padding) {
      left = padding;
    }
    
    // Adjust if modal would go off screen bottom
    if (top + modalHeight > window.innerHeight - padding) {
      top = rect.top - modalHeight - 8;
    }
    
    setLocationModalPosition({ top, left });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    if (showLocationSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLocationSuggestions]);

  // Close all modals when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowLocationSuggestions(false);
      setShowLocationTooltip(false);
      // This will also close date picker and guest selector modals via their own scroll handlers
    };

    if (showLocationSuggestions || showLocationTooltip) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showLocationSuggestions, showLocationTooltip]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setDestination(suggestion.fullName);
    setSelectedLocationSuggestion(suggestion);
    setShowLocationSuggestions(false);
    setShowLocationTooltip(false);
  };

  const clearLocationSearch = () => {
    setDestination('');
    setSelectedLocationSuggestion(null);
    setShowLocationSuggestions(false);
    setShowLocationTooltip(false);
    locationInputRef.current?.focus();
  };

  const getLocationIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'property': return <Hotel className="w-4 h-4 text-slate-900" />; // Hotel/Property
      case 'province': 
      case 'soum': 
      case 'district': 
      default: return <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />; // All locations
    }
  };

  return (
    <section className="relative pt-6 lg:min-h-[35vh] bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-50"
          style={{
            background: "linear-gradient(45deg, #3b82f6, #2563eb, #1e40af, #1d4ed8, #3b82f6)",
            backgroundSize: "400% 400%"
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-30"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Grid Pattern with Animation */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 150, -100, 0],
            y: [0, -80, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/25 to-blue-500/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 90, -60, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-l from-blue-500/25 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, -90, 0],
            y: [0, -120, 40, 0],
            scale: [1, 0.7, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-blue-600/25 rounded-full blur-3xl"
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 35%, transparent 70%)"
        }}
      />

      <div className="relative z-10 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${TYPOGRAPHY.hero.title} text-white mb-6 leading-tight relative`}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block relative"
              >
                <span className="">
                  {t('hero.hotelStay')}
                </span>
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Modern Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto"
            style={{ overflow: 'visible' }}
          >
            <motion.div
              className="backdrop-blur-md bg-white/95 dark:bg-gray-800/95 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 relative transition-[border-color,box-shadow] duration-300 hover:border-blue-400/60 dark:hover:border-blue-500/60 hover:shadow-[0_20px_25px_-5px_rgba(59,130,246,0.15),0_10px_10px_-5px_rgba(59,130,246,0.08)]"
              style={{
                overflow: 'visible',
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
              }}
            >

              <div className="relative bg-white dark:bg-gray-800 rounded-2xl" style={{ overflow: 'visible' }}>
                <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200" style={{ overflow: 'visible' }}>
                
                {/* Location - Enhanced with modern styling */}
                <div
                  ref={locationRef}
                  className="flex-1 p-5 w-full relative group hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors duration-200 rounded-l-2xl"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <MapPin className="w-6 h-6 text-slate-900" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('search.location', 'Газар')}</div>
                      <input
                        ref={locationInputRef}
                        type="text"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setSelectedLocationSuggestion(null);
                          setShowLocationTooltip(false);
                        }}
                        onFocus={() => {
                          calculateLocationPosition();
                          setShowLocationSuggestions(true);
                          setShowLocationTooltip(false);
                        }}
                        placeholder={t('search.locationPlaceholder', 'Хаана байрлах вэ?')}
                        className="w-full text-base font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-none outline-none bg-transparent"
                        required
                      />
                    </div>
                    {destination && (
                      <motion.button
                        onClick={clearLocationSearch}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  {/* Location Error Tooltip */}
                  <AnimatePresence>
                    {showLocationTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 mt-2 z-40"
                      >
                        <div className="bg-red-500 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg relative">
                          <div className="absolute -top-1 left-8 w-2 h-2 bg-red-500 transform rotate-45"></div>
                          <span>{t('search.selectLocation', 'Газраа сонгоно уу')}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && typeof window !== 'undefined' && createPortal(
                  <AnimatePresence>
                    <motion.div
                      ref={locationDropdownRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 z-40 max-h-96 overflow-y-auto w-[400px] max-w-[90vw]"
                      style={{ 
                        top: Math.max(8, locationModalPosition.top),
                        left: Math.max(8, Math.min(locationModalPosition.left, window.innerWidth - 416)),
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4">
                          {/* Recent Searches Section */}
                          {destination.length < 2 && recentSearches.length > 0 && (
                            <div className="mb-4">
                              <div className={`${TYPOGRAPHY.body.caption} text-gray-500 dark:text-gray-400 mb-2 flex items-center`}>
                                <Clock className="w-3 h-3 mr-1" />
                                {t('search.recentSearches')}
                              </div>
                              <div className="space-y-1">
                                {recentSearches.map((search) => (
                                  <button
                                    key={search.id}
                                    onClick={() => handleLocationSelect(search.location)}
                                    className="w-full flex items-center p-2 text-left hover:bg-slate-50/50 rounded-md transition-colors group border border-transparent hover:border-slate-200"
                                  >
                                    <div className="text-slate-900 mr-3">
                                      <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className={`${TYPOGRAPHY.modal.content} text-gray-900 dark:text-white group-hover:text-slate-900`}>
                                        {search.location.fullName}
                                      </div>
                                      <div className={`${TYPOGRAPHY.body.caption} text-gray-500 dark:text-gray-400`}>
                                        {search.checkIn} - {search.checkOut} • {search.guests.adults} {t('search.adults').toLowerCase()}, {search.guests.children} {t('search.children').toLowerCase()} • {search.guests.rooms} {t('search.rooms').toLowerCase()}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>
                            </div>
                          )}

                          {/* Popular Locations / Search Results Section */}
                          <div className={`${TYPOGRAPHY.body.caption} text-gray-500 dark:text-gray-400 mb-2`}>
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
                                  onClick={() => handleLocationSelect(suggestion)}
                                  className="w-full flex items-center p-2 text-left hover:bg-slate-50/50 rounded-md transition-colors"
                                >
                                  <div className="mr-3">
                                    {getLocationIcon(suggestion.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`${TYPOGRAPHY.modal.content} text-gray-900 dark:text-white`}>
                                      {suggestion.fullName}
                                    </div>
                                    <div className={`${TYPOGRAPHY.body.caption} text-gray-500 dark:text-gray-400`}>
                                      {suggestion.type === 'property' ? t('search.property') : t('search.hotelsCount', { count: suggestion.property_count })}
                                    </div>
                                  </div>
                                </button>
                              ))}
                              {locationSuggestions.length === 0 && !isLoadingSuggestions && (
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
                )}

                {/* Check-in Check-out */}
                <div className="lg:flex-1 p-5 w-full hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Calendar className="w-6 h-6 text-slate-900" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('hero.checkInOut', 'Огноо')}</div>
                      <div className="relative z-[1]">
                        <DateRangePicker
                          checkIn={checkIn}
                          checkOut={checkOut}
                          onDateChange={(newCheckIn, newCheckOut) => {
                            setCheckIn(newCheckIn);
                            setCheckOut(newCheckOut);
                          }}
                          placeholder={t('search.selectDates', 'Check in - Check out')}
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
                <div className="p-4">
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 16px -4px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{
                      scale: 0.98,
                      boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.2)"
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg shadow-blue-600/30"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden text-base xl:inline tracking-wide">{t('search.searchButton', 'Хайх')}</span>
                  </motion.button>
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
        </div>
      </div>
    </section>
  );
}