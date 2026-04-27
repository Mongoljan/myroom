'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingStyleHotelCard from './BookingStyleHotelCard';
import { ApiService } from '@/services/api';
import { SearchResponse, SearchHotelResult } from '@/types/api';
import SearchHeader from './SearchHeader';
import SearchResultsHeader from './SearchResultsHeader';
import SearchFilters from './SearchFilters';
import NoResultsState from './NoResultsState';
import PaginationControls from './PaginationControls';
import { HotelSearchSpinner } from '@/components/ui/magic-spinner';
import HotelsMapView from './HotelsMapView';
import { getFacilityName } from '@/utils/facilities';

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
  ratings: Rating[];
  province: Province[];
  accessibility_features: AccessibilityFeature[];
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
  const [hotels, setHotels] = useState<SearchHotelResult[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<SearchHotelResult[]>([]);
  const [apiData, setApiData] = useState<CombinedApiData | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    roomFeatures: [],
    generalServices: [],
    starRating: [],
    outdoorAreas: [],
    priceRange: [0, 1000000] as [number, number],
    discounted: false,
    facilities: [],
    roomTypes: []
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
    return room.price_per_night || room.price_per_night_adjusted || room.price_per_night_raw || 0;
  };

  // Track when header becomes sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load hotels from API
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);

      try {
        // Load combined API data for backend functionality
        const loadApiData = async () => {
          try {
            const apiDataResponse = await ApiService.getCombinedData();
            setApiData(apiDataResponse);
          } catch (error) {
            console.error('Error loading API data:', error);
          }
        };

        // Start loading API data in parallel
        loadApiData();

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
          console.error('Primary search API failed:', apiError);
          console.error('API Error details:', {
            message: apiError instanceof Error ? apiError.message : 'Unknown error',
            params,
            baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.kacc.mn/api',
            isDevelopment: process.env.NODE_ENV === 'development',
            isProduction: process.env.NODE_ENV === 'production'
          });
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
        console.error('Error loading hotels:', error);
        console.error('Full error stack:', error);
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
    
    // Filter by property types (API-driven)
    if (newFilters.propertyTypes && newFilters.propertyTypes.length > 0) {
      // This would need the property_type_id field in hotel data to work properly
      // For now, we'll skip this filter since the field might not be available
    }

    // Filter by price range
    if (newFilters.priceRange[0] !== 0 || newFilters.priceRange[1] !== 1000000) {
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

    // Filter by room features (API-driven using facility IDs)
    if (newFilters.roomFeatures && newFilters.roomFeatures.length > 0) {
      filtered = filtered.filter(hotel => {
        const selectedFeatureNames = newFilters.roomFeatures.map(id => {
          const facility = apiData?.facilities?.find(f => f.id === id);
          return facility?.name_en || '';
        }).filter(name => name);

        return selectedFeatureNames.some(featureName =>
          hotel.general_facilities.some(facility =>
            getFacilityName(facility, 'en').toLowerCase().includes(featureName.toLowerCase())
          )
        );
      });
    }

    // Filter by general services (API-driven using facility IDs)
    if (newFilters.generalServices && newFilters.generalServices.length > 0) {
      filtered = filtered.filter(hotel => {
        const selectedServiceNames = newFilters.generalServices.map(id => {
          const facility = apiData?.facilities?.find(f => f.id === id);
          return facility?.name_en || '';
        }).filter(name => name);

        return selectedServiceNames.some(serviceName =>
          hotel.general_facilities.some(facility =>
            getFacilityName(facility, 'en').toLowerCase().includes(serviceName.toLowerCase())
          )
        );
      });
    }

    // Filter by outdoor areas (API-driven using facility IDs)  
    if (newFilters.outdoorAreas && newFilters.outdoorAreas.length > 0) {
      filtered = filtered.filter(hotel => {
        const selectedOutdoorNames = newFilters.outdoorAreas.map(id => {
          const facility = apiData?.facilities?.find(f => f.id === id);
          return facility?.name_en || '';
        }).filter(name => name);

        return selectedOutdoorNames.some(outdoorName =>
          hotel.general_facilities.some(facility =>
            getFacilityName(facility, 'en').toLowerCase().includes(outdoorName.toLowerCase())
          )
        );
      });
    }

    // Apply name search at the end
    filtered = applyNameSearch(filtered);
    setFilteredHotels(filtered);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <SearchHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HotelSearchSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <SearchHeader />

      {/* <BreadcrumbNavigation searchLocation={searchLocation} /> */}

      {/* Main Results Container */}
      <div className="">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-3">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Desktop only */}
            <div className="hidden lg:block lg:w-80 shrink-0">
              <SearchFilters
                isOpen={true}
                onClose={() => {}}
                onFilterChange={handleFilterChange}
                embedded={true}
                apiData={apiData}
                filters={filters}
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
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
              <div className="h-2"></div>

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
                <NoResultsState searchParams={searchParams} />
              )}
            </div>
          </div>
        </div>
      </div>

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