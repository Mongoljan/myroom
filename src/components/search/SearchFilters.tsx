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
import { SearchHotelResult } from '@/types/api';

// ------- Hardcoded landmark data (UB) -------
// When backend adds geo-data to hotels, replace with distance-radius filtering.
export const UB_LANDMARKS = [
  { id: 'sukhbaatar_square',  name_mn: 'Сүхбаатарын талбай',       districts: ['Сүхбаатар'] },
  { id: 'chinggis_statue',    name_mn: 'Чингис хааны хөшөө',        districts: ['Сүхбаатар'] },
  { id: 'intellectual_museum',name_mn: 'Оюуны өв музей',             districts: ['Сүхбаатар'] },
  { id: 'bogd_khan_palace',   name_mn: 'Богд хааны ордон',           districts: ['Хан-Уул'] },
  { id: 'zaisan',             name_mn: 'Зайсан цамхаг',              districts: ['Хан-Уул'] },
  { id: 'gandan',             name_mn: 'Гандантэгчинлэн хийд',       districts: ['Баянгол'] },
  { id: 'naran_tuul',         name_mn: 'Нараантуул зах',             districts: ['Баянзүрх', 'Баянгол'] },
  { id: 'state_store',        name_mn: 'Их дэлгүүр',                 districts: ['Сүхбаатар'] },
];;

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
  facilities: Facility[];                 // General facilities (group 1)
  additionalFacilities: Facility[];       // Additional facilities (group 2)
  activities: Facility[];                 // Activities (group 3)
  ratings: Rating[];                      // Star rating levels
  province: Province[];                   // Available provinces/locations
  accessibility_features: AccessibilityFeature[]; // Accessibility options (group 4)
  // Note: soum and languages data is also available but not used in filters currently
}

interface FilterState {
  propertyTypes: number[];
  roomFeatures: number[];        // Group 1: General facilities
  generalServices: number[];     // Group 2: Additional facilities
  outdoorAreas: number[];        // Group 3: Activities
  accessibilityFeatures: number[]; // Group 4: Accessibility features
  starRating: number[];
  priceRange: [number, number];
  discounted: boolean;
  facilities: string[];
  roomTypes: string[];
  neighbourhood: string[];       // Selected soum/district names
  landmark: string[];            // Selected landmark IDs
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
  /** Number of hotels with a discounted cheapest room */
  discountedCount?: number;
  /** Number of hotels in the current results, used to gate the price slider. */
  totalResults?: number;
  /** All hotels from the search result — used to derive neighbourhood options. */
  hotels?: SearchHotelResult[];
}

const STORAGE_KEY = 'hotel_search_filters';
const RECENT_FILTERS_KEY = 'hotel_recent_filters';
const RECENT_INDIVIDUAL_KEY = 'hotel_recent_individual_filters';

// Static data for features not available in API yet - moved to translation files
// These will be dynamically generated from translations in the component

interface RecentFilter {
  id: string;
  label: string;
  filters: FilterState;
  timestamp: number;
}

interface RecentIndividualFilter {
  id: string;    // e.g. 'starRating_5', 'roomFeature_3', 'discounted'
  type: string;  // 'starRating' | 'propertyTypes' | 'roomFeatures' | 'generalServices' | 'outdoorAreas' | 'discounted' | 'neighbourhood' | 'landmark'
  value: string | number | boolean;
  label: string;
  timestamp: number;
}

export default function SearchFilters({ isOpen, onClose, onFilterChange, embedded = false, apiData, filters: externalFilters, filterCounts = {}, priceBounds, discountedCount = 0, totalResults = 0, hotels = [] }: SearchFiltersProps) {
  const { t } = useHydratedTranslation();

  // Remove hardcoded categories - keeping only API-driven filters
  // PROPERTY_CATEGORIES, POPULAR_SEARCHES, BED_TYPES, POPULAR_PLACES removed
  // These were hardcoded and should be replaced with API data or removed entirely

  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    priceRange: [0, 99_000_000], // Dynamic range based on actual data; sentinel > any real hotel price
    roomFeatures: [],
    generalServices: [],
    discounted: false,
    starRating: [],
    outdoorAreas: [],
    accessibilityFeatures: [],
    facilities: [],
    roomTypes: [],
    neighbourhood: [],
    landmark: [],
  });
  const [recentFilters, setRecentFilters] = useState<RecentFilter[]>([]);
  const [recentIndividualFilters, setRecentIndividualFilters] = useState<RecentIndividualFilter[]>([]);

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

    if (filterState.priceRange[0] !== 0 || filterState.priceRange[1] !== 99_000_000) {
      const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
      parts.push(`₮${fmt(filterState.priceRange[0])}-${fmt(filterState.priceRange[1])}`);
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
      filterState.priceRange[1] === 99_000_000 &&
      filterState.roomFeatures.length === 0 &&
      filterState.generalServices.length === 0 &&
      !filterState.discounted &&
      filterState.starRating.length === 0 &&
      filterState.outdoorAreas.length === 0 &&
      (filterState.accessibilityFeatures?.length ?? 0) === 0 &&
      filterState.facilities.length === 0 &&
      filterState.roomTypes.length === 0 &&
      (filterState.neighbourhood?.length ?? 0) === 0 &&
      (filterState.landmark?.length ?? 0) === 0
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

  // Load individual recent filters from localStorage
  const loadIndividualFilters = useCallback(() => {
    try {
      const saved = localStorage.getItem(RECENT_INDIVIDUAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RecentIndividualFilter[];
        setRecentIndividualFilters(parsed.slice(0, 5));
      }
    } catch (error) {
      console.warn('Failed to load individual filters:', error);
    }
  }, []);

  // Save a single individual filter item (most-recent first, max 5)
  const saveIndividualFilter = useCallback((item: RecentIndividualFilter) => {
    try {
      setRecentIndividualFilters(prev => {
        const filtered = prev.filter(x => x.id !== item.id);
        const updated = [item, ...filtered].slice(0, 5);
        localStorage.setItem(RECENT_INDIVIDUAL_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.warn('Failed to save individual filter:', error);
    }
  }, []);

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
    // Also load recent filters and individual filters
    loadRecentFilters();
    loadIndividualFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Save filters to localStorage whenever they change
  const updateFilters = useCallback((newFilters: Partial<FilterState>, options: { saveRecent?: boolean } = {}) => {
    const { saveRecent = true } = options;
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters));
      if (saveRecent) {
        saveToRecentFilters(updatedFilters);
        // Track individual filter additions for "Саяхны шүүлтүүр"
        const ts = Date.now();
        const track = (id: string, type: string, value: string | number | boolean, label: string) =>
          saveIndividualFilter({ id, type, value, label, timestamp: ts });
        (updatedFilters.starRating || []).filter(s => !(filters.starRating || []).includes(s))
          .forEach(s => track(`starRating_${s}`, 'starRating', s, `${s}★`));
        (updatedFilters.propertyTypes || []).filter(id => !(filters.propertyTypes || []).includes(id))
          .forEach(id => { const pt = apiData?.property_types.find(p => p.id === id); if (pt) track(`propertyType_${id}`, 'propertyTypes', id, pt.name_mn); });
        if (updatedFilters.discounted && !filters.discounted)
          track('discounted', 'discounted', true, 'Хямдралтай');
        (updatedFilters.roomFeatures || []).filter(id => !(filters.roomFeatures || []).includes(id))
          .forEach(id => { const f = apiData?.facilities?.find(x => x.id === id); if (f) track(`roomFeature_${id}`, 'roomFeatures', id, f.name_mn); });
        (updatedFilters.generalServices || []).filter(id => !(filters.generalServices || []).includes(id))
          .forEach(id => { const f = apiData?.additionalFacilities?.find(x => x.id === id); if (f) track(`genService_${id}`, 'generalServices', id, f.name_mn); });
        (updatedFilters.outdoorAreas || []).filter(id => !(filters.outdoorAreas || []).includes(id))
          .forEach(id => { const f = apiData?.activities?.find(x => x.id === id); if (f) track(`outdoor_${id}`, 'outdoorAreas', id, f.name_mn); });
        (updatedFilters.neighbourhood || []).filter(n => !(filters.neighbourhood || []).includes(n))
          .forEach(n => track(`neighbourhood_${n}`, 'neighbourhood', n, n));
        (updatedFilters.landmark || []).filter(l => !(filters.landmark || []).includes(l))
          .forEach(l => { const lm = UB_LANDMARKS.find(x => x.id === l); if (lm) track(`landmark_${l}`, 'landmark', l, lm.name_mn); });
      }
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  }, [filters, onFilterChange, saveToRecentFilters, saveIndividualFilter, apiData]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveFilter = useCallback((filterType: string, value?: string | number) => {
    switch (filterType) {
      case 'propertyTypes':
        updateFilters({
          propertyTypes: (filters.propertyTypes || []).filter(id => id !== value)
        });
        break;
      case 'priceRange':
        updateFilters({ priceRange: [0, 99_000_000] });
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
      case 'neighbourhood':
        updateFilters({
          neighbourhood: (filters.neighbourhood || []).filter(n => n !== value)
        });
        break;
      case 'landmark':
        updateFilters({
          landmark: (filters.landmark || []).filter(l => l !== value)
        });
        break;
    }
  }, [filters, updateFilters]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClearAllFilters = useCallback(() => {
    const defaultFilters = {
      propertyTypes: [],
      priceRange: [0, 99_000_000] as [number, number],
      roomFeatures: [],
      generalServices: [],
      discounted: false,
      starRating: [],
      outdoorAreas: [],
      accessibilityFeatures: [],
      facilities: [],
      roomTypes: [],
      neighbourhood: [],
      landmark: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved filters:', error);
    }
  }, [onFilterChange]);

  // Check if a recent individual filter item is currently active in the filter state
  const isItemActive = useCallback((item: RecentIndividualFilter): boolean => {
    switch (item.type) {
      case 'starRating': return (filters.starRating || []).includes(item.value as number);
      case 'propertyTypes': return (filters.propertyTypes || []).includes(item.value as number);
      case 'discounted': return filters.discounted;
      case 'roomFeatures': return (filters.roomFeatures || []).includes(item.value as number);
      case 'generalServices': return (filters.generalServices || []).includes(item.value as number);
      case 'outdoorAreas': return (filters.outdoorAreas || []).includes(item.value as number);
      case 'accessibilityFeatures': return (filters.accessibilityFeatures || []).includes(item.value as number);
      case 'neighbourhood': return (filters.neighbourhood || []).includes(item.value as string);
      case 'landmark': return (filters.landmark || []).includes(item.value as string);
      default: return false;
    }
  }, [filters]);

  // Toggle a recent individual filter on/off
  const toggleRecentFilter = useCallback((item: RecentIndividualFilter) => {
    const active = isItemActive(item);
    switch (item.type) {
      case 'starRating': { const v = item.value as number; updateFilters({ starRating: active ? (filters.starRating || []).filter(s => s !== v) : [...(filters.starRating || []), v] }, { saveRecent: false }); break; }
      case 'propertyTypes': { const v = item.value as number; updateFilters({ propertyTypes: active ? (filters.propertyTypes || []).filter(id => id !== v) : [...(filters.propertyTypes || []), v] }, { saveRecent: false }); break; }
      case 'discounted': updateFilters({ discounted: !active }, { saveRecent: false }); break;
      case 'roomFeatures': { const v = item.value as number; updateFilters({ roomFeatures: active ? (filters.roomFeatures || []).filter(id => id !== v) : [...(filters.roomFeatures || []), v] }, { saveRecent: false }); break; }
      case 'generalServices': { const v = item.value as number; updateFilters({ generalServices: active ? (filters.generalServices || []).filter(id => id !== v) : [...(filters.generalServices || []), v] }, { saveRecent: false }); break; }
      case 'outdoorAreas': { const v = item.value as number; updateFilters({ outdoorAreas: active ? (filters.outdoorAreas || []).filter(id => id !== v) : [...(filters.outdoorAreas || []), v] }, { saveRecent: false }); break; }
      case 'neighbourhood': { const v = item.value as string; updateFilters({ neighbourhood: active ? (filters.neighbourhood || []).filter(n => n !== v) : [...(filters.neighbourhood || []), v] }, { saveRecent: false }); break; }
      case 'landmark': { const v = item.value as string; updateFilters({ landmark: active ? (filters.landmark || []).filter(l => l !== v) : [...(filters.landmark || []), v] }, { saveRecent: false }); break; }
    }
  }, [filters, isItemActive, updateFilters]);

  // Map each filter group to its OWN API array (matches Hotel_front 6PropertyDetails groups)
  // Group 1 — General facilities  -> apiData.facilities
  // Group 2 — Additional facilities -> apiData.additionalFacilities
  // Group 3 — Activities          -> apiData.activities
  // Group 4 — Accessibility       -> apiData.accessibility_features
  const roomFeatureFacilities = apiData?.facilities || [];
  const generalServiceFacilities = apiData?.additionalFacilities || [];
  const outdoorFacilities = apiData?.activities || [];
  const accessibilityFacilities = apiData?.accessibility_features || [];

  // Build active filter chips list (for both sidebar top + above hotel cards)
  const activeFilterChips: { label: string; onRemove: () => void }[] = [];

  // Property types
  (filters.propertyTypes || []).forEach(id => {
    const type = apiData?.property_types?.find(pt => pt.id === id);
    if (type) {
      activeFilterChips.push({
        label: type.name_mn,
        onRemove: () => updateFilters({ propertyTypes: (filters.propertyTypes || []).filter(i => i !== id) })
      });
    }
  });

  // Star rating
  (filters.starRating || []).forEach(stars => {
    activeFilterChips.push({
      label: `${stars} ★`,
      onRemove: () => updateFilters({ starRating: (filters.starRating || []).filter(s => s !== stars) })
    });
  });

  // Discounted
  if (filters.discounted) {
    activeFilterChips.push({ label: t('search.filtersSection.discounted') || 'Хямдралтай', onRemove: () => updateFilters({ discounted: false }) });
  }

  // Price range
  if (priceBounds && filters.priceRange[1] < priceBounds[1]) {
    activeFilterChips.push({
      label: `≤₮${new Intl.NumberFormat('en-US').format(filters.priceRange[1])}`,
      onRemove: () => updateFilters({ priceRange: [priceBounds[0], priceBounds[1]] })
    });
  }

  // Room features (general facilities)
  (filters.roomFeatures || []).forEach(id => {
    const fac = apiData?.facilities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ roomFeatures: (filters.roomFeatures || []).filter(i => i !== id) }) });
  });

  // General services (additional facilities)
  (filters.generalServices || []).forEach(id => {
    const fac = apiData?.additionalFacilities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ generalServices: (filters.generalServices || []).filter(i => i !== id) }) });
  });

  // Outdoor areas (activities)
  (filters.outdoorAreas || []).forEach(id => {
    const fac = apiData?.activities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ outdoorAreas: (filters.outdoorAreas || []).filter(i => i !== id) }) });
  });

  // Accessibility features
  (filters.accessibilityFeatures || []).forEach(id => {
    const fac = apiData?.accessibility_features?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ accessibilityFeatures: (filters.accessibilityFeatures || []).filter(i => i !== id) }) });
  });

  // Neighbourhood chips
  (filters.neighbourhood || []).forEach(name => {
    activeFilterChips.push({ label: name, onRemove: () => updateFilters({ neighbourhood: (filters.neighbourhood || []).filter(n => n !== name) }) });
  });

  // Landmark chips
  (filters.landmark || []).forEach(id => {
    const lm = UB_LANDMARKS.find(l => l.id === id);
    if (lm) activeFilterChips.push({ label: lm.name_mn, onRemove: () => updateFilters({ landmark: (filters.landmark || []).filter(l => l !== id) }) });
  });

  // Derive unique soum/district options from all hotels (sorted by hotel count desc)
  const neighbourhoodOptions: { name: string; count: number }[] = (() => {
    const counts = new Map<string, number>();
    for (const h of hotels) {
      const loc = h.location?.soum || h.location?.district;
      if (loc && loc.trim()) {
        counts.set(loc.trim(), (counts.get(loc.trim()) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  })();

  if (embedded) {
    return (
      <>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('search.filtersSection.title')}</h3>

          {/* Active filter chips — top 5 shown in sidebar */}
          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeFilterChips.slice(0, 5).map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-600"
                >
                  <span className="max-w-22.5 truncate">{chip.label}</span>
                  <button
                    onClick={chip.onRemove}
                    className="shrink-0 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {activeFilterChips.length > 5 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center">+{activeFilterChips.length - 5}</span>
              )}
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 self-center ml-auto underline"
              >
                {t('search.filtersSection.clearAll') || 'Бүгдийг арилгах'}
              </button>
            </div>
          )}

          {/* ── Саяхны шүүлтүүр — individual filter checkboxes (last 5) ── */}
          {recentIndividualFilters.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.usedByYou') || 'Саяхны шүүлтүүр'}
              itemCount={recentIndividualFilters.length}
              initialShowCount={5}
              selectedCount={recentIndividualFilters.filter(item => isItemActive(item)).length}
              onClear={() => {
                setRecentIndividualFilters([]);
                try { localStorage.removeItem(RECENT_INDIVIDUAL_KEY); } catch { /* ignore */ }
              }}
            >
              {recentIndividualFilters.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleRecentFilter(item)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.label}</span>
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 1. Property type — only types present in results (all 14 as fallback if field absent) ── */}
          {apiData?.property_types && apiData.property_types.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.hotelType')}
              itemCount={apiData.property_types.length}
              initialShowCount={5}
              selectedCount={(filters.propertyTypes || []).length}
              onClear={() => updateFilters({ propertyTypes: [] })}
            >
              {apiData.property_types.map((pt) => {
                const isSelected = filters.propertyTypes?.includes(pt.id) || false;
                const count = filterCounts[`propertyType_${pt.id}`];
                return (
                  <label key={pt.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ propertyTypes: isSelected ? (filters.propertyTypes || []).filter(id => id !== pt.id) : [...(filters.propertyTypes || []), pt.id] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{pt.name_mn}</span>
                    {count !== undefined && count > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 2. Popular filters — top-covered facilities as quick-picks ── */}
          {(() => {
            const popularFacs = roomFeatureFacilities
              .filter(f => (filterCounts[`facility_${f.id}`] || 0) > 0)
              .sort((a, b) => (filterCounts[`facility_${b.id}`] || 0) - (filterCounts[`facility_${a.id}`] || 0))
              .slice(0, 4);
            if (popularFacs.length === 0) return null;
            return (
              <div className="space-y-1.5 border-b border-gray-200 dark:border-gray-600 pb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.popularSearches') || 'Түгээмэл шүүлтүүр'}</h4>
                {popularFacs.map((facility) => {
                  const isSelected = filters.roomFeatures?.includes(facility.id) || false;
                  return (
                    <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateFilters({ roomFeatures: isSelected ? (filters.roomFeatures || []).filter(id => id !== facility.id) : [...(filters.roomFeatures || []), facility.id] })}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                      {filterCounts[`facility_${facility.id}`] !== undefined && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                      )}
                    </label>
                  );
                })}
              </div>
            );
          })()}

          {/* ── 3. Budget — derived from current search results ── */}
          {priceBounds && priceBounds[1] > priceBounds[0] && totalResults >= 1 && (
            <div className="space-y-2 border-b border-gray-200 dark:border-gray-600 pb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.budget') || 'Төсөв'}</h4>
              {(() => {
                const sliderMax = Math.min(filters.priceRange?.[1] ?? priceBounds[1], priceBounds[1]);
                const fmt = (n: number) => '₮' + new Intl.NumberFormat('en-US').format(n);
                return (
                  <>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{fmt(priceBounds[0])}</span>
                      <span>{fmt(sliderMax)}</span>
                    </div>
                    <input
                      type="range"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                      step={Math.max(1000, Math.round((priceBounds[1] - priceBounds[0]) / 100))}
                      value={sliderMax}
                      onChange={(e) => updateFilters({ priceRange: [priceBounds[0], parseInt(e.target.value, 10)] }, { saveRecent: false })}
                      onMouseUp={(e) => updateFilters({ priceRange: [priceBounds[0], parseInt((e.target as HTMLInputElement).value, 10)] })}
                      onTouchEnd={(e) => updateFilters({ priceRange: [priceBounds[0], parseInt((e.target as HTMLInputElement).value, 10)] })}
                      onKeyUp={(e) => updateFilters({ priceRange: [priceBounds[0], parseInt((e.target as HTMLInputElement).value, 10)] })}
                      className="w-full accent-primary-600"
                    />
                  </>
                );
              })()}
            </div>
          )}

          {/* ── 4. Room facilities (Group 1: general_facilities) ── */}
          {roomFeatureFacilities.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.generalFacilities')}
              itemCount={roomFeatureFacilities.length}
              initialShowCount={4}
              selectedCount={(filters.roomFeatures || []).length}
              onClear={() => updateFilters({ roomFeatures: [] })}
            >
              {roomFeatureFacilities.map((facility) => {
                const isSelected = filters.roomFeatures?.includes(facility.id) || false;
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ roomFeatures: isSelected ? (filters.roomFeatures || []).filter(id => id !== facility.id) : [...(filters.roomFeatures || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`facility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 5. Property facilities (Group 2: additional_facilities) ── */}
          {generalServiceFacilities.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.additionalFacilities')}
              itemCount={generalServiceFacilities.length}
              initialShowCount={5}
              selectedCount={(filters.generalServices || []).length}
              onClear={() => updateFilters({ generalServices: [] })}
            >
              {generalServiceFacilities.map((facility) => {
                const isSelected = filters.generalServices?.includes(facility.id) || false;
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ generalServices: isSelected ? (filters.generalServices || []).filter(id => id !== facility.id) : [...(filters.generalServices || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`facility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 7. Property accessibility (Group 4) ── */}
          {accessibilityFacilities.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.accessibility')}
              itemCount={accessibilityFacilities.length}
              initialShowCount={3}
              selectedCount={(filters.accessibilityFeatures || []).length}
              onClear={() => updateFilters({ accessibilityFeatures: [] })}
            >
              {accessibilityFacilities.map((facility) => {
                const isSelected = filters.accessibilityFeatures?.includes(facility.id) || false;
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ accessibilityFeatures: isSelected ? (filters.accessibilityFeatures || []).filter(id => id !== facility.id) : [...(filters.accessibilityFeatures || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`accessibility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`accessibility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 9. Neighbourhood — derived from hotels in current results ── */}
          {neighbourhoodOptions.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.neighbourhood') || 'Хороолол'}
              itemCount={neighbourhoodOptions.length}
              initialShowCount={5}
              selectedCount={(filters.neighbourhood || []).length}
              onClear={() => updateFilters({ neighbourhood: [] })}
            >
              {neighbourhoodOptions.map(({ name, count }) => {
                const isSelected = (filters.neighbourhood || []).includes(name);
                return (
                  <label key={name} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ neighbourhood: isSelected ? (filters.neighbourhood || []).filter(n => n !== name) : [...(filters.neighbourhood || []), name] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{count}</span>
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 9b. Landmarks — popular UB landmarks ── */}
          {UB_LANDMARKS.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.landmarks') || 'Гол газрууд'}
              itemCount={UB_LANDMARKS.length}
              initialShowCount={5}
              selectedCount={(filters.landmark || []).length}
              onClear={() => updateFilters({ landmark: [] })}
            >
              {UB_LANDMARKS.map((lm) => {
                const count = hotels.filter(h => {
                  const d = (h.location?.soum || h.location?.district || '').toLowerCase();
                  return lm.districts.some(ld => d.includes(ld.toLowerCase()));
                }).length;
                const isSelected = (filters.landmark || []).includes(lm.id);
                return (
                  <label key={lm.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ landmark: isSelected ? (filters.landmark || []).filter(l => l !== lm.id) : [...(filters.landmark || []), lm.id] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{lm.name_mn}</span>
                    {count > 0 && <span className="text-xs text-gray-500 dark:text-gray-400">{count}</span>}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* ── 10. Discount ── */}
          {discountedCount > 0 && (
            <div className="space-y-2 border-b border-gray-200 dark:border-gray-600 pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.discounted}
                  onChange={(e) => updateFilters({ discounted: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1">
                  {t('search.filtersSection.discounted')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({discountedCount})</span>
              </label>
            </div>
          )}

          {/* ── 11. Star rating ── */}
          {apiData?.ratings && apiData.ratings.length > 0 && (
            <div className="space-y-2 border-b border-gray-200 dark:border-gray-600 pb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('search.filtersSection.hotelStars')}</h4>
              <div className="grid grid-cols-5 gap-1">
                {apiData.ratings.filter(r => r.rating !== 'N/A').map((rating) => {
                  const stars = parseInt(rating.rating.match(/\d+/)?.[0] || '0');
                  if (stars === 0) return null;
                  const isSelected = filters.starRating?.includes(stars) || false;
                  return (
                    <button
                      key={rating.id}
                      onClick={() => updateFilters({ starRating: isSelected ? (filters.starRating || []).filter(s => s !== stars) : [...(filters.starRating || []), stars] })}
                      className={`p-1.5 rounded-md border text-xs transition-all flex flex-col items-center justify-center ${
                        isSelected ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
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
          )}

          {/* ── 13. Fun things to do / Activities (Group 3) ── */}
          {outdoorFacilities.length > 0 && (
            <CollapsibleFilterSection
              title={t('search.filtersSection.activities')}
              itemCount={outdoorFacilities.length}
              initialShowCount={3}
              selectedCount={(filters.outdoorAreas || []).length}
              onClear={() => updateFilters({ outdoorAreas: [] })}
            >
              {outdoorFacilities.map((facility) => {
                const isSelected = filters.outdoorAreas?.includes(facility.id) || false;
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ outdoorAreas: isSelected ? (filters.outdoorAreas || []).filter(id => id !== facility.id) : [...(filters.outdoorAreas || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`facility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {loadingApi && (
            <div className="text-xs text-gray-500 dark:text-gray-400 py-2">{t('search.filtersSection.loading')}</div>
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Mobile filter view — use desktop sidebar for full filters.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
