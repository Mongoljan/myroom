'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchHotelResult } from '@/types/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyType {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface Facility {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface Rating {
  id: number;
  rating: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface AccessibilityFeature {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface BedType {
  id: number;
  name: string;
}

export interface CombinedApiData {
  property_types: PropertyType[];
  facilities: Facility[];
  additionalFacilities: Facility[];
  activities: Facility[];
  ratings: Rating[];
  province: Province[];
  accessibility_features: AccessibilityFeature[];
  bed_types?: BedType[];
}

export interface FilterState {
  propertyTypes: number[];
  roomFeatures: number[];
  generalServices: number[];
  outdoorAreas: number[];
  accessibilityFeatures: number[];
  starRating: number[];
  priceRange: [number, number];
  discounted: boolean;
  facilities: string[];
  roomTypes: string[];
  neighbourhood: string[];
  landmark: string[];
  bedTypes: number[];
}

export interface RecentFilter {
  id: string;
  label: string;
  filters: FilterState;
  timestamp: number;
}

export interface RecentIndividualFilter {
  id: string;
  type: string;
  value: string | number | boolean;
  label: string;
  timestamp: number;
}

export const DEFAULT_FILTERS: FilterState = {
  propertyTypes: [],
  priceRange: [0, 99_000_000],
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
  bedTypes: [],
};

// ─── Landmarks ────────────────────────────────────────────────────────────────

export const UB_LANDMARKS = [
  { id: 'sukhbaatar_square',   name_mn: 'Сүхбаатарын талбай',     districts: ['Сүхбаатар'] },
  { id: 'chinggis_statue',     name_mn: 'Чингис хааны хөшөө',      districts: ['Сүхбаатар'] },
  { id: 'intellectual_museum', name_mn: 'Оюуны өв музей',           districts: ['Сүхбаатар'] },
  { id: 'bogd_khan_palace',    name_mn: 'Богд хааны ордон',         districts: ['Хан-Уул'] },
  { id: 'zaisan',              name_mn: 'Зайсан цамхаг',            districts: ['Хан-Уул'] },
  { id: 'gandan',              name_mn: 'Гандантэгчинлэн хийд',     districts: ['Баянгол'] },
  { id: 'naran_tuul',          name_mn: 'Нараантуул зах',           districts: ['Баянзүрх', 'Баянгол'] },
  { id: 'state_store',         name_mn: 'Их дэлгүүр',               districts: ['Сүхбаатар'] },
];

// ─── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'hotel_search_filters';
const RECENT_FILTERS_KEY = 'hotel_recent_filters';
const RECENT_INDIVIDUAL_KEY = 'hotel_recent_individual_filters';

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseSearchFiltersOptions {
  onFilterChange: (filters: FilterState) => void;
  apiData?: CombinedApiData | null;
  externalFilters?: FilterState;
  filterCounts?: Record<string, number>;
  priceBounds?: [number, number];
  hotels?: SearchHotelResult[];
}

export function useSearchFilters({
  onFilterChange,
  apiData,
  externalFilters,
  filterCounts = {},
  priceBounds,
  hotels = [],
}: UseSearchFiltersOptions) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [recentFilters, setRecentFilters] = useState<RecentFilter[]>([]);
  const [recentIndividualFilters, setRecentIndividualFilters] = useState<RecentIndividualFilter[]>([]);

  const loadingApi = !apiData;
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // Sync when parent clears filters externally
  useEffect(() => {
    if (externalFilters && JSON.stringify(filters) !== JSON.stringify(externalFilters)) {
      setFilters(externalFilters);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(externalFilters)); } catch { /* ignore */ }
    }
  }, [externalFilters, filters]);

  // Generate a human-readable label for a filter combination
  const generateFilterLabel = useCallback((filterState: FilterState): string => {
    const parts: string[] = [];

    if (filterState.propertyTypes.length > 0) {
      const names = filterState.propertyTypes
        .map(id => apiData?.property_types.find(t => t.id === id)?.name_mn || '')
        .filter(Boolean);
      if (names.length) parts.push(names.join(', '));
    }

    if (filterState.priceRange[0] !== 0 || filterState.priceRange[1] !== 99_000_000) {
      const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
      parts.push(`₮${fmt(filterState.priceRange[0])}-${fmt(filterState.priceRange[1])}`);
    }

    if (filterState.starRating.length > 0) parts.push(`${filterState.starRating.join(',')} од`);
    if (filterState.discounted) parts.push('Хямдралтай');

    return parts.length > 0 ? parts.slice(0, 3).join(' • ') : 'Энгийн хайлт';
  }, [apiData]);

  const loadRecentFilters = useCallback(() => {
    try {
      const saved = localStorage.getItem(RECENT_FILTERS_KEY);
      if (saved) setRecentFilters((JSON.parse(saved) as RecentFilter[]).slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  const loadIndividualFilters = useCallback(() => {
    try {
      const saved = localStorage.getItem(RECENT_INDIVIDUAL_KEY);
      if (saved) setRecentIndividualFilters((JSON.parse(saved) as RecentIndividualFilter[]).slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFilters(parsed);
        onFilterChangeRef.current(parsed);
      }
    } catch { /* ignore */ }
    loadRecentFilters();
    loadIndividualFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveToRecentFilters = useCallback((filterState: FilterState) => {
    const isDefault =
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
      (filterState.landmark?.length ?? 0) === 0 &&
      (filterState.bedTypes?.length ?? 0) === 0;

    if (isDefault) return;

    try {
      const entry: RecentFilter = {
        id: `filter_${Date.now()}`,
        label: generateFilterLabel(filterState),
        filters: { ...filterState },
        timestamp: Date.now(),
      };
      setRecentFilters(prev => {
        const updated = [entry, ...prev.filter(f => f.label !== entry.label)].slice(0, 5);
        localStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch { /* ignore */ }
  }, [generateFilterLabel]);

  const saveIndividualFilter = useCallback((item: RecentIndividualFilter) => {
    try {
      setRecentIndividualFilters(prev => {
        const updated = [item, ...prev.filter(x => x.id !== item.id)].slice(0, 5);
        localStorage.setItem(RECENT_INDIVIDUAL_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch { /* ignore */ }
  }, []);

  const applyRecentFilter = useCallback((recentFilter: RecentFilter) => {
    setFilters(recentFilter.filters);
    onFilterChange(recentFilter.filters);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recentFilter.filters)); } catch { /* ignore */ }
  }, [onFilterChange]);

  const updateFilters = useCallback((
    newFilters: Partial<FilterState>,
    options: { saveRecent?: boolean } = {},
  ) => {
    const { saveRecent = true } = options;
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      onFilterChange(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        if (saveRecent) {
          saveToRecentFilters(updated);
          const ts = Date.now();
          const track = (id: string, type: string, value: string | number | boolean, label: string) =>
            saveIndividualFilter({ id, type, value, label, timestamp: ts });

          (updated.starRating || []).filter(s => !(prev.starRating || []).includes(s))
            .forEach(s => track(`starRating_${s}`, 'starRating', s, `${s}★`));
          (updated.propertyTypes || []).filter(id => !(prev.propertyTypes || []).includes(id))
            .forEach(id => { const pt = apiData?.property_types.find(p => p.id === id); if (pt) track(`propertyType_${id}`, 'propertyTypes', id, pt.name_mn); });
          if (updated.discounted && !prev.discounted)
            track('discounted', 'discounted', true, 'Хямдралтай');
          (updated.roomFeatures || []).filter(id => !(prev.roomFeatures || []).includes(id))
            .forEach(id => { const f = apiData?.facilities?.find(x => x.id === id); if (f) track(`roomFeature_${id}`, 'roomFeatures', id, f.name_mn); });
          (updated.generalServices || []).filter(id => !(prev.generalServices || []).includes(id))
            .forEach(id => { const f = apiData?.additionalFacilities?.find(x => x.id === id); if (f) track(`genService_${id}`, 'generalServices', id, f.name_mn); });
          (updated.outdoorAreas || []).filter(id => !(prev.outdoorAreas || []).includes(id))
            .forEach(id => { const f = apiData?.activities?.find(x => x.id === id); if (f) track(`outdoor_${id}`, 'outdoorAreas', id, f.name_mn); });
          (updated.neighbourhood || []).filter(n => !(prev.neighbourhood || []).includes(n))
            .forEach(n => track(`neighbourhood_${n}`, 'neighbourhood', n, n));
          (updated.landmark || []).filter(l => !(prev.landmark || []).includes(l))
            .forEach(l => { const lm = UB_LANDMARKS.find(x => x.id === l); if (lm) track(`landmark_${l}`, 'landmark', l, lm.name_mn); });
        }
      } catch { /* ignore */ }
      return updated;
    });
  }, [onFilterChange, saveToRecentFilters, saveIndividualFilter, apiData]);

  const handleClearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, [onFilterChange]);

  const isItemActive = useCallback((item: RecentIndividualFilter): boolean => {
    switch (item.type) {
      case 'starRating':           return (filters.starRating || []).includes(item.value as number);
      case 'propertyTypes':        return (filters.propertyTypes || []).includes(item.value as number);
      case 'discounted':           return filters.discounted;
      case 'roomFeatures':         return (filters.roomFeatures || []).includes(item.value as number);
      case 'generalServices':      return (filters.generalServices || []).includes(item.value as number);
      case 'outdoorAreas':         return (filters.outdoorAreas || []).includes(item.value as number);
      case 'accessibilityFeatures':return (filters.accessibilityFeatures || []).includes(item.value as number);
      case 'neighbourhood':        return (filters.neighbourhood || []).includes(item.value as string);
      case 'landmark':             return (filters.landmark || []).includes(item.value as string);
      default:                     return false;
    }
  }, [filters]);

  const toggleRecentFilter = useCallback((item: RecentIndividualFilter) => {
    const active = isItemActive(item);
    const on  = <T,>(arr: T[], v: T) => [...arr, v];
    const off = <T,>(arr: T[], v: T) => arr.filter(x => x !== v);
    switch (item.type) {
      case 'starRating':    { const v = item.value as number; updateFilters({ starRating:    active ? off(filters.starRating || [], v)    : on(filters.starRating || [], v)    }, { saveRecent: false }); break; }
      case 'propertyTypes': { const v = item.value as number; updateFilters({ propertyTypes: active ? off(filters.propertyTypes || [], v) : on(filters.propertyTypes || [], v) }, { saveRecent: false }); break; }
      case 'discounted':    updateFilters({ discounted: !active }, { saveRecent: false }); break;
      case 'roomFeatures':  { const v = item.value as number; updateFilters({ roomFeatures:  active ? off(filters.roomFeatures || [], v)  : on(filters.roomFeatures || [], v)  }, { saveRecent: false }); break; }
      case 'generalServices':{ const v = item.value as number; updateFilters({ generalServices: active ? off(filters.generalServices || [], v) : on(filters.generalServices || [], v) }, { saveRecent: false }); break; }
      case 'outdoorAreas':  { const v = item.value as number; updateFilters({ outdoorAreas:  active ? off(filters.outdoorAreas || [], v)  : on(filters.outdoorAreas || [], v)  }, { saveRecent: false }); break; }
      case 'neighbourhood': { const v = item.value as string; updateFilters({ neighbourhood: active ? off(filters.neighbourhood || [], v) : on(filters.neighbourhood || [], v) }, { saveRecent: false }); break; }
      case 'landmark':      { const v = item.value as string; updateFilters({ landmark:      active ? off(filters.landmark || [], v)      : on(filters.landmark || [], v)      }, { saveRecent: false }); break; }
    }
  }, [filters, isItemActive, updateFilters]);

  // ─── Derived data ────────────────────────────────────────────────────────────

  const roomFeatureFacilities  = apiData?.facilities             || [];
  const generalServiceFacilities = apiData?.additionalFacilities || [];
  const outdoorFacilities      = apiData?.activities             || [];
  const accessibilityFacilities = apiData?.accessibility_features || [];
  const bedTypeFacilities      = apiData?.bed_types              || [];

  const neighbourhoodOptions: { name: string; count: number }[] = (() => {
    const counts = new Map<string, number>();
    for (const h of hotels) {
      const loc = h.location?.soum || h.location?.district;
      if (loc?.trim()) counts.set(loc.trim(), (counts.get(loc.trim()) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  })();

  // Landmark hotel counts
  const landmarkCounts = UB_LANDMARKS.map(lm => ({
    ...lm,
    count: hotels.filter(h => {
      const d = (h.location?.soum || h.location?.district || '').toLowerCase();
      return lm.districts.some(ld => d.includes(ld.toLowerCase()));
    }).length,
  }));

  return {
    filters,
    recentFilters,
    recentIndividualFilters,
    setRecentIndividualFilters,
    loadingApi,
    updateFilters,
    handleClearAllFilters,
    applyRecentFilter,
    isItemActive,
    toggleRecentFilter,
    roomFeatureFacilities,
    generalServiceFacilities,
    outdoorFacilities,
    accessibilityFacilities,
    bedTypeFacilities,
    neighbourhoodOptions,
    landmarkCounts,
    filterCounts,
    priceBounds,
  };
}
