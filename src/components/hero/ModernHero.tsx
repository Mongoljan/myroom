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
import Tooltip from '@/components/common/Tooltip';

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
  const hasInitializedFromRecentSearches = useRef(false);
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
    console.log('Guest values updated:', { newAdults, newChildren, newRooms });
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
      case 'property': return <Hotel className="w-4 h-4 text-blue-900" />; // Hotel/Property
      case 'province': 
      case 'soum': 
      case 'district': 
      default: return <MapPin className="w-4 h-4 text-gray-500" />; // All locations
    }
  };

  return (
    <section className="relative min-h-[50vh] sm:min-h-[45vh] pt-5 lg:min-h-[35vh] bg-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[50vh]  sm:min-h-[45vh] lg:min-h-[35vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-lg overflow-hidden">
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
          className="absolute inset-0 opacity-40"
          style={{
            background: "linear-gradient(45deg, #1e293b, #0f172a, #1e40af, #312e81, #1e293b)",
            backgroundSize: "400% 400%"
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0, 1, 0],
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
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-l from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-radial from-blue-400/10 via-transparent to-transparent"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 35%, transparent 70%)"
        }}
      />

      <div className="relative z-10 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-3"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${TYPOGRAPHY.hero.title} text-white mb-3 leading-tight relative`}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block"
              >
                {t('hero.findPerfect', 'Төгс хүссэн')}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block relative"
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('hero.hotelStay', 'Зочид буудал')}
                </span>
              </motion.span>
            </motion.h1>
            
            {/* Subtitle with typewriter effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-gray-300"
              >
                {t('hero.discoverHotels', 'Дэлхий даяар шилдэг зочид буудлуудыг олж, шууд захиалаарай')}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* CSS for typewriter effect */}
          <style jsx>{`
            @keyframes typing {
              from { width: 0 }
              to { width: 100% }
            }
            @keyframes blink {
              0%, 50% { border-color: transparent }
              51%, 100% { border-color: #60a5fa }
            }
          `}</style>

          {/* Modern Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto"
            style={{ overflow: 'visible' }}
          >
            <motion.div 
              className="backdrop-blur-md bg-white/90 rounded-xl border border-gray-200 relative"
              style={{ 
                overflow: 'visible',
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
              }}
              whileHover={{ 
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                style={{
                  background: "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
                  padding: "1px",
                }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative bg-white/95 rounded-xl" style={{ overflow: 'visible' }}>
                <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200" style={{ overflow: 'visible' }}>
                
                {/* Location */}
                <div ref={locationRef} className="flex-1 p-4 w-full relative">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-gray-700 mr-4" />
                    <div className="flex-1">
                      {/* <div className={`${TYPOGRAPHY.form.label} text-gray-500  mb-1`}>{t('search.location')}</div> */}
                      <input
                        ref={locationInputRef}
                        type="text"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setSelectedLocationSuggestion(null); // Clear selected suggestion when user types
                          setShowLocationTooltip(false); // Hide tooltip when typing
                        }}
                        onFocus={() => {
                          calculateLocationPosition();
                          setShowLocationSuggestions(true);
                          setShowLocationTooltip(false);
                        }}
                        placeholder={t('search.locationPlaceholder')}
                        className={`w-full text-gray-900 placeholder-gray-400 border-none outline-none ${TYPOGRAPHY.form.input}`}
                        required
                      />
                    </div>
                    {destination && (
                      <button
                        onClick={clearLocationSearch}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Location Error Tooltip */}
                  {showLocationTooltip && (
                    <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
                      <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg relative">
                        <div className="absolute -top-1 left-8 w-2 h-2 bg-red-500 transform rotate-45"></div>
                        <span>{t('search.selectLocation', 'Очих газраа сонгоно уу')}</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && typeof window !== 'undefined' && createPortal(
                  <AnimatePresence>
                    <motion.div
                      ref={locationDropdownRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed bg-white rounded-xl border border-gray-200 z-[100000] max-h-96 overflow-y-auto w-[400px] max-w-[90vw]"
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
                              <div className={`${TYPOGRAPHY.body.caption} text-gray-500 mb-2 flex items-center`}>
                                <Clock className="w-3 h-3 mr-1" />
                                Сүүлийн хайлтууд
                              </div>
                              <div className="space-y-1">
                                {recentSearches.map((search) => (
                                  <button
                                    key={search.id}
                                    onClick={() => handleLocationSelect(search.location)}
                                    className="w-full flex items-center p-2 text-left hover:bg-blue-50/50 rounded-md transition-colors group border border-transparent hover:border-blue-200"
                                  >
                                    <div className="text-blue-900 mr-3">
                                      <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className={`${TYPOGRAPHY.modal.content} text-gray-900 group-hover:text-blue-900`}>
                                        {search.location.fullName}
                                      </div>
                                      <div className={`${TYPOGRAPHY.body.caption} text-gray-500`}>
                                        {search.checkIn} - {search.checkOut} • {search.guests.adults} том хүн, {search.guests.children} хүүхэд • {search.guests.rooms} өрөө
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <div className="border-t border-gray-100 my-3"></div>
                            </div>
                          )}

                          {/* Popular Locations / Search Results Section */}
                          <div className={`${TYPOGRAPHY.body.caption} text-gray-500 mb-2`}>
                            {destination.length < 2 ? 'Алдартай байршлууд' : 'Хайлтын үр дүн'}
                          </div>
                          
                          {isLoadingSuggestions ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {locationSuggestions.map((suggestion) => (
                                <button
                                  key={suggestion.id}
                                  onClick={() => handleLocationSelect(suggestion)}
                                  className="w-full flex items-center p-2 text-left hover:bg-blue-50/50 rounded-md transition-colors"
                                >
                                  <div className="mr-3">
                                    {getLocationIcon(suggestion.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`${TYPOGRAPHY.modal.content} text-gray-900`}>
                                      {suggestion.fullName}
                                    </div>
                                    <div className={`${TYPOGRAPHY.body.caption} text-gray-500`}>
                                      {suggestion.type === 'property' ? 'Зочид буудал' : `${suggestion.property_count} буудал`}
                                    </div>
                                  </div>
                                </button>
                              ))}
                              {locationSuggestions.length === 0 && !isLoadingSuggestions && (
                                <div className="text-sm text-gray-500 text-center py-3">
                                  Хайлтын үр дүн олдсонгүй
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
                <div className="lg:flex-1 p-4 w-full">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-gray-700 mr-4" style={{ stroke: '#374151', fill: 'none' }} />
                    <div className="flex-1">
                      {/* <div className={`${TYPOGRAPHY.form.label} text-gray-500 mb-1`}>{t('hero.checkInOut')}</div> */}
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
                      boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ 
                      boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.2)"
                    }}
                    className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <Search className="w-5 h-5 text-xl" />
                    <span className="hidden text-[18px] xl:inline font-semibold tracking-wide">{t('search.searchButton')}</span>
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