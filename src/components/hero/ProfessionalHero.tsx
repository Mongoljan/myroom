'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { locationService, type LocationSuggestion } from '@/services/locationApi';

// Utility functions for default dates
const getDefaultCheckInDate = () => {
  return new Date().toISOString().split('T')[0]; // Today
};

const getDefaultCheckOutDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0]; // Tomorrow
};

export default function ProfessionalHero() {
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Subtle floating elements for professional feel
  const floatingElements = useMemo(() => {
    if (!isClient) return [];
    
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: seededRandom(i * 47.321) * 100,
      top: seededRandom(i * 83.456) * 100,
      duration: 15 + seededRandom(i * 125.789) * 10,
      delay: seededRandom(i * 234.567) * 8,
      size: 2 + seededRandom(i * 456.789) * 4,
    }));
  }, [isClient]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Use default dates if none are provided
    const finalCheckIn = checkIn || getDefaultCheckInDate();
    const finalCheckOut = checkOut || getDefaultCheckOutDate();
    
    if (new Date(finalCheckOut) <= new Date(finalCheckIn)) {
      alert(t('hero.invalidDates', 'Check-out date must be after check-in date'));
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
    } else {
      params.append('location', destination);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handleGuestChange = (newAdults: number, newChildren: number, newRooms: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
    setRooms(newRooms);
  };

  // Location search logic
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
    <section className="relative min-h-[65vh] bg-gradient-to-b from-slate-50 via-white to-gray-50 overflow-hidden">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Professional floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-slate-200/40"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Subtle radial gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.08) 0%, transparent 50%)"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Professional Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-6 tracking-tight"
            >
              <span className="block">
                {t('hero.findPerfect', 'Найдаарай')}
              </span>
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block font-medium text-slate-700"
              >
                {t('hero.hotelStay', 'төгс зочид буудал')}
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light"
            >
              {t('hero.discoverHotels', 'Дэлхий даяар шилдэг зочид буудлуудыг олж, шууд захиалаарай')}
            </motion.p>
          </motion.div>

          {/* Professional Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/60 relative overflow-visible"
              whileHover={{ 
                boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.12)"
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Subtle accent line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full" />
              
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 space-y-4 lg:space-y-0">
                
                  {/* Location */}
                  <div ref={locationRef} className="flex-1 relative">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('search.location', 'Газар')}
                      </label>
                      <div className="flex items-center px-4 py-3 border border-slate-200 rounded-xl group-hover:border-slate-300 transition-colors bg-white/70">
                        <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => {
                            setDestination(e.target.value);
                            setSelectedLocationSuggestion(null);
                          }}
                          onFocus={() => setShowLocationSuggestions(true)}
                          placeholder={t('search.locationPlaceholder', 'Хаана явах вэ?')}
                          className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400"
                          required
                        />
                        {destination && (
                          <button
                            onClick={() => setDestination('')}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Location Suggestions Dropdown */}
                    <AnimatePresence>
                      {showLocationSuggestions && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 z-50 mt-2 max-h-64 overflow-y-auto"
                        >
                          <div className="p-3">
                            <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                              {destination.length < 2 ? 'Алдартай байршлууд' : 'Хайлтын үр дүн'}
                            </div>
                            
                            {isLoadingSuggestions ? (
                              <div className="flex items-center justify-center py-4">
                                <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {locationSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion.id}
                                    onClick={() => handleLocationSelect(suggestion)}
                                    className="w-full flex items-center p-3 text-left hover:bg-slate-50 rounded-lg transition-colors group"
                                  >
                                    <div className="text-slate-400 mr-3 group-hover:text-slate-600 transition-colors">
                                      {getLocationIcon(suggestion.type)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-slate-900 group-hover:text-slate-700">
                                        {suggestion.fullName}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {suggestion.property_count} буудал
                                      </div>
                                    </div>
                                  </button>
                                ))}
                                {locationSuggestions.length === 0 && !isLoadingSuggestions && (
                                  <div className="text-sm text-slate-500 text-center py-4">
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

                  {/* Dates */}
                  <div className="flex-1">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('hero.checkInOut', 'Огноо')}
                      </label>
                      <div className="border border-slate-200 rounded-xl group-hover:border-slate-300 transition-colors bg-white/70 overflow-hidden">
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
                  <div className="flex-1">
                    <CustomGuestSelector
                      adults={adults}
                      childrenCount={children}
                      rooms={rooms}
                      onGuestChange={handleGuestChange}
                      className="h-full"
                    />
                  </div>

                  {/* Search Button */}
                  <div className="lg:w-auto">
                    <motion.button
                      onClick={handleSearch}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full lg:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl font-medium"
                    >
                      <Search className="w-5 h-5 text-xl" />
                      <span>{t('search.searchButton', 'Хайх')}</span>
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