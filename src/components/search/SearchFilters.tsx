'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Star, Wifi, Car, Utensils, Users, Dumbbell, Waves, 
  Building, Clock, X, ChevronDown, SlidersHorizontal 
} from 'lucide-react';

interface FilterState {
  priceRange: [number, number];
  starRating: number[];
  facilities: string[];
  roomTypes: string[];
}

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  embedded?: boolean;
}

const PRICE_RANGES = [
  { label: '< 100K', min: 0, max: 100000 },
  { label: '100K - 300K', min: 100000, max: 300000 },
  { label: '300K - 500K', min: 300000, max: 500000 },
  { label: '> 500K', min: 500000, max: 1000000 },
] as const;

const FACILITIES = [
  { id: 'wifi', label: 'Free Wi-Fi', icon: Wifi, count: 245 },
  { id: 'parking', label: 'Parking', icon: Car, count: 189 },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils, count: 156 },
  { id: 'pool', label: 'Pool', icon: Waves, count: 78 },
  { id: 'gym', label: 'Fitness Center', icon: Dumbbell, count: 134 },
  { id: 'spa', label: 'Spa', icon: Users, count: 89 },
  { id: 'business', label: 'Business Center', icon: Building, count: 167 },
  { id: '24h', label: '24h Front Desk', icon: Clock, count: 203 },
] as const;

const ROOM_TYPES = [
  'Standard Room',
  'Deluxe Room', 
  'Suite',
  'Family Room',
  'Presidential Suite'
] as const;

export default function SearchFilters({ isOpen, onClose, onFilterChange, embedded = false }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [50000, 500000],
    starRating: [],
    facilities: [],
    roomTypes: []
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    facilities: true,
    rooms: true
  });

  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('mn-MN').format(price);
  }, []);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  }, [filters, onFilterChange]);

  const toggleStarRating = useCallback((star: number) => {
    const newRatings = filters.starRating.includes(star)
      ? filters.starRating.filter(s => s !== star)
      : [...filters.starRating, star].sort((a, b) => b - a);
    updateFilters({ starRating: newRatings });
  }, [filters.starRating, updateFilters]);

  const toggleFacility = useCallback((facilityId: string) => {
    const newFacilities = filters.facilities.includes(facilityId)
      ? filters.facilities.filter(f => f !== facilityId)
      : [...filters.facilities, facilityId];
    updateFilters({ facilities: newFacilities });
  }, [filters.facilities, updateFilters]);

  const toggleRoomType = useCallback((roomType: string) => {
    const newRoomTypes = filters.roomTypes.includes(roomType)
      ? filters.roomTypes.filter(r => r !== roomType)
      : [...filters.roomTypes, roomType];
    updateFilters({ roomTypes: newRoomTypes });
  }, [filters.roomTypes, updateFilters]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      priceRange: [50000, 500000] as [number, number],
      starRating: [],
      facilities: [],
      roomTypes: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const activeFilterCount = useMemo(() => {
    return filters.starRating.length + filters.facilities.length + filters.roomTypes.length;
  }, [filters]);

  const FilterHeader = ({ title, count, section }: { 
    title: string; 
    count?: number; 
    section: keyof typeof expandedSections;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        {count && count > 0 && (
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <ChevronDown 
        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
          expandedSections[section] ? 'rotate-180' : ''
        }`}
      />
    </button>
  );

  const PriceRangeSection = () => (
    <div className="space-y-3">
      <FilterHeader title="Үнийн хязгаар" section="price" />
      <AnimatePresence>
        {expandedSections.price && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 p-3">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
                  className={`p-2 text-xs rounded-lg border transition-all ${
                    filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const StarRatingSection = () => (
    <div className="space-y-3">
      <FilterHeader title="Од үнэлгээ" count={filters.starRating.length} section="rating" />
      <AnimatePresence>
        {expandedSections.rating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => toggleStarRating(stars)}
                  className={`flex items-center gap-2 w-full p-2 rounded-lg border transition-all ${
                    filters.starRating.includes(stars)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: stars }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">{stars}+ од</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const FacilitiesSection = () => (
    <div className="space-y-3">
      <FilterHeader title="Тохижилт" count={filters.facilities.length} section="facilities" />
      <AnimatePresence>
        {expandedSections.facilities && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3 max-h-60 overflow-y-auto">
              {FACILITIES.map((facility) => {
                const Icon = facility.icon;
                const isSelected = filters.facilities.includes(facility.id);
                return (
                  <button
                    key={facility.id}
                    onClick={() => toggleFacility(facility.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{facility.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{facility.count}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const RoomTypesSection = () => (
    <div className="space-y-3">
      <FilterHeader title="Өрөөний төрөл" count={filters.roomTypes.length} section="rooms" />
      <AnimatePresence>
        {expandedSections.rooms && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3">
              {ROOM_TYPES.map((roomType) => (
                <button
                  key={roomType}
                  onClick={() => toggleRoomType(roomType)}
                  className={`flex items-center w-full p-2 rounded-lg border transition-all ${
                    filters.roomTypes.includes(roomType)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <span className="text-sm text-gray-700">{roomType}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Шүүлтүүр</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Бүгдийг арилгах
          </button>
        )}
      </div>
      
      <PriceRangeSection />
      <StarRatingSection />
      <FacilitiesSection />
      <RoomTypesSection />
    </div>
  );

  if (embedded) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <FilterContent />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Шүүлтүүр</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <FilterContent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}