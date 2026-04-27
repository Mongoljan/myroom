'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star, Wifi, Car, Utensils, Users, Dumbbell, Waves, Building, Clock, X, Building2,
  Coffee, Bath, Cigarette, TreePine, Sun, Gamepad2, Gift, Plane, Wrench,
  ShoppingBag, Phone, Wind, Baby, PawPrint, Accessibility,
  Briefcase, Coffee as CafeIcon, Volume2, Soup, Bed
} from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import CollapsibleFilterSection from './CollapsibleFilterSection';
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
  roomFeatures: number[];
  generalServices: number[];
  starRating: number[];
  outdoorAreas: number[];
  priceRange: [number, number];
  discounted: boolean;
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
  /** Min/Max price across current search results, used for the budget slider. */
  priceBounds?: [number, number];
}

const STORAGE_KEY = 'hotel_search_filters';
const RECENT_FILTERS_KEY = 'hotel_recent_filters';

// Static data for features not available in API yet - moved to translation files
// These will be dynamically generated from translations in the component

interface RecentFilter {
  id: string;
  label: string;
  filters: FilterState;
  timestamp: number;
}

export default function SearchFilters({ isOpen, onClose, onFilterChange, embedded = false, apiData, filters: externalFilters, filterCounts = {}, priceBounds }: SearchFiltersProps) {
  const { t } = useHydratedTranslation();

  // Remove hardcoded categories - keeping only API-driven filters
  // PROPERTY_CATEGORIES, POPULAR_SEARCHES, BED_TYPES, POPULAR_PLACES removed
  // These were hardcoded and should be replaced with API data or removed entirely

  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    priceRange: [0, 1000000], // Dynamic range based on actual data
    roomFeatures: [],
    generalServices: [],
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
      filterState.priceRange[0] === 0 &&
      filterState.priceRange[1] === 1000000 &&
      filterState.roomFeatures.length === 0 &&
      filterState.generalServices.length === 0 &&
      !filterState.discounted &&
      filterState.starRating.length === 0 &&
      filterState.outdoorAreas.length === 0 &&
      filterState.facilities.length === 0 &&
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveFilter = useCallback((filterType: string, value?: string | number) => {
    switch (filterType) {
      case 'propertyTypes':
        updateFilters({
          propertyTypes: (filters.propertyTypes || []).filter(id => id !== value)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClearAllFilters = useCallback(() => {
    const defaultFilters = {
      propertyTypes: [],
      priceRange: [0, 1000000] as [number, number],
      roomFeatures: [],
      generalServices: [],
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
  // Get general service facilities based on comprehensive analysis
  const generalServiceFacilities = apiData?.facilities || [];
  
  // Room features and outdoor facilities - use API data without hardcoded filtering
  const roomFeatureFacilities = apiData?.facilities || [];
  const outdoorFacilities = apiData?.facilities || [];

  if (embedded) {
    return (
      <>
        {/* <FilterSummary 
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        /> */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('search.filtersSection.title')}</h3>

          {/* Recent Filters Section */}
          {recentFilters.length > 0 && (
            <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.usedByYou')}</h4>
              <div className="space-y-1">
                {recentFilters.map((recentFilter) => (
                  <button
                    key={recentFilter.id}
                    onClick={() => applyRecentFilter(recentFilter)}
                    className="flex items-center w-full p-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50 dark:bg-gray-800 dark:text-gray-300 text-xs transition-colors text-left"
                  >
                    <Clock className="w-3 h-3 mr-1.5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 flex-1 truncate">{recentFilter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Budget — derived from current search results */}
          {priceBounds && priceBounds[1] > priceBounds[0] && (
            <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.budget') || 'Төсөв'}</h4>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>₮{Math.round((filters.priceRange?.[0] ?? priceBounds[0]) / 1000)}K</span>
                <span>₮{Math.round((filters.priceRange?.[1] ?? priceBounds[1]) / 1000)}K</span>
              </div>
              <input
                type="range"
                min={priceBounds[0]}
                max={priceBounds[1]}
                step={Math.max(1000, Math.round((priceBounds[1] - priceBounds[0]) / 100))}
                value={filters.priceRange?.[1] ?? priceBounds[1]}
                onChange={(e) => updateFilters({ priceRange: [priceBounds[0], parseInt(e.target.value, 10)] })}
                className="w-full accent-primary-600"
              />
              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-500">
                <span>Доод: ₮{Math.round(priceBounds[0] / 1000)}K</span>
                <span>Дээд: ₮{Math.round(priceBounds[1] / 1000)}K</span>
              </div>
            </div>
          )}

        {loadingApi ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">{t('search.filtersSection.loading')}</div>
        ) : (
          <>


            {/* 5. Room Features */}
            {roomFeatureFacilities.length > 0 ? (
              <CollapsibleFilterSection
                title={t('search.filtersSection.roomFeatures')}
                itemCount={roomFeatureFacilities.length}
                initialShowCount={4}
              >
                {roomFeatureFacilities.map((facility) => {
                  const isSelected = filters.roomFeatures?.includes(facility.id) || false;
                  return (
                    <label
                      key={facility.id}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateFilters({
                          roomFeatures: isSelected
                            ? (filters.roomFeatures || []).filter(id => id !== facility.id)
                            : [...(filters.roomFeatures || []), facility.id]
                        })}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                      {filterCounts[`facility_${facility.id}`] !== undefined && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({filterCounts[`facility_${facility.id}`]})
                        </span>
                      )}
                    </label>
                  );
                })}
              </CollapsibleFilterSection>
            ) : (
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.roomFeatures')}</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
              </div>
            )}

            {/* 6. General Services */}
            {generalServiceFacilities.length > 0 ? (
              <CollapsibleFilterSection
                title={t('search.filtersSection.generalServices')}
                itemCount={generalServiceFacilities.length}
                initialShowCount={5}
              >
                {generalServiceFacilities.map((facility) => {
                  const isSelected = filters.generalServices?.includes(facility.id) || false;
                  return (
                    <label
                      key={facility.id}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateFilters({
                          generalServices: isSelected
                            ? (filters.generalServices || []).filter(id => id !== facility.id)
                            : [...(filters.generalServices || []), facility.id]
                        })}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                      {filterCounts[`facility_${facility.id}`] !== undefined && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({filterCounts[`facility_${facility.id}`]})
                        </span>
                      )}
                    </label>
                  );
                })}
              </CollapsibleFilterSection>
            ) : (
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.generalServices')}</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
              </div>
            )}

            {/* 10. Guest Rating (зочдын үнэлгээ) - Compact version */}
            {apiData?.ratings && apiData.ratings.length > 0 ? (
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.guestRating')}</h4>
                <div className="grid grid-cols-5 gap-1">
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
                        className={`p-1.5 rounded-md border text-xs transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Star className={`w-3 h-3 mb-0.5 ${isSelected ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        <span className="font-medium text-[10px]">{stars}+</span>
                        {filterCounts[`rating_${stars}`] !== undefined && (
                          <span className="text-[9px] text-gray-500 dark:text-gray-400">({filterCounts[`rating_${stars}`]})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.guestRating')}</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
              </div>
            )}

            {/* 11. Outdoor Areas */}
            {outdoorFacilities.length > 0 ? (
              <CollapsibleFilterSection
                title={t('search.filtersSection.outdoorArea')}
                itemCount={outdoorFacilities.length}
                initialShowCount={3}
                className="border-b-0"
              >
                {outdoorFacilities.map((facility) => {
                  const isSelected = filters.outdoorAreas?.includes(facility.id) || false;
                  return (
                    <label
                      key={facility.id}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateFilters({
                          outdoorAreas: isSelected
                            ? (filters.outdoorAreas || []).filter(id => id !== facility.id)
                            : [...(filters.outdoorAreas || []), facility.id]
                        })}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                      {filterCounts[`facility_${facility.id}`] !== undefined && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({filterCounts[`facility_${facility.id}`]})
                        </span>
                      )}
                    </label>
                  );
                })}
              </CollapsibleFilterSection>
            ) : (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.outdoorArea')}</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
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
        <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('search.filtersSection.title')}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('search.filtersSection.title')}</h3>
              
              {/* Same content as embedded version */}
              <div className="space-y-4">
                


              </div>



              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{t('search.amenities')}</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {apiData?.facilities.map((facility) => (
                    <button
                      key={facility.id}
                      className="flex items-center justify-between w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{facility.name_mn}</span>
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