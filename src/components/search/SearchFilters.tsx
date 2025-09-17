'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star, Wifi, Car, Utensils, Users, Dumbbell, Waves, Building, Clock, X, Building2,
  Coffee, Bath, Cigarette, TreePine, Sun, Gamepad2, Gift, Plane, Wrench,
  ShoppingBag, Phone, Wind, Baby, PawPrint, Accessibility,
  Briefcase, Coffee as CafeIcon, Volume2, Soup, Bed, MapPin
} from 'lucide-react';
import { ApiService } from '@/services/api';
// import FilterSummary from './FilterSummary';

/**
 * API DATA INTERFACES AND DOCUMENTATION
 *
 * This component integrates with the /api/combined-data/ endpoint to fetch filter options.
 * The API returns comprehensive data for all filter categories.
 *
 * API Endpoint: /api/combined-data/
 * Method: GET
 * Description: Returns combined data for property types, facilities, ratings, and locations
 */

// Property Types from API (e.g., Hotel, Apartment, GuestHouse)
interface PropertyType {
  id: number;
  name_en: string; // English name
  name_mn: string; // Mongolian name
}

// Facilities from API (e.g., Restaurant, Wi-Fi, Parking, etc.)
interface Facility {
  id: number;
  name_en: string; // English name (e.g., "Free Wi-Fi")
  name_mn: string; // Mongolian name (e.g., "Үнэгүй Wi-Fi")
}

// Rating levels from API (1-5 stars, N/A)
interface Rating {
  id: number;
  rating: string; // Format: "1 star", "2 stars", etc. or "N/A"
}

// Province/Location data from API
interface Province {
  id: number;
  name: string; // Province name in Mongolian
}

// Accessibility features from API
interface AccessibilityFeature {
  id: number;
  name_en: string;
  name_mn: string;
}

// Combined API Response Structure
interface CombinedApiData {
  property_types: PropertyType[];         // Available accommodation types
  facilities: Facility[];                 // All available facilities and services
  ratings: Rating[];                      // Star rating levels
  province: Province[];                   // Available provinces/locations
  accessibility_features: AccessibilityFeature[]; // Accessibility options
  // Note: soum and languages data is also available but not used in filters currently
}

interface FilterState {
  propertyTypes: number[];
  popularSearches: string[];
  priceRange: [number, number];
  roomFeatures: number[];
  generalServices: number[];
  bedTypes: string[];
  popularPlaces: string[];
  discounted: boolean;
  starRating: number[];
  outdoorAreas: number[];
  facilities: string[];
  roomTypes: string[];
}

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  embedded?: boolean;
  apiData?: CombinedApiData | null;
  filters?: FilterState;
  filterCounts?: Record<string, number>;
}

const STORAGE_KEY = 'hotel_search_filters';
const RECENT_FILTERS_KEY = 'hotel_recent_filters';

// Static data for features not available in API yet
const POPULAR_SEARCHES = [
  { id: 'breakfast', label: 'Өглөөний хоол' },
  { id: 'romantic', label: 'Романтик' },
  { id: '5star', label: '5 од' },
  { id: 'spa', label: 'Спа' },
  { id: 'pool', label: 'Усан сан' }
];

const BED_TYPES = [
  { id: 'single', label: 'Ганц ор' },
  { id: 'double', label: 'Давхар ор' },
  { id: 'queen', label: 'Хатан ор' },
  { id: 'king', label: 'Хаан ор' }
];

const POPULAR_PLACES = [
  { id: 'center', label: 'Төв хэсэг' },
  { id: 'airport', label: 'Онгоцны буудлын ойр' },
  { id: 'shopping', label: 'Худалдааны төв' },
  { id: 'attractions', label: 'Аялалын газрын ойр' },
  { id: 'transport', label: 'Тээврийн зангилаа' }
];

interface RecentFilter {
  id: string;
  label: string;
  filters: FilterState;
  timestamp: number;
}

export default function SearchFilters({ isOpen, onClose, onFilterChange, embedded = false, apiData, filters: externalFilters, filterCounts = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    popularSearches: [],
    priceRange: [0, 1000000], // Dynamic range based on actual data
    roomFeatures: [],
    generalServices: [],
    bedTypes: [],
    popularPlaces: [],
    discounted: false,
    starRating: [],
    outdoorAreas: [],
    facilities: [],
    roomTypes: []
  });
  const [recentFilters, setRecentFilters] = useState<RecentFilter[]>([]);

  // API data is now received as prop, no need for local loading
  const loadingApi = !apiData;

  // Update internal filters when external filters change (e.g., from clear all)
  // This handles programmatic filter changes like "clear all" actions
  useEffect(() => {
    if (externalFilters) {
      const hasExternalChanges = JSON.stringify(filters) !== JSON.stringify(externalFilters);
      if (hasExternalChanges) {
        setFilters(externalFilters);
        // Also save the external filters to localStorage so they persist
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(externalFilters));
        } catch (error) {
          console.warn('Failed to save external filters:', error);
        }
      }
    }
  }, [externalFilters, filters]);

  // Load API data and filters from localStorage on mount
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // Helper function to generate a readable label for filter combination
  const generateFilterLabel = useCallback((filterState: FilterState): string => {
    const parts: string[] = [];

    if (filterState.propertyTypes.length > 0) {
      const typeNames = filterState.propertyTypes.map(id => {
        const type = apiData?.property_types.find(t => t.id === id);
        return type?.name_mn || '';
      }).filter(Boolean);
      if (typeNames.length > 0) parts.push(typeNames.join(', '));
    }

    if (filterState.priceRange[0] !== 0 || filterState.priceRange[1] !== 1000000) {
      parts.push(`₮${filterState.priceRange[0]/1000}K-${filterState.priceRange[1]/1000}K`);
    }

    if (filterState.starRating.length > 0) {
      parts.push(`${filterState.starRating.join(',')} од`);
    }

    if (filterState.discounted) {
      parts.push('Хямдралтай');
    }

    return parts.length > 0 ? parts.slice(0, 3).join(' • ') : 'Энгийн хайлт';
  }, [apiData]);

  // Load recent filters from localStorage
  const loadRecentFilters = useCallback(() => {
    try {
      const saved = localStorage.getItem(RECENT_FILTERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RecentFilter[];
        setRecentFilters(parsed.slice(0, 5)); // Keep only last 5
      }
    } catch (error) {
      console.warn('Failed to load recent filters:', error);
    }
  }, []);

  // Save a new filter combination to recent filters
  const saveToRecentFilters = useCallback((filterState: FilterState) => {
    // Don't save if it's the default/empty filter state
    const isDefault = (
      filterState.propertyTypes.length === 0 &&
      filterState.popularSearches.length === 0 &&
      filterState.priceRange[0] === 0 &&
      filterState.priceRange[1] === 1000000 &&
      filterState.roomFeatures.length === 0 &&
      filterState.generalServices.length === 0 &&
      filterState.bedTypes.length === 0 &&
      filterState.popularPlaces.length === 0 &&
      !filterState.discounted &&
      filterState.starRating.length === 0 &&
      filterState.outdoorAreas.length === 0 &&
      filterState.facilities.length === 0 &&
      filterState.roomTypes.length === 0
    );

    if (isDefault) return;

    try {
      const newFilter: RecentFilter = {
        id: `filter_${Date.now()}`,
        label: generateFilterLabel(filterState),
        filters: { ...filterState },
        timestamp: Date.now()
      };

      setRecentFilters(prev => {
        // Remove any duplicate filters (same label)
        const filtered = prev.filter(f => f.label !== newFilter.label);
        // Add new filter at the beginning and keep only 5
        const updated = [newFilter, ...filtered].slice(0, 5);

        // Save to localStorage
        localStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(updated));

        return updated;
      });
    } catch (error) {
      console.warn('Failed to save recent filter:', error);
    }
  }, [generateFilterLabel]);

  // Apply a recent filter
  const applyRecentFilter = useCallback((recentFilter: RecentFilter) => {
    setFilters(recentFilter.filters);
    onFilterChange(recentFilter.filters);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentFilter.filters));
    } catch (error) {
      console.warn('Failed to save applied recent filter:', error);
    }
  }, [onFilterChange]);

  useEffect(() => {
    const loadSavedFilters = () => {
      try {
        const savedFilters = localStorage.getItem(STORAGE_KEY);
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
          onFilterChangeRef.current(parsedFilters);
        }
      } catch (error) {
        console.warn('Failed to load saved filters:', error);
      }
    };

    // Always load from localStorage on initial mount, regardless of external filters
    // This ensures filters persist across sessions
    loadSavedFilters();
    // Also load recent filters
    loadRecentFilters();
  }, []); // Only run once on mount

  // Save filters to localStorage whenever they change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters));
      // Also save to recent filters when user makes changes
      saveToRecentFilters(updatedFilters);
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  }, [filters, onFilterChange, saveToRecentFilters]);

  const handleRemoveFilter = useCallback((filterType: string, value?: string | number) => {
    switch (filterType) {
      case 'propertyTypes':
        updateFilters({
          propertyTypes: (filters.propertyTypes || []).filter(id => id !== value)
        });
        break;
      case 'popularSearches':
        updateFilters({
          popularSearches: (filters.popularSearches || []).filter(search => search !== value)
        });
        break;
      case 'priceRange':
        updateFilters({ priceRange: [0, 1000000] });
        break;
      case 'roomFeatures':
        updateFilters({
          roomFeatures: (filters.roomFeatures || []).filter(id => id !== value)
        });
        break;
      case 'generalServices':
        updateFilters({
          generalServices: (filters.generalServices || []).filter(id => id !== value)
        });
        break;
      case 'bedTypes':
        updateFilters({
          bedTypes: (filters.bedTypes || []).filter(bed => bed !== value)
        });
        break;
      case 'popularPlaces':
        updateFilters({
          popularPlaces: (filters.popularPlaces || []).filter(place => place !== value)
        });
        break;
      case 'discounted':
        updateFilters({ discounted: false });
        break;
      case 'starRating':
        updateFilters({
          starRating: (filters.starRating || []).filter(rating => rating !== value)
        });
        break;
      case 'outdoorAreas':
        updateFilters({
          outdoorAreas: (filters.outdoorAreas || []).filter(id => id !== value)
        });
        break;
      case 'facilities':
        updateFilters({
          facilities: (filters.facilities || []).filter(facility => facility !== value)
        });
        break;
      case 'roomTypes':
        updateFilters({
          roomTypes: (filters.roomTypes || []).filter(roomType => roomType !== value)
        });
        break;
    }
  }, [filters, updateFilters]);

  const handleClearAllFilters = useCallback(() => {
    const defaultFilters = {
      propertyTypes: [],
      popularSearches: [],
      priceRange: [0, 1000000] as [number, number],
      roomFeatures: [],
      generalServices: [],
      bedTypes: [],
      popularPlaces: [],
      discounted: false,
      starRating: [],
      outdoorAreas: [],
      facilities: [],
      roomTypes: []
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved filters:', error);
    }
  }, [onFilterChange]);

  // Helper function to get icon for facility - much more specific and relevant icons
  const getFacilityIcon = (facilityNameEn: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      // Connectivity & Tech
      'Free Wi-Fi': <Wifi className="w-3.5 h-3.5" />,
      'Electric vehicle charging station': <Wrench className="w-3.5 h-3.5" />,

      // Transportation & Parking
      'Parking': <Car className="w-3.5 h-3.5" />,
      'Airport shuttle': <Plane className="w-3.5 h-3.5" />,
      'Airport Pick-up Service': <Plane className="w-3.5 h-3.5" />,
      'Car rental': <Car className="w-3.5 h-3.5" />,
      'Car garage': <Building className="w-3.5 h-3.5" />,
      'Taxi call': <Phone className="w-3.5 h-3.5" />,

      // Food & Dining
      'Restaurant': <Utensils className="w-3.5 h-3.5" />,
      'Room service': <Soup className="w-3.5 h-3.5" />,
      'Bar': <Coffee className="w-3.5 h-3.5" />,
      'Cafe': <CafeIcon className="w-3.5 h-3.5" />,
      'Breakfast included': <Utensils className="w-3.5 h-3.5" />,

      // Wellness & Recreation
      'Swimming pool': <Waves className="w-3.5 h-3.5" />,
      'Fitness center': <Dumbbell className="w-3.5 h-3.5" />,
      'Spa & welness center': <Bath className="w-3.5 h-3.5" />,
      'Sauna': <Bath className="w-3.5 h-3.5" />,
      'Hot tub / Jacuzzi': <Bath className="w-3.5 h-3.5" />,
      'Golf course': <Gamepad2 className="w-3.5 h-3.5" />,
      'Water park': <Waves className="w-3.5 h-3.5" />,
      'Karoake': <Volume2 className="w-3.5 h-3.5" />,

      // Outdoor Areas
      'Garden': <TreePine className="w-3.5 h-3.5" />,
      'Terrace': <Sun className="w-3.5 h-3.5" />,
      'BBQ': <Utensils className="w-3.5 h-3.5" />,

      // Business & Services
      'Business center': <Briefcase className="w-3.5 h-3.5" />,
      'Conference room': <Users className="w-3.5 h-3.5" />,
      '24-hour front desk': <Clock className="w-3.5 h-3.5" />,
      'Currency exchange': <Gift className="w-3.5 h-3.5" />,
      'Luggage storage': <ShoppingBag className="w-3.5 h-3.5" />,
      'Wake-up call': <Phone className="w-3.5 h-3.5" />,
      'Guest Laundry': <ShoppingBag className="w-3.5 h-3.5" />,

      // Room Features & Comfort
      'Air conditioning': <Wind className="w-3.5 h-3.5" />,
      'Non-smoking rooms': <Cigarette className="w-3.5 h-3.5" />,
      'Family rooms': <Baby className="w-3.5 h-3.5" />,
      'Elevator': <Building2 className="w-3.5 h-3.5" />,
      'Smoking area': <Cigarette className="w-3.5 h-3.5" />,

      // Special Services
      'Adults only': <Users className="w-3.5 h-3.5" />,
      'Pet friendly': <PawPrint className="w-3.5 h-3.5" />,
      'Wheelchair accessible': <Accessibility className="w-3.5 h-3.5" />
    };
    return iconMap[facilityNameEn] || <Star className="w-3.5 h-3.5" />;
  };

  // Get outdoor area facilities based on comprehensive analysis
  const outdoorFacilities = apiData?.facilities.filter(f =>
    ['Garden', 'Terrace', 'BBQ', 'Swimming pool', 'Golf course', 'Water park'].includes(f.name_en)
  ) || [];

  // Get room feature facilities based on comprehensive analysis
  const roomFeatureFacilities = apiData?.facilities.filter(f =>
    ['Air conditioning', 'Breakfast included', 'Non-smoking rooms', 'Family rooms'].includes(f.name_en)
  ) || [];

  // Get general service facilities based on comprehensive analysis
  const generalServiceFacilities = apiData?.facilities.filter(f =>
    ['Restaurant', 'Room service', '24-hour front desk', 'Free Wi-Fi', 'Parking', 'Business center', 'Fitness center', 'Elevator', 'Airport shuttle', 'Car rental', 'Currency exchange', 'Luggage storage', 'Wake-up call', 'Taxi call', 'Conference room'].includes(f.name_en)
  ) || [];

  if (embedded) {
    return (
      <>
        {/* <FilterSummary 
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        /> */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Шүүлтүүр</h3>

          {/* Recent Filters Section */}
          {recentFilters.length > 0 && (
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <h4 className="text-xs font-medium text-gray-700">Таны ашигласан</h4>
              <div className="space-y-1">
                {recentFilters.map((recentFilter) => (
                  <button
                    key={recentFilter.id}
                    onClick={() => applyRecentFilter(recentFilter)}
                    className="flex items-center w-full p-1.5 rounded-md border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-xs transition-colors text-left"
                  >
                    <Clock className="w-3 h-3 mr-1.5 text-gray-500" />
                    <span className="text-gray-700 flex-1 truncate">{recentFilter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {loadingApi ? (
          <div className="text-xs text-gray-500">Шүүлтүүр ачааллаж байна...</div>
        ) : (
          <>
            {/* 1. Property Type */}
            {apiData?.property_types && apiData.property_types.length > 0 ? (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Зочид буудлын төрөл</h4>
                <div className="space-y-1">
                  {apiData.property_types.map((type) => {
                    const isSelected = filters.propertyTypes?.includes(type.id) || false;
                    return (
                      <button
                        key={type.id}
                        onClick={() => updateFilters({
                          propertyTypes: isSelected
                            ? (filters.propertyTypes || []).filter(id => id !== type.id)
                            : [...(filters.propertyTypes || []), type.id]
                        })}
                        className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                          isSelected
                            ? 'border-primary-300 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="w-3 h-3 mr-1.5" />
                        <span className="text-gray-700 flex-1">{type.name_mn}</span>
                        {filterCounts[`property_${type.id}`] !== undefined && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({filterCounts[`property_${type.id}`]})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Зочид буудлын төрөл</h4>
                <div className="text-xs text-gray-500">Ачааллаж байна...</div>
              </div>
            )}

            {/* 2. Popular Searches */}
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <h4 className="text-xs font-medium text-gray-700">Түгээмэл хайлтууд</h4>
              <div className="space-y-1">
                {POPULAR_SEARCHES.map((search) => {
                  const isSelected = filters.popularSearches?.includes(search.id) || false;
                  return (
                    <button
                      key={search.id}
                      onClick={() => updateFilters({
                        popularSearches: isSelected
                          ? (filters.popularSearches || []).filter(id => id !== search.id)
                          : [...(filters.popularSearches || []), search.id]
                      })}
                      className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                        isSelected
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Star className="w-3 h-3 mr-1.5" />
                      <span className="text-gray-700">{search.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Price Range */}
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-gray-700">Үнийн хязгаар</h4>
                <span className="text-xs text-gray-500">
                  ₮{filters.priceRange[0].toLocaleString()}-{filters.priceRange[1].toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { label: '< 50K', min: 0, max: 50000 },
                  { label: '50K - 100K', min: 50000, max: 100000 },
                  { label: '100K - 200K', min: 100000, max: 200000 },
                  { label: '200K - 300K', min: 200000, max: 300000 },
                  { label: '300K - 500K', min: 300000, max: 500000 },
                  { label: '> 500K', min: 500000, max: 1000000 },
                ].map((range) => {
                  const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
                  // Map range to count key
                  const countKey = range.min === 0 ? 'price_0_50000' :
                                  range.min === 50000 ? 'price_50000_100000' :
                                  range.min === 100000 ? 'price_100000_200000' :
                                  range.min === 200000 ? 'price_200000_300000' :
                                  range.min === 300000 ? 'price_300000_500000' :
                                  range.min === 500000 ? 'price_500000_plus' : '';
                  const count = filterCounts[countKey];

                  return (
                    <button
                      key={range.label}
                      onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
                      className={`w-full p-2 rounded-md border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                      }`}
                    >
                      <span>{range.label}</span>
                      {count !== undefined && (
                        <span className="text-xs text-gray-500">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Room Features */}
            {roomFeatureFacilities.length > 0 ? (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Өрөөний онцлог зүйлс</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {roomFeatureFacilities.map((facility) => {
                    const isSelected = filters.roomFeatures?.includes(facility.id) || false;
                    return (
                      <button
                        key={facility.id}
                        onClick={() => updateFilters({
                          roomFeatures: isSelected
                            ? (filters.roomFeatures || []).filter(id => id !== facility.id)
                            : [...(filters.roomFeatures || []), facility.id]
                        })}
                        className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                          isSelected
                            ? 'border-primary-300 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {getFacilityIcon(facility.name_en)}
                        <span className="text-gray-700 ml-1.5 flex-1">{facility.name_mn}</span>
                        {filterCounts[`facility_${facility.id}`] !== undefined && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({filterCounts[`facility_${facility.id}`]})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Өрөөний онцлог зүйлс</h4>
                <div className="text-xs text-gray-500">Ачааллаж байна...</div>
              </div>
            )}

            {/* 5. General Services */}
            {generalServiceFacilities.length > 0 ? (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Ерөнхий үйлчилгээ</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {generalServiceFacilities.map((facility) => {
                    const isSelected = filters.generalServices?.includes(facility.id) || false;
                    return (
                      <button
                        key={facility.id}
                        onClick={() => updateFilters({
                          generalServices: isSelected
                            ? (filters.generalServices || []).filter(id => id !== facility.id)
                            : [...(filters.generalServices || []), facility.id]
                        })}
                        className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                          isSelected
                            ? 'border-primary-300 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {getFacilityIcon(facility.name_en)}
                        <span className="text-gray-700 ml-1.5 flex-1">{facility.name_mn}</span>
                        {filterCounts[`facility_${facility.id}`] !== undefined && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({filterCounts[`facility_${facility.id}`]})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Ерөнхий үйлчилгээ</h4>
                <div className="text-xs text-gray-500">Ачааллаж байна...</div>
              </div>
            )}

            {/* 6. Bed Types */}
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <h4 className="text-xs font-medium text-gray-700">Орны төрөл</h4>
              <div className="space-y-1">
                {BED_TYPES.map((bed) => {
                  const isSelected = filters.bedTypes?.includes(bed.id) || false;
                  return (
                    <button
                      key={bed.id}
                      onClick={() => updateFilters({
                        bedTypes: isSelected
                          ? (filters.bedTypes || []).filter(id => id !== bed.id)
                          : [...(filters.bedTypes || []), bed.id]
                      })}
                      className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                        isSelected
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Bed className="w-3 h-3 mr-1.5" />
                      <span className="text-gray-700 flex-1">{bed.label}</span>
                      {filterCounts[`bed_type_${bed.id}`] !== undefined && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({filterCounts[`bed_type_${bed.id}`]})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Popular Places */}
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <h4 className="text-xs font-medium text-gray-700">Алдартай газрууд</h4>
              <div className="space-y-1">
                {POPULAR_PLACES.map((place) => {
                  const isSelected = filters.popularPlaces?.includes(place.id) || false;
                  return (
                    <button
                      key={place.id}
                      onClick={() => updateFilters({
                        popularPlaces: isSelected
                          ? (filters.popularPlaces || []).filter(id => id !== place.id)
                          : [...(filters.popularPlaces || []), place.id]
                      })}
                      className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                        isSelected
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className="w-3 h-3 mr-1.5" />
                      <span className="text-gray-700">{place.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8. Discounted */}
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <h4 className="text-xs font-medium text-gray-700">Хямдралтай</h4>
              <button
                onClick={() => updateFilters({ discounted: !filters.discounted })}
                className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                  filters.discounted
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Star className="w-3 h-3 mr-1.5" />
                <span className="text-gray-700">Хямдралтай үнэ</span>
              </button>
            </div>
            {/* 9. Star Rating */}
            {apiData?.ratings && apiData.ratings.length > 0 ? (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Зочдын үнэлгээ</h4>
                <div className="space-y-1">
                  {apiData.ratings.filter(r => r.rating !== 'N/A').map((rating) => {
                    const stars = parseInt(rating.rating.match(/\d+/)?.[0] || '0');
                    if (stars === 0) return null;
                    const isSelected = filters.starRating?.includes(stars) || false;
                    return (
                      <button
                        key={rating.id}
                        onClick={() => updateFilters({
                          starRating: isSelected
                            ? (filters.starRating || []).filter(s => s !== stars)
                            : [...(filters.starRating || []), stars]
                        })}
                        className={`flex items-center gap-1.5 w-full p-1.5 rounded-md border text-xs transition-colors ${
                          isSelected
                            ? 'border-primary-300 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-0.5">
                          {Array.from({ length: stars }, (_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-gray-700 flex-1">{stars}+ од</span>
                        {filterCounts[`rating_${stars}`] !== undefined && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({filterCounts[`rating_${stars}`]})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <h4 className="text-xs font-medium text-gray-700">Зочдын үнэлгээ</h4>
                <div className="text-xs text-gray-500">Ачааллаж байна...</div>
              </div>
            )}

            {/* 10. Outdoor Areas */}
            {outdoorFacilities.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-700">Гадаах талбай</h4>
                <div className="space-y-1">
                  {outdoorFacilities.map((facility) => {
                    const isSelected = filters.outdoorAreas?.includes(facility.id) || false;
                    return (
                      <button
                        key={facility.id}
                        onClick={() => updateFilters({
                          outdoorAreas: isSelected
                            ? (filters.outdoorAreas || []).filter(id => id !== facility.id)
                            : [...(filters.outdoorAreas || []), facility.id]
                        })}
                        className={`flex items-center w-full p-1.5 rounded-md border text-xs transition-colors ${
                          isSelected
                            ? 'border-primary-300 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {getFacilityIcon(facility.name_en)}
                        <span className="text-gray-700 ml-1.5 flex-1">{facility.name_mn}</span>
                        {filterCounts[`facility_${facility.id}`] !== undefined && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({filterCounts[`facility_${facility.id}`]})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-700">Гадаах талбай</h4>
                <div className="text-xs text-gray-500">Ачааллаж байна...</div>
              </div>
            )}
          </>
        )}
        </div>
      </>
    );
  }

  // Mobile modal version
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/25" onClick={onClose} />
        <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
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
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Шүүлтүүр</h3>
              
              {/* Same content as embedded version */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-base">Budget Range</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ₮{filters.priceRange[0].toLocaleString()} - ₮{filters.priceRange[1].toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: '< 50K', min: 0, max: 50000 },
                    { label: '50K - 100K', min: 50000, max: 100000 },
                    { label: '100K - 200K', min: 100000, max: 200000 },
                    { label: '200K - 300K', min: 200000, max: 300000 },
                    { label: '300K - 500K', min: 300000, max: 500000 },
                    { label: '> 500K', min: 500000, max: 1000000 },
                  ].map((range) => {
                    const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-primary-300 bg-white hover:bg-primary-50/30 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{range.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-2">Од үнэлгээ</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      className="flex items-center gap-2 w-full p-2 rounded-lg border border-gray-200 hover:border-primary-200"
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
              </div>

              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-2">Тохижилт</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {apiData?.facilities.map((facility) => (
                    <button
                      key={facility.id}
                      className="flex items-center justify-between w-full p-2 rounded-lg border border-gray-200 hover:border-primary-200"
                    >
                      <div className="flex items-center gap-2">
                        {getFacilityIcon(facility.name_en)}
                        <span className="text-sm text-gray-700">{facility.name_mn}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}