'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { locationService, type LocationSuggestion } from '@/services/locationApi';
import { TYPOGRAPHY } from '@/styles/containers';

export default function ModernHero() {
  const { t } = useHydratedTranslation();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocationSuggestion, setSelectedLocationSuggestion] = useState<LocationSuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const locationRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setDestination(suggestion.fullName);
    setSelectedLocationSuggestion(suggestion);
    setShowLocationSuggestions(false);
  };

  const getLocationIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'soum': return <Building className="w-4 h-4" />;
      case 'district': return <MapPin className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative min-h-[60vh] sm:min-h-[50vh] lg:min-h-[40vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
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
              className="backdrop-blur-md bg-white/90 rounded-xl shadow-xl relative border border-white/20"
              style={{ overflow: 'visible' }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
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
                      <div className={`${TYPOGRAPHY.form.label} text-gray-500  mb-1`}>{t('search.location')}</div>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setSelectedLocationSuggestion(null); // Clear selected suggestion when user types
                        }}
                        onFocus={() => setShowLocationSuggestions(true)}
                        placeholder={t('search.locationPlaceholder')}
                        className={`w-full text-gray-900 placeholder-gray-400 border-none outline-none ${TYPOGRAPHY.form.input}`}
                        required
                      />
                    </div>
                    {destination && (
                      <button
                        onClick={() => setDestination('')}
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
                        className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-100 z-[999999] mt-2 max-h-64 overflow-y-auto"
                      >
                        <div className="p-3">
                          <div className={`${TYPOGRAPHY.body.caption} text-gray-500 mb-2`}>
                            {destination.length < 2 ? 'Алдартай газрууд' : 'Хайлтын үр дүн'}
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
                                  className="w-full flex items-center p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                                >
                                  <div className="text-gray-400 mr-3">
                                    {getLocationIcon(suggestion.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`${TYPOGRAPHY.modal.content} text-gray-900`}>
                                      {suggestion.fullName}
                                    </div>
                                    <div className={`${TYPOGRAPHY.body.caption} text-gray-500`}>
                                      {suggestion.property_count} буудал
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
                    )}
                  </AnimatePresence>
                </div>

                {/* Check-in Check-out */}
                <div className="lg:flex-1 p-4 w-full">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-gray-700 mr-4" style={{ stroke: '#374151', fill: 'none' }} />
                    <div className="flex-1">
                      <div className={`${TYPOGRAPHY.form.label} text-gray-500 mb-1`}>{t('hero.checkInOut')}</div>
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium text-sm"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden xl:inline font-semibold tracking-wide">{t('search.searchButton')}</span>
                  </motion.button>
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}