'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import BookingStyleHotelCard from './BookingStyleHotelCard';
import { ApiService } from '@/services/api';
import { SearchResponse, SearchHotelResult } from '@/types/api';
import SearchHeader from './SearchHeader';
import SearchResultsHeader from './SearchResultsHeader';
import SearchFilters, { UB_LANDMARKS } from './SearchFilters';
import NoResultsState from './NoResultsState';
import PaginationControls from './PaginationControls';
import HotelsMapView from './HotelsMapView';
import HotelsMapPreview from './HotelsMapPreview';
import { getFacilityName } from '@/utils/facilities';
import { deriveFacets } from '@/utils/searchFacets';

interface PropertyType {
  id: number;
  name_en: string;
  name_mn: string;
}

interface Facility {
  id: number;
  name_en: string;
  name_mn: string;
}

interface Rating {
  id: number;
  rating: string;
}

interface Province {
  id: number;
  name: string;
}

interface AccessibilityFeature {
  id: number;
  name_en: string;
  name_mn: string;
}

interface CombinedApiData {
  property_types: PropertyType[];
  facilities: Facility[];
  additionalFacilities: Facility[];
  activities: Facility[];
  ratings: Rating[];
  province: Province[];
  accessibility_features: AccessibilityFeature[];
  bed_types?: Array<{ id: number; name: string }>;
  roomFacilities?: Array<{ id: number; name_en: string; name_mn: string }>;
}

interface FilterState {
  propertyTypes: number[];
  roomFeatures: number[];
  generalServices: number[];
  starRating: number[];
  outdoorAreas: number[];
  accessibilityFeatures: number[];
  priceRange: [number, number];
  discounted: boolean;
  facilities: string[];
  roomTypes: string[];
  neighbourhood: string[];
  landmark: string[];
  bedTypes: number[];
  roomFacilities: number[];
}

interface SearchParams {
  location?: string;
  name?: string;
  name_id?: number;
  province_id?: number;
  soum_id?: number;
  district?: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms: number;
  acc_type: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const { t } = useHydratedTranslation();
  const [hotels, setHotels] = useState<SearchHotelResult[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<SearchHotelResult[]>([]);
  const [apiData, setApiData] = useState<CombinedApiData | null>(null);
  const [allDataBedTypes, setAllDataBedTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    roomFeatures: [],
    generalServices: [],
    starRating: [],
    outdoorAreas: [],
    accessibilityFeatures: [],
    priceRange: [0, 99_000_000] as [number, number],
    discounted: false,
    facilities: [],
    roomTypes: [],
    neighbourhood: [],
    landmark: [],
    bedTypes: [],
    roomFacilities: [],
  });
  const [loading, setLoading] = useState(true);
  const [showMapView, setShowMapView] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('price_low');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState('');

  // Helper function to get price from cheapest_room (handles different API response formats)
  const getRoomPrice = (room: SearchHotelResult['cheapest_room']): number => {
    if (!room) return 0;
    return room.price_per_night_final || room.price_per_night || room.price_per_night_raw || 0;
  };

  // Track when header becomes sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load global reference data once on mount — independent of searchParams changes
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [apiDataResponse, allDataResponse] = await Promise.all([
          ApiService.getCombinedData(),
          ApiService.getAllData(),
        ]);
        const enrichedApiData = {
          ...apiDataResponse,
          roomFacilities: allDataResponse?.room_facilities || [],
        };
        setApiData(enrichedApiData);
        if (allDataResponse?.bed_types?.length) {
          setAllDataBedTypes(allDataResponse.bed_types);
        }
      } catch {
        // reference data optional — continue without it
      }
    };
    loadReferenceData();
  }, []); // empty deps: never re-fetches on search param changes

  // Load hotels from API
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);

      try {
        // Reference data is loaded separately above; just search here

        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const params: SearchParams = {
          check_in: searchParams.get('check_in') || today,
          check_out: searchParams.get('check_out') || tomorrow,
          adults: parseInt(searchParams.get('adults') || '2'),
          children: parseInt(searchParams.get('children') || '0'),
          rooms: parseInt(searchParams.get('rooms') || '1'),
          acc_type: searchParams.get('acc_type') || 'hotel'
        };

        // Add location parameters based on what's in the URL
        const nameId = searchParams.get('name_id');
        const name = searchParams.get('name');
        const provinceId = searchParams.get('province_id');
        const soumId = searchParams.get('soum_id');
        const district = searchParams.get('district');
  const location = searchParams.get('location');

        if (nameId) {
          params.name_id = parseInt(nameId);
        } else if (name) {
          params.name = name;
        } else if (provinceId || soumId) {
          if (provinceId) params.province_id = parseInt(provinceId);
          if (soumId) params.soum_id = parseInt(soumId);
          if (district) params.district = district;
        } else if (location && location.trim()) {
          params.location = location;
        }

        // Validate and fix dates
        if (!params.check_in || !params.check_out || params.check_in === params.check_out) {
          params.check_in = today;
          params.check_out = tomorrow;
        }

        // Ensure check_out is after check_in
        if (new Date(params.check_out) <= new Date(params.check_in)) {
          const checkInDate = new Date(params.check_in);
          checkInDate.setDate(checkInDate.getDate() + 1);
          params.check_out = checkInDate.toISOString().split('T')[0];
        }

        const isSpecificQuery = !!params.name_id || !!params.name; // single hotel expectation

        try {
          const response = await ApiService.searchHotels(params) as SearchResponse;
          
          const results = response?.results || [];
          
          const validResults = results.filter((hotel: SearchHotelResult) => {
            const isValid = hotel && hotel.hotel_id && hotel.property_name && hotel.location && hotel.rating_stars;
            return isValid;
          });

          // If specific query expected but API returned many, attempt client-side narrow
          let finalResults = validResults;
          if (isSpecificQuery && params.name_id) {
            finalResults = validResults.filter(h => h.hotel_id === params.name_id);
          } else if (isSpecificQuery && params.name) {
            const needle = params.name.toLowerCase();
            finalResults = validResults.filter(h => h.property_name.toLowerCase().includes(needle));
          }

          setHotels(finalResults);
          setFilteredHotels(finalResults);
        } catch (apiError) {
          if (isSpecificQuery) {
            // For specific queries, do NOT fallback to mock - show empty to be accurate
            setHotels([]);
            setFilteredHotels([]);
          } else {
            // Optional: could implement a lightweight fallback here. For now keep empty.
            setHotels([]);
            setFilteredHotels([]);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [searchParams]);

  // Handle sorting
  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy);
    const sorted = [...hotels];
    
    switch (newSortBy) {
      case 'price_low':
        sorted.sort((a, b) => getRoomPrice(a.cheapest_room) - getRoomPrice(b.cheapest_room));
        break;
      case 'price_high':
        sorted.sort((a, b) => getRoomPrice(b.cheapest_room) - getRoomPrice(a.cheapest_room));
        break;
      case 'rating':
        sorted.sort((a, b) => {
          const aRating = parseFloat(a.rating_stars.value.toString()) || 0;
          const bRating = parseFloat(b.rating_stars.value.toString()) || 0;
          return bRating - aRating;
        });
        break;
      case 'name':
        sorted.sort((a, b) => a.property_name.localeCompare(b.property_name));
        break;
      default:
        // Keep original order
        break;
    }
    
    setFilteredHotels(sorted);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Apply filters to hotels
    let filtered = hotels;
    
    // Filter by property types (using property_type field — now an object {id,name_en,name_mn})
    if (newFilters.propertyTypes && newFilters.propertyTypes.length > 0) {
      filtered = filtered.filter(hotel => {
        const pt = hotel.property_type;
        if (!pt) return false;
        if (typeof pt === 'object') {
          return newFilters.propertyTypes.includes(pt.id);
        }
        // Legacy string fall-back
        const selectedTypes = newFilters.propertyTypes
          .map(id => apiData?.property_types?.find(p => p.id === id))
          .filter(Boolean) as Array<{ id: number; name_en: string; name_mn: string }>;
        const t = pt.toLowerCase();
        return selectedTypes.some(p => {
          const en = (p.name_en || '').toLowerCase();
          const mn = (p.name_mn || '').toLowerCase();
          return (en && (t.includes(en) || en.includes(t))) || (mn && (t.includes(mn) || mn.includes(t)));
        });
      });
    }

    // Discounted only
    if (newFilters.discounted) {
      filtered = filtered.filter(hotel => {
        const r = hotel.cheapest_room;
        if (!r) return false;
        const raw = r.price_per_night_raw || r.price_per_night || 0;
        const adj = r.price_per_night_final || r.price_per_night || 0;
        return raw > 0 && adj > 0 && raw > adj;
      });
    }

    // Filter by price range
    if (newFilters.priceRange[0] !== 0 || newFilters.priceRange[1] !== 99_000_000) {
      filtered = filtered.filter(hotel => {
        if (!hotel.cheapest_room) return true;
        const price = getRoomPrice(hotel.cheapest_room);
        return price >= newFilters.priceRange[0] && price <= newFilters.priceRange[1];
      });
    }

    // Filter by star rating (API-driven)
    if (newFilters.starRating && newFilters.starRating.length > 0) {
      filtered = filtered.filter(hotel => {
        const stars = parseInt(hotel.rating_stars.value.match(/\d+/)?.[0] || '0');
        return newFilters.starRating.includes(stars);
      });
    }

    // Helper: check whether a hotel has a given facility option, matching
    // by ID first (reliable), then falling back to name substring match.
    const hotelHasFacility = (
      hotel: SearchHotelResult,
      option: { id: number; name_en?: string; name_mn?: string }
    ): boolean => {
      const targetEn = (option.name_en || '').toLowerCase();
      const targetMn = (option.name_mn || '').toLowerCase();
      return (hotel.general_facilities || []).some((f) => {
        if (typeof f === 'object' && f && typeof f.id === 'number' && f.id === option.id) return true;
        const en = getFacilityName(f, 'en').toLowerCase();
        const mn = getFacilityName(f, 'mn').toLowerCase();
        if (targetEn && en && (en.includes(targetEn) || targetEn.includes(en))) return true;
        if (targetMn && mn && (mn.includes(targetMn) || targetMn.includes(mn))) return true;
        return false;
      });
    };

    // Filter by room features (= General facilities, group 1)
    if (newFilters.roomFeatures && newFilters.roomFeatures.length > 0) {
      const opts = newFilters.roomFeatures
        .map(id => apiData?.facilities?.find(f => f.id === id))
        .filter(Boolean) as Array<{ id: number; name_en: string; name_mn: string }>;
      filtered = filtered.filter(hotel => opts.some(opt => hotelHasFacility(hotel, opt)));
    }

    // Filter by general services (= Additional facilities, group 2)
    if (newFilters.generalServices && newFilters.generalServices.length > 0) {
      const opts = newFilters.generalServices
        .map(id => apiData?.additionalFacilities?.find(f => f.id === id))
        .filter(Boolean) as Array<{ id: number; name_en: string; name_mn: string }>;
      filtered = filtered.filter(hotel => opts.some(opt => hotelHasFacility(hotel, opt)));
    }

    // Filter by outdoor areas (= Activities, group 3)
    if (newFilters.outdoorAreas && newFilters.outdoorAreas.length > 0) {
      const opts = newFilters.outdoorAreas
        .map(id => apiData?.activities?.find(f => f.id === id))
        .filter(Boolean) as Array<{ id: number; name_en: string; name_mn: string }>;
      filtered = filtered.filter(hotel => opts.some(opt => hotelHasFacility(hotel, opt)));
    }

    // Filter by accessibility features (group 4)
    if (newFilters.accessibilityFeatures && newFilters.accessibilityFeatures.length > 0) {
      const opts = newFilters.accessibilityFeatures
        .map(id => apiData?.accessibility_features?.find(f => f.id === id))
        .filter(Boolean) as Array<{ id: number; name_en: string; name_mn: string }>;
      filtered = filtered.filter(hotel => opts.some(opt => hotelHasFacility(hotel, opt)));
    }

    // Filter by bed types — hotel must have at least one matching bed type
    if (newFilters.bedTypes && newFilters.bedTypes.length > 0) {
      filtered = filtered.filter(hotel =>
        (hotel.bed_types || []).some(bt => newFilters.bedTypes.includes(bt.id))
      );
    }

    // Filter by room facilities (from cheapest_room.room_facilities)
    if (newFilters.roomFacilities && newFilters.roomFacilities.length > 0) {
      filtered = filtered.filter(hotel => {
        const roomFacs = hotel.cheapest_room?.room_facilities || [];
        return newFilters.roomFacilities.some(id => roomFacs.some(f => f.id === id));
      });
    }

    // Filter by neighbourhood (soum/district name match)
    if (newFilters.neighbourhood && newFilters.neighbourhood.length > 0) {
      filtered = filtered.filter(hotel => {
        const loc = (hotel.location?.soum || hotel.location?.district || '').toLowerCase();
        if (!loc) return false;
        return newFilters.neighbourhood.some(n =>
          loc.includes(n.toLowerCase()) || n.toLowerCase().includes(loc)
        );
      });
    }

    // Filter by landmark (district-based proximity) 
    if (newFilters.landmark && newFilters.landmark.length > 0) {
      filtered = filtered.filter(hotel => {
        const dist = (hotel.location?.soum || hotel.location?.district || '').toLowerCase();
        return newFilters.landmark.some(lmId => {
          const lm = UB_LANDMARKS.find(l => l.id === lmId);
          return lm?.districts.some(d => dist.includes(d.toLowerCase()));
        });
      });
    }

    // Apply name search at the end
    filtered = applyNameSearch(filtered);
    setFilteredHotels(filtered);
  };

  const clearAllFilters = () => handleFilterChange({
    propertyTypes: [], roomFeatures: [], generalServices: [], starRating: [],
    outdoorAreas: [], accessibilityFeatures: [], discounted: false,
    priceRange: [0, 99_000_000], facilities: [], roomTypes: [],
    neighbourhood: [], landmark: [], bedTypes: [], roomFacilities: [],
  });

  // Handle name search
  const handleSearchByName = useCallback((query: string) => {
    setNameSearchQuery(query);
    if (!query.trim()) {
      setFilteredHotels(hotels);
      return;
    }
    
    const filtered = hotels.filter(hotel =>
      hotel.property_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredHotels(filtered);
  }, [hotels]);

  // Latin to Cyrillic character mapping for Mongolian
  const latinToCyrillic: Record<string, string> = {
    'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'yo': 'ё',
    'zh': 'ж', 'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м',
    'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
    'f': 'ф', 'h': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'shch': 'щ',
    'yu': 'ю', 'ya': 'я', 'ö': 'ө', 'ü': 'ү'
  };

  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ю': 'yu', 'я': 'ya', 'ө': 'ö', 'ү': 'ü'
  };

  const normalizeSearchText = (text: string): string[] => {
    const lower = text.toLowerCase();
    const variations: string[] = [lower];

    // Create both Latin and Cyrillic variations
    let latinVersion = '';
    let cyrillicVersion = '';

    for (const char of lower) {
      if (latinToCyrillic[char]) {
        cyrillicVersion += latinToCyrillic[char];
        latinVersion += char;
      } else if (cyrillicToLatin[char]) {
        latinVersion += cyrillicToLatin[char];
        cyrillicVersion += char;
      } else {
        latinVersion += char;
        cyrillicVersion += char;
      }
    }

    if (latinVersion !== lower) variations.push(latinVersion);
    if (cyrillicVersion !== lower) variations.push(cyrillicVersion);

    return [...new Set(variations)];
  };

  const applyNameSearch = (hotelsToFilter: SearchHotelResult[]) => {
    if (!nameSearchQuery.trim()) {
      return hotelsToFilter;
    }

    const searchVariations = normalizeSearchText(nameSearchQuery);

    return hotelsToFilter.filter(hotel => {
      const hotelName = hotel.property_name.toLowerCase();
      // Check if hotel name starts with any of the search variations
      return searchVariations.some(variation =>
        hotelName.startsWith(variation) || hotelName.includes(variation)
      );
    });
  };

  const searchLocation = searchParams.get('location') || '';
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';

  // Derive available filter facets from current search results so the
  // sidebar only shows options that exist in this result set, with counts.
  const facets = useMemo(() => deriveFacets(hotels, apiData, allDataBedTypes), [hotels, apiData, allDataBedTypes]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <SearchHeader />
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col">
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">

              {/* Sidebar skeleton */}
              <div className="hidden lg:flex lg:flex-col lg:w-80 shrink-0 min-h-0">
                <div className="flex-1 min-h-0 overflow-hidden pr-1 space-y-3">
                  {/* Map preview placeholder */}
                  <div className="h-[150px] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  {/* Filter skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main content skeleton */}
              <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
                {/* Header row skeleton */}
                <div className="shrink-0 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 mb-2">
                  <div className="space-y-1.5">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3.5 w-32 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-44 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    <div className="h-8 w-52 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>
                </div>

                {/* Hotel card skeletons */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row"
                      style={{ opacity: 1 - i * 0.12 }}
                    >
                      {/* Image area */}
                      <div className="w-full md:w-60 h-[160px] md:h-[240px] flex-shrink-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />

                      {/* Content area */}
                      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                        <div className="space-y-2">
                          {/* Name + stars */}
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse" />
                          </div>
                          {/* Location */}
                          <div className="h-3.5 w-1/2 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse" />
                        </div>

                        {/* Room info row */}
                        <div className="space-y-1.5">
                          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-3 w-56 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse" />
                          {/* Facility tags */}
                          <div className="flex gap-1.5 pt-0.5">
                            {[60, 80, 72].map((w, j) => (
                              <div key={j} className={`h-5 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse`} style={{ width: w }} />
                            ))}
                          </div>
                        </div>

                        {/* Price + button — pushed right */}
                        <div className="flex justify-end items-end gap-4">
                          <div className="space-y-1 text-right">
                            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
                            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700/60 rounded animate-pulse ml-auto" />
                          </div>
                          <div className="h-8 w-28 bg-primary/20 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <SearchHeader />

      {/* Main Results Container — fills remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col">
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
            {/* Sidebar - Desktop only, independently scrollable */}
            <div className="hidden lg:flex lg:flex-col lg:w-80 shrink-0 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin space-y-3 pr-1">
                {/* Inline map preview above filters */}
                {filteredHotels.length > 0 && (
                  <HotelsMapPreview
                    hotels={filteredHotels}
                    onExpand={() => setShowMapView(true)}
                    height={150}
                  />
                )}
                <SearchFilters
                  isOpen={true}
                  onClose={() => {}}
                  onFilterChange={handleFilterChange}
                  embedded={true}
                  apiData={facets.narrowedApiData}
                  filters={filters}
                  filterCounts={facets.filterCounts}
                  priceBounds={[facets.priceMin, facets.priceMax]}
                  discountedCount={facets.discountedCount}
                  totalResults={hotels.length}
                  hotels={hotels}
                />
              </div>
            </div>
            {/* Main Content — sticky header + independently scrollable cards */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
              {/* Pinned header row: count, map link, sort, name search */}
              <div className="shrink-0">
                <SearchResultsHeader
                  searchLocation={searchLocation}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  adults={searchParams.get('adults') || undefined}
                  childrenCount={searchParams.get('children') || undefined}
                  rooms={searchParams.get('rooms') || undefined}
                  filteredCount={filteredHotels.length}
                  totalCount={hotels.length}
                  sortBy={sortBy}
                  viewMode={viewMode}
                  onSort={handleSort}
                  onViewModeChange={setViewMode}
                  onShowMapView={() => setShowMapView(true)}
                  onSearchByName={handleSearchByName}
                />
              </div>
              <div className="h-2 shrink-0"></div>

              {/* Scrollable hotel cards area */}
              <div className="flex-1 min-h-0 overflow-y-auto">

              {/* Active filter chips — shown above hotel card list */}
              {(() => {
                const chips: { label: string; onRemove: () => void }[] = [];
                const priceBounds: [number, number] = [facets.priceMin, facets.priceMax];

                (filters.propertyTypes || []).forEach(id => {
                  const t = apiData?.property_types?.find(pt => pt.id === id);
                  if (t) chips.push({ label: t.name_mn, onRemove: () => handleFilterChange({ ...filters, propertyTypes: filters.propertyTypes.filter(i => i !== id) }) });
                });

                (filters.starRating || []).forEach(stars => {
                  chips.push({ label: `${stars} ★`, onRemove: () => handleFilterChange({ ...filters, starRating: filters.starRating.filter(s => s !== stars) }) });
                });

                if (filters.discounted) {
                  chips.push({ label: 'Хямдралтай', onRemove: () => handleFilterChange({ ...filters, discounted: false }) });
                }

                if (priceBounds[1] > priceBounds[0] && filters.priceRange[1] < priceBounds[1]) {
                  chips.push({ label: `≤₮${new Intl.NumberFormat('en-US').format(filters.priceRange[1])}`, onRemove: () => handleFilterChange({ ...filters, priceRange: [priceBounds[0], priceBounds[1]] }) });
                }

                (filters.roomFeatures || []).forEach(id => {
                  const f = apiData?.facilities?.find(fac => fac.id === id);
                  if (f) chips.push({ label: f.name_mn, onRemove: () => handleFilterChange({ ...filters, roomFeatures: filters.roomFeatures.filter(i => i !== id) }) });
                });

                (filters.generalServices || []).forEach(id => {
                  const f = apiData?.additionalFacilities?.find(fac => fac.id === id);
                  if (f) chips.push({ label: f.name_mn, onRemove: () => handleFilterChange({ ...filters, generalServices: filters.generalServices.filter(i => i !== id) }) });
                });

                (filters.outdoorAreas || []).forEach(id => {
                  const f = apiData?.activities?.find(fac => fac.id === id);
                  if (f) chips.push({ label: f.name_mn, onRemove: () => handleFilterChange({ ...filters, outdoorAreas: filters.outdoorAreas.filter(i => i !== id) }) });
                });

                (filters.accessibilityFeatures || []).forEach(id => {
                  const f = apiData?.accessibility_features?.find(fac => fac.id === id);
                  if (f) chips.push({ label: f.name_mn, onRemove: () => handleFilterChange({ ...filters, accessibilityFeatures: filters.accessibilityFeatures.filter(i => i !== id) }) });
                });

                (filters.bedTypes || []).forEach(id => {
                  const bt = facets.narrowedApiData.bed_types?.find(b => b.id === id);
                  if (bt) chips.push({ label: bt.name, onRemove: () => handleFilterChange({ ...filters, bedTypes: (filters.bedTypes || []).filter(i => i !== id) }) });
                });

                (filters.neighbourhood || []).forEach(name => {
                  chips.push({ label: name, onRemove: () => handleFilterChange({ ...filters, neighbourhood: (filters.neighbourhood || []).filter(n => n !== name) }) });
                });

                (filters.landmark || []).forEach(lmId => {
                  const lm = UB_LANDMARKS.find(l => l.id === lmId);
                  if (lm) chips.push({ label: lm.name_mn, onRemove: () => handleFilterChange({ ...filters, landmark: (filters.landmark || []).filter(l => l !== lmId) }) });
                });

                if (chips.length === 0) return null;

                return (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {chips.map((chip, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-medium border border-primary-200 dark:border-primary-700"
                      >
                        {chip.label}
                        <button onClick={chip.onRemove} className="hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline self-center"
                    >
                      {t('search.filtersSection.clearAll') || 'Clear all'}
                    </button>
                  </div>
                );
              })()
              }

              {/* Results Layout */}
              {filteredHotels.length > 0 ? (
                <>
                  <div className={`
                    ${viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 auto-rows-fr'
                      : 'space-y-3'
                    }
                  `}>
                    {filteredHotels.map((hotel, index) => (
                      <div
                        key={hotel.hotel_id}
                        className="group"
                        style={{
                          animationName: 'fadeInUp',
                          animationDuration: '0.6s',
                          animationTimingFunction: 'ease-out',
                          animationFillMode: 'forwards',
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <BookingStyleHotelCard
                          hotel={hotel}
                          searchParams={searchParams}
                          viewMode={viewMode}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add CSS animation */}
                  <style jsx>{`
                    @keyframes fadeInUp {
                      from {
                        opacity: 0;
                        transform: translateY(20px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>

                  <PaginationControls totalResults={filteredHotels.length} />
                </>
              ) : (
                <NoResultsState searchParams={searchParams} onClearFilters={clearAllFilters} />
              )}
              </div>{/* end scrollable hotel cards */}
            </div>{/* end main content column */}
          </div>{/* end flex row */}
        </div>{/* end max-w container */}
      </div>{/* end content area */}

      {/* Full Map View */}
      {showMapView && (
        <HotelsMapView
          hotels={filteredHotels}
          onClose={() => setShowMapView(false)}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}