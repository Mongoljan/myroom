'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingStyleHotelCard from './BookingStyleHotelCard';
import SearchFilters from './SearchFilters';
import { ApiService } from '@/services/api';
import { SearchResponse, SearchHotelResult } from '@/types/api';
import SearchHeader from './SearchHeader';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import SearchResultsHeader from './SearchResultsHeader';
import MobileFilterControls from './MobileFilterControls';
import NoResultsState from './NoResultsState';
import PaginationControls from './PaginationControls';
import { HotelSearchSpinner } from '@/components/ui/magic-spinner';

// Import the full CombinedApiData interface to match SearchFilters expectations
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
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('price_low');
  const [apiData, setApiData] = useState<CombinedApiData | null>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
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

  // Ref to guard against double invocation in React StrictMode
  const hasFetchedRef = useRef(false);

  // Track when header becomes sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load hotels from API or mock data
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);

      // Load API data for filters using proper ApiService
      try {
        const combinedData = await ApiService.getCombinedData();
        setApiData({
          property_types: combinedData.property_types || [],
          facilities: combinedData.facilities || [],
          ratings: combinedData.ratings || [],
          province: combinedData.province || [],
          accessibility_features: combinedData.accessibility_features || []
        });
      } catch (error) {
        console.warn('Failed to load combined API data:', error);
      }
      try {
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
          console.log('[SearchResults] API Response:', {
            hasResults: !!response,
            resultsCount: response?.results?.length || 0,
            totalCount: response?.count || 0
          });
          
          const results = response?.results || [];
          const validResults = results.filter((hotel: SearchHotelResult) =>
            hotel && hotel.hotel_id && hotel.property_name && hotel.location && hotel.rating_stars
          );

          console.log('[SearchResults] Valid results:', {
            total: results.length,
            valid: validResults.length,
            filtered: results.length - validResults.length
          });

          // If specific query expected but API returned many, attempt client-side narrow
          let finalResults = validResults;
          if (isSpecificQuery && params.name_id) {
            finalResults = validResults.filter(h => h.hotel_id === params.name_id);
          } else if (isSpecificQuery && params.name) {
            const needle = params.name.toLowerCase();
            finalResults = validResults.filter(h => h.property_name.toLowerCase().includes(needle));
          }

          console.log('[SearchResults] Final results:', finalResults.length);
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

  // Calculate filter counts for display (like booking.com)
  const getFilterCounts = useCallback(() => {
    const counts: Record<string, number> = {};

    if (!apiData?.facilities || hotels.length === 0) {
      return counts;
    }

    // Count facilities across all hotels
    apiData.facilities.forEach(facility => {
      counts[`facility_${facility.id}`] = hotels.filter(hotel =>
        hotel.general_facilities.some(hf =>
          hf.toLowerCase().includes(facility.name_en.toLowerCase())
        )
      ).length;
    });

    // Count price ranges
    const priceRanges = [
      { key: 'price_0_50000', min: 0, max: 50000 },
      { key: 'price_50000_100000', min: 50000, max: 100000 },
      { key: 'price_100000_200000', min: 100000, max: 200000 },
      { key: 'price_200000_300000', min: 200000, max: 300000 },
      { key: 'price_300000_500000', min: 300000, max: 500000 },
      { key: 'price_500000_plus', min: 500000, max: 1000000 },
    ];

    priceRanges.forEach(range => {
      counts[range.key] = hotels.filter(hotel => {
        const price = hotel.cheapest_room?.price_per_night || 0;
        return price >= range.min && price <= range.max;
      }).length;
    });

    // Count star ratings
    if (apiData.ratings) {
      apiData.ratings.forEach(rating => {
        const stars = parseInt(rating.rating.match(/\d+/)?.[0] || '0');
        if (stars > 0) {
          counts[`rating_${stars}`] = hotels.filter(hotel => {
            const hotelStars = parseInt(hotel.rating_stars.value.match(/\d+/)?.[0] || '0');
            return hotelStars === stars;
          }).length;
        }
      });
    }

    // Count property types - infer from property names or add logic
    if (apiData.property_types) {
      apiData.property_types.forEach(type => {
        // Count by property type - for now, assume all are hotels
        // TODO: Add property_type_id to hotel data for accurate counting
        if (type.name_en === 'Hotel') {
          counts[`property_${type.id}`] = hotels.filter(hotel =>
            hotel.property_name.toLowerCase().includes('hotel')
          ).length;
        } else if (type.name_en === 'Apartment') {
          counts[`property_${type.id}`] = hotels.filter(hotel =>
            hotel.property_name.toLowerCase().includes('apartment')
          ).length;
        } else if (type.name_en === 'GuestHouse') {
          counts[`property_${type.id}`] = hotels.filter(hotel =>
            hotel.property_name.toLowerCase().includes('guesthouse') ||
            hotel.property_name.toLowerCase().includes('guest house')
          ).length;
        } else {
          counts[`property_${type.id}`] = 0;
        }
      });
    }

    // Count room types from cheapest_room.room_type_label
    const roomTypes = [...new Set(hotels.map(h => h.cheapest_room?.room_type_label).filter(Boolean))];
    roomTypes.forEach(roomType => {
      counts[`room_type_${roomType}`] = hotels.filter(hotel =>
        hotel.cheapest_room?.room_type_label === roomType
      ).length;
    });

    // Count bed types from cheapest_room.room_category_label
    const bedTypes = [...new Set(hotels.map(h => h.cheapest_room?.room_category_label).filter(Boolean))];
    bedTypes.forEach(bedType => {
      counts[`bed_type_${bedType}`] = hotels.filter(hotel =>
        hotel.cheapest_room?.room_category_label === bedType
      ).length;
    });

    return counts;
  }, [hotels, apiData]);

  const filterCounts = getFilterCounts();

  const handleFilterChange = (newFilters: FilterState) => {
    // Update the filters state
    setFilters(newFilters);

    // Apply filters to hotels
    const filters = newFilters;
    // First filter out hotels without available room prices
    let filtered = hotels.filter(hotel => {
      // Only include hotels that have room pricing information
      return hotel.cheapest_room &&
             hotel.cheapest_room.price_per_night &&
             hotel.cheapest_room.price_per_night > 0;
    });

    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      // Note: Property type filtering would need property_type_id field from API
      // For now, we'll skip this filter since the field is not available in current hotel data
      console.log('Property type filtering - field not available in current API:', filters.propertyTypes);
    }

    // Filter by popular searches
    if (filters.popularSearches && filters.popularSearches.length > 0) {
      // Note: This would need to be implemented based on hotel features
      console.log('Popular search filtering not yet implemented:', filters.popularSearches);
    }

    // Filter by price range
    filtered = filtered.filter(hotel => {
      if (!hotel.cheapest_room) return true;
      const price = hotel.cheapest_room.price_per_night;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by room features (using facility IDs)
    if (filters.roomFeatures && filters.roomFeatures.length > 0) {
      filtered = filtered.filter(hotel => {
        // Map facility IDs to facility names using apiData
        const selectedFeatureNames = filters.roomFeatures.map(id => {
          const facility = apiData?.facilities?.find(f => f.id === id);
          return facility?.name_en || '';
        }).filter(name => name);

        // Check if hotel has any of the selected room features
        return selectedFeatureNames.some(featureName =>
          hotel.general_facilities.some(facility =>
            facility.toLowerCase().includes(featureName.toLowerCase())
          )
        );
      });
    }

    // Filter by general services (using facility IDs)
    if (filters.generalServices && filters.generalServices.length > 0) {
      filtered = filtered.filter(hotel => {
        // Map facility IDs to facility names using apiData
        const selectedServiceNames = filters.generalServices.map(id => {
          const facility = apiData?.facilities?.find(f => f.id === id);
          return facility?.name_en || '';
        }).filter(name => name);

        // Check if hotel has any of the selected general services
        return selectedServiceNames.some(serviceName =>
          hotel.general_facilities.some(facility =>
            facility.toLowerCase().includes(serviceName.toLowerCase())
          )
        );
      });
    }

    // Filter by bed types
    if (filters.bedTypes && filters.bedTypes.length > 0) {
      filtered = filtered.filter(hotel => {
        if (!hotel.cheapest_room) return false;
        // Check if hotel's room category matches selected bed types
        const roomCategory = hotel.cheapest_room.room_category_label.toLowerCase();
        return filters.bedTypes.some(bedType => {
          const bedTypeLower = bedType.toLowerCase();
          return roomCategory.includes(bedTypeLower) ||
                 roomCategory.includes(bedTypeLower.replace(' ор', '').replace('ор', ''));
        });
      });
    }

    // Filter by popular places
    if (filters.popularPlaces && filters.popularPlaces.length > 0) {
      filtered = filtered.filter(hotel => {
        const location = hotel.location;
        return filters.popularPlaces.some(place => {
          return location.province_city?.toLowerCase().includes(place.toLowerCase()) ||
                 location.soum?.toLowerCase().includes(place.toLowerCase()) ||
                 location.district?.toLowerCase().includes(place.toLowerCase());
        });
      });
    }

    // Filter by discounted
    if (filters.discounted) {
      // Note: This would need to be implemented based on pricing/discount data
      console.log('Discount filtering not yet implemented');
    }

    // Filter by star rating
    if (filters.starRating && filters.starRating.length > 0) {
      filtered = filtered.filter(hotel => {
        const stars = parseInt(hotel.rating_stars.value.match(/\d+/)?.[0] || '0');
        return filters.starRating.includes(stars);
      });
    }

    // Filter by outdoor areas (using facility IDs)
    if (filters.outdoorAreas && filters.outdoorAreas.length > 0) {
      filtered = filtered.filter(hotel => {
        // Map facility IDs to facility names using apiData
        const selectedOutdoorNames = filters.outdoorAreas.map(id => {
          const facility = apiData?.facilities?.find(f => f.id === id);
          return facility?.name_en || '';
        }).filter(name => name);

        // Check if hotel has any of the selected outdoor areas
        return selectedOutdoorNames.some(outdoorName =>
          hotel.general_facilities.some(facility =>
            facility.toLowerCase().includes(outdoorName.toLowerCase())
          )
        );
      });
    }

    // Filter by facilities (legacy support)
    if (filters.facilities.length > 0) {
      filtered = filtered.filter(hotel => {
        return filters.facilities.every(facility =>
          hotel.general_facilities.includes(facility)
        );
      });
    }

    // Filter by room types (legacy support)
    if (filters.roomTypes.length > 0) {
      filtered = filtered.filter(hotel => {
        if (!hotel.cheapest_room) return false;
        return filters.roomTypes.some(roomType =>
          hotel.cheapest_room!.room_type_label.includes(roomType)
        );
      });
    }

    setFilteredHotels(filtered);
  };

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    const sorted = [...filteredHotels];

    switch (sortValue) {
      case 'price_low':
        sorted.sort((a, b) => {
          const priceA = a.cheapest_room?.price_per_night || 0;
          const priceB = b.cheapest_room?.price_per_night || 0;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        sorted.sort((a, b) => {
          const priceA = a.cheapest_room?.price_per_night || 0;
          const priceB = b.cheapest_room?.price_per_night || 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => {
          const ratingA = parseInt(a.rating_stars.value.match(/\d+/)?.[0] || '0');
          const ratingB = parseInt(b.rating_stars.value.match(/\d+/)?.[0] || '0');
          return ratingB - ratingA;
        });
        break;
      case 'name':
        sorted.sort((a, b) => a.property_name.localeCompare(b.property_name));
        break;
      default:
        break;
    }

    setFilteredHotels(sorted);
  };

  const searchLocation = searchParams.get('location') || '';
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SearchHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HotelSearchSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SearchHeader />
   
      {/* <BreadcrumbNavigation searchLocation={searchLocation} /> */}

      {/* Main Results Container */}
      <div className="bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filters Sidebar with Sticky Behavior */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              {/* Mobile Filter Controls */}
              <div className="lg:hidden">
                <MobileFilterControls
                  filters={filters}
                  sortBy={sortBy}
                  viewMode={viewMode}
                  onShowFilters={() => setShowFilters(true)}
                  onSort={handleSort}
                  onViewModeChange={setViewMode}
                />
              </div>

              {/* Desktop Filters - Sticky with Independent Scroll */}
              <div className="hidden lg:block sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto custom-scrollbar">
                <SearchFilters
                  isOpen={true}
                  onClose={() => {}}
                  onFilterChange={handleFilterChange}
                  embedded={true}
                  apiData={apiData}
                  filters={filters}
                  filterCounts={filterCounts}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 ">
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
                filters={filters}
                apiData={apiData}
                onRemoveFilter={(filterType, value) => {
                  // Handle filter removal
                  const newFilters = { ...filters };

                  switch (filterType) {
                    case 'propertyTypes':
                      newFilters.propertyTypes = (filters.propertyTypes || []).filter(id => id !== value);
                      break;
                    case 'popularSearches':
                      newFilters.popularSearches = (filters.popularSearches || []).filter(search => search !== value);
                      break;
                    case 'priceRange':
                      newFilters.priceRange = [0, 1000000];
                      break;
                    case 'roomFeatures':
                      newFilters.roomFeatures = (filters.roomFeatures || []).filter(id => id !== value);
                      break;
                    case 'generalServices':
                      newFilters.generalServices = (filters.generalServices || []).filter(id => id !== value);
                      break;
                    case 'bedTypes':
                      newFilters.bedTypes = (filters.bedTypes || []).filter(bed => bed !== value);
                      break;
                    case 'popularPlaces':
                      newFilters.popularPlaces = (filters.popularPlaces || []).filter(place => place !== value);
                      break;
                    case 'discounted':
                      newFilters.discounted = false;
                      break;
                    case 'starRating':
                      if (typeof value === 'number') {
                        newFilters.starRating = (filters.starRating || []).filter(rating => rating !== value);
                      }
                      break;
                    case 'outdoorAreas':
                      newFilters.outdoorAreas = (filters.outdoorAreas || []).filter(id => id !== value);
                      break;
                    case 'facilities':
                      if (typeof value === 'string') {
                        newFilters.facilities = (filters.facilities || []).filter(facility => facility !== value);
                      }
                      break;
                    case 'roomTypes':
                      if (typeof value === 'string') {
                        newFilters.roomTypes = (filters.roomTypes || []).filter(roomType => roomType !== value);
                      }
                      break;
                  }

                  setFilters(newFilters);
                  handleFilterChange(newFilters);
                }}
                onClearAllFilters={() => {
                  const clearedFilters = {
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
                  setFilters(clearedFilters);
                  handleFilterChange(clearedFilters);
                }}
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

        {/* Mobile Filters Modal Only */}
        <div className="lg:hidden">
          <SearchFilters
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onFilterChange={handleFilterChange}
            apiData={apiData}
            filters={filters}
            filterCounts={filterCounts}
          />
        </div>
      </div>
    </div>
  );
}