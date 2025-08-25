'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, MapPin, Grid3X3, List } from 'lucide-react';
import HotelCard from './HotelCard';
import SearchFilters from './SearchFilters';
import HotelSearchForm from './HotelSearchForm';
import { ApiService } from '@/services/api';
import { SearchResponse, SearchHotelResult } from '@/types/api';

interface FilterState {
  priceRange: [number, number];
  starRating: number[];
  facilities: string[];
  roomTypes: string[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<SearchHotelResult[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<SearchHotelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price');

  // Load hotels from API or mock data
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      try {
        // Set default dates if not provided
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const params = {
          location: searchParams.get('location') || '',
          check_in: searchParams.get('check_in') || today,
          check_out: searchParams.get('check_out') || tomorrow,
          adults: parseInt(searchParams.get('adults') || '2'),
          children: parseInt(searchParams.get('children') || '0'),
          rooms: parseInt(searchParams.get('rooms') || '1'),
          acc_type: searchParams.get('acc_type') || 'hotel'
        };

        // Validate and fix dates
        if (!params.check_in || !params.check_out || params.check_in === params.check_out) {
          console.error('Invalid dates provided, using defaults');
          params.check_in = today;
          params.check_out = tomorrow;
        }

        // Ensure check_out is after check_in
        if (new Date(params.check_out) <= new Date(params.check_in)) {
          console.error('Check-out date must be after check-in date, fixing...');
          const checkInDate = new Date(params.check_in);
          checkInDate.setDate(checkInDate.getDate() + 1);
          params.check_out = checkInDate.toISOString().split('T')[0];
        }

        console.log('Final validated params:', params);

        try {
          // Try real API first
          console.log('Attempting real API call with params:', params);
          const response = await ApiService.searchHotels(params) as SearchResponse;
          console.log('Real API succeeded, got', response.results.length, 'hotels');
          setHotels(response.results);
          setFilteredHotels(response.results);
        } catch (apiError) {
          // Fallback to mock data
          console.log('Real API failed, using mock data. Error:', apiError);
          const mockResults = await ApiService.searchHotelsMock(params) as SearchHotelResult[];
          console.log('Using mock data with', mockResults.length, 'hotels');
          setHotels(mockResults);
          setFilteredHotels(mockResults);
        }
      } catch (error) {
        console.error('Error loading hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [searchParams]);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...hotels];

    // Filter by price range
    filtered = filtered.filter(hotel => {
      if (!hotel.cheapest_room) return true;
      const price = hotel.cheapest_room.price_per_night;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by star rating
    if (filters.starRating.length > 0) {
      filtered = filtered.filter(hotel => {
        const stars = parseInt(hotel.rating_stars.value.match(/\d+/)?.[0] || '0');
        return filters.starRating.includes(stars);
      });
    }

    // Filter by facilities
    if (filters.facilities.length > 0) {
      filtered = filtered.filter(hotel => {
        return filters.facilities.every(facility => 
          hotel.general_facilities.includes(facility)
        );
      });
    }

    // Filter by room types
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Form Header */}
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <HotelSearchForm />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-center gap-2 mb-6"
            >
              <Filter className="w-5 h-5" />
              Шүүлтүүр
            </button>

            {/* Filters */}
            <div className="hidden lg:block">
              <SearchFilters
                isOpen={true}
                onClose={() => {}}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchLocation ? `${searchLocation}-д ` : ''}Зочид буудлууд
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    {checkIn && checkOut && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{checkIn} - {checkOut}</span>
                      </div>
                    )}
                    <span>{filteredHotels.length} зочид буудал олдлоо</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="price_low">Үнээр (Бага → Их)</option>
                    <option value="price_high">Үнээр (Их → Бага)</option>
                    <option value="rating">Үнэлгээгээр</option>
                    <option value="name">Нэрээр</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="hidden md:flex border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-6'
              }
            `}>
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.hotel_id}
                  hotel={hotel}
                  searchParams={searchParams}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredHotels.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Зочид буудал олдсонгүй
                </h3>
                <p className="text-gray-600">
                  Өөр хайлтын үг эсвэл шүүлтүүр ашиглан дахин хайж үзээрэй.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <SearchFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}