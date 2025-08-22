'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import HotelList from '@/components/hotels/HotelList';

interface Hotel {
  hotel_id: number;
  property_name: string;
  location: {
    province_city: string;
    soum: string;
    district: string;
  };
  nights: number;
  rooms_possible: number;
  cheapest_room: {
    room_type_id: number;
    room_category_id: number;
    room_type_label: string;
    room_category_label: string;
    price_per_night: number;
    nights: number;
    available_in_this_type: number;
    capacity_per_room_adults: number;
    capacity_per_room_children: number;
    capacity_per_room_total: number;
    estimated_total_for_requested_rooms: number;
  };
  min_estimated_total: number;
  images: {
    cover: {
      url: string;
      description: string;
    };
    gallery: Array<{
      img: {
        url: string;
        description: string;
      };
    }>;
  };
  rating_stars: {
    id: number;
    label: string;
    value: string;
  };
  google_map: string;
  general_facilities: string[];
}

interface FilterState {
  priceRange: [number, number];
  rating: number;
  amenities: string[];
  propertyType: string[];
  cancellation: boolean;
}


export default function SearchResultsPage() {
  const { t } = useHydratedTranslation();
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    rating: 0,
    amenities: [],
    propertyType: [],
    cancellation: false
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const location = searchParams.get('location') || '';
        const checkIn = searchParams.get('check_in') || '2025-09-01';
        const checkOut = searchParams.get('check_out') || '2025-09-03';
        const adults = parseInt(searchParams.get('adults') || '2');
        const children = parseInt(searchParams.get('children') || '0');
        const rooms = parseInt(searchParams.get('rooms') || '1');
        const accType = searchParams.get('acc_type') || 'hotel';

        const response = await ApiService.searchHotels({
          location,
          check_in: checkIn,
          check_out: checkOut,
          adults,
          children,
          rooms,
          acc_type: accType
        });

        console.log('API Response:', response); // Debug log
        
        // Ensure response is an array - handle different possible response structures
        let hotelsArray = [];
        
        if (Array.isArray(response)) {
          hotelsArray = response;
        } else if (response && typeof response === 'object') {
          // Try different possible nested array properties
          hotelsArray = response.hotels || response.data || response.results || [];
        }
        
        console.log('Hotels Array:', hotelsArray); // Debug log
        
        setHotels(hotelsArray);
        setFilteredHotels(hotelsArray);
      } catch (err) {
        setError('Failed to fetch hotels. Please try again.');
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000000],
      rating: 0,
      amenities: [],
      propertyType: [],
      cancellation: false
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Summary */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} found
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {searchParams.get('location') || 'All locations'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {searchParams.get('check_in')} - {searchParams.get('check_out')}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {searchParams.get('adults')} adults, {searchParams.get('children')} children
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {viewMode === 'list' ? 'Grid View' : 'List View'}
                </button>
                
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="distance">Sort by Distance</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Map className="w-4 h-4" />
                {showMap ? 'Hide Map' : 'Show on map'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 bg-white p-6 h-screen overflow-y-auto sticky top-0"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Your budget (per night)</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₮0</span>
                      <span>₮{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <div className="flex-1">
          {showMap && (
            <div className="h-64 bg-blue-100 flex items-center justify-center border-b">
              <div className="text-center">
                <Map className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-600">Interactive Map View</p>
              </div>
            </div>
          )}

          {/* Hotel Results */}
          <div className="p-6">
            <HotelList hotels={filteredHotels} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}