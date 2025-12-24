'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, Clock, Hotel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { locationService, type LocationSuggestion } from '@/services/locationApi';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { text } from '@/styles/design-system';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { GridBackground } from '@/components/aceternity/GridBackground';
import PointerHighlight from '@/components/aceternity/PointerHighlight';

/**
 * AceternityHero - Premium hero section with Aceternity UI components
 *
 * Aceternity Components Used:
 * ✨ BackgroundBeams - Animated SVG beams flowing across the background
 * ✨ Spotlight - Dramatic spotlight effect on hero section
 * ✨ GridBackground - Subtle grid pattern for depth
 * ✨ PointerHighlight - Interactive pointer glow effect
 *
 * Design Features:
 * - Glassmorphism cards with backdrop blur
 * - Smooth micro-animations and transitions
 * - Premium color gradients (blue → violet → pink)
 * - Modern bento-style layout
 */

export default function AceternityHero() {
  const { t } = useHydratedTranslation();
  const { recentSearches, saveSearch } = useRecentSearches();
  const router = useRouter();

  // Form state
  const getDefaultCheckInDate = () => new Date().toISOString().split('T')[0];
  const getDefaultCheckOutDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
  const [locationModalPosition, setLocationModalPosition] = useState({ top: 0, left: 0 });
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);



  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!destination || !selectedLocationSuggestion) {
      setShowLocationSuggestions(false);
      setShowLocationTooltip(true);
      locationInputRef.current?.focus();
      setTimeout(() => setShowLocationTooltip(false), 3000);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert(t('hero.invalidDates', 'Check-out date must be after check-in date'));
      return;
    }

    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString(),
      acc_type: 'hotel'
    });

    if (selectedLocationSuggestion) {
      const locationParams = locationService.formatLocationForSearchAPI(selectedLocationSuggestion);
      Object.entries(locationParams).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
      saveSearch(selectedLocationSuggestion, checkIn, checkOut, adults, children, rooms);
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

  // Location search
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

  const calculateLocationPosition = () => {
    if (!locationInputRef.current) return;
    const rect = locationInputRef.current.getBoundingClientRect();
    const modalWidth = 400;
    const modalHeight = 400;
    const padding = 16;

    let top = rect.bottom + 8;
    let left = rect.left;

    if (left + modalWidth > window.innerWidth - padding) {
      left = window.innerWidth - modalWidth - padding;
    }
    if (left < padding) left = padding;
    if (top + modalHeight > window.innerHeight - padding) {
      top = rect.top - modalHeight - 8;
    }

    setLocationModalPosition({ top, left });
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setShowLocationSuggestions(false);
      setShowLocationTooltip(false);
    };

    if (showLocationSuggestions || showLocationTooltip) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
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
      case 'property': return <Hotel className="w-4 h-4 text-slate-900" />;
      default: return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <section className="relative min-h-[450px] py-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Aceternity Background Effects */}
      <GridBackground className="opacity-20" />
      <BackgroundBeams />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          {/* Typography with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">
              {t('hero.title', 'Зочид буудал хайх')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`${text.bodySm} text-slate-400 max-w-xl mx-auto`}
          >
            {t('hero.subtitle', 'Таны төгс амралт эндээс эхэлнэ')}
          </motion.p>
        </motion.div>

        {/* Glassmorphic Search Card with Aceternity Effects */}
        <PointerHighlight highlightColor="rgba(59, 130, 246, 0.15)">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            <div
              className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 group"
              style={{
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-500/0 via-violet-500/0 to-pink-500/0 group-hover:from-slate-500/10 group-hover:via-violet-500/10 group-hover:to-pink-500/10 transition-all duration-500 -z-10" />

              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                  {/* Location Input */}
                  <div ref={locationRef} className="lg:col-span-4 relative">
                    <div className="relative bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 transition-all duration-300 border border-white/10 hover:border-slate-400/40 group/input">
                      <label className={`${text.caption} text-slate-400 mb-2 block font-medium uppercase tracking-wide`}>
                        {t('search.location')}
                      </label>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
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
                          className="flex-1 bg-transparent text-white placeholder-slate-400 border-none outline-none text-base font-normal"
                          required
                        />
                        {destination && (
                          <button
                            type="button"
                            onClick={clearLocationSearch}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Location Error Tooltip */}
                    {showLocationTooltip && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg relative">
                          <div className="absolute -top-1 left-8 w-2 h-2 bg-red-500 transform rotate-45"></div>
                          <span>{t('search.selectLocation', 'Байршил сонгоно уу')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dates Input */}
                  <div className="lg:col-span-4">
                    <div className="relative bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 transition-all duration-300 border border-white/10 hover:border-violet-400/40">
                      <label className={`${text.caption} text-slate-400 mb-2 block font-medium uppercase tracking-wide`}>
                        {t('search.dates')}
                      </label>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-violet-400 flex-shrink-0" />
                        <div className="flex-1">
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

                  {/* Guests Input */}
                  <div className="lg:col-span-3">
                    <div className="relative bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl transition-all duration-300 border border-white/10 hover:border-pink-400/40 h-full">
                      <CustomGuestSelector
                        adults={adults}
                        childrenCount={children}
                        rooms={rooms}
                        onGuestChange={handleGuestChange}
                        className="h-full"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="lg:col-span-1 flex items-end">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full h-full min-h-[80px] bg-gradient-to-r from-slate-600 via-slate-600 to-violet-600 hover:from-slate-500 hover:via-slate-500 hover:to-violet-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
                    >
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">{t('search.searchButton', 'Хайх')}</span>
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </PointerHighlight>

      </div>

      {/* Location Suggestions Modal */}
      {showLocationSuggestions && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            ref={locationDropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-[100000] max-h-96 overflow-y-auto w-[400px] max-w-[90vw]"
            style={{
              top: Math.max(8, locationModalPosition.top),
              left: Math.max(8, Math.min(locationModalPosition.left, window.innerWidth - 416)),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Recent Searches */}
              {destination.length < 2 && recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className={`${text.caption} text-slate-400 mb-2 flex items-center gap-1 uppercase tracking-wide`}>
                    <Clock className="w-3 h-3" />
                    {t('search.recentSearches')}
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        onClick={() => handleLocationSelect(search.location)}
                        className="w-full flex items-center p-3 text-left hover:bg-slate-500/10 rounded-xl transition-all group border border-transparent hover:border-slate-500/30"
                      >
                        <div className="text-slate-400 mr-3">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className={`${text.bodySm} text-white group-hover:text-slate-300 font-medium`}>
                            {search.location.fullName}
                          </div>
                          <div className={`${text.caption} text-slate-400`}>
                            {search.checkIn} - {search.checkOut}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 my-3"></div>
                </div>
              )}

              {/* Search Results */}
              <div className={`${text.caption} text-slate-400 mb-2 uppercase tracking-wide`}>
                {destination.length < 2 ? t('search.popularLocations') : t('search.searchResults')}
              </div>

              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-1">
                  {locationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full flex items-center p-3 text-left hover:bg-slate-500/10 rounded-xl transition-all border border-transparent hover:border-slate-500/30"
                    >
                      <div className="mr-3">
                        {getLocationIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className={`${text.bodySm} text-white font-medium`}>
                          {suggestion.fullName}
                        </div>
                        <div className={`${text.caption} text-slate-400`}>
                          {suggestion.type === 'property' ? t('search.property') : t('search.hotelsCount', { count: suggestion.property_count })}
                        </div>
                      </div>
                    </button>
                  ))}
                  {locationSuggestions.length === 0 && (
                    <div className={`${text.bodySm} text-slate-400 text-center py-6`}>
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
    </section>
  );
}
