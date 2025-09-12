'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, MapPin, Grid3X3, List } from 'lucide-react';
import { TYPOGRAPHY } from '@/styles/containers';
import BookingStyleHotelCard from './BookingStyleHotelCard';
import SearchFilters from './SearchFilters';
import HotelSearchForm from './HotelSearchForm';
import { ApiService } from '@/services/api';
import { SearchResponse, SearchHotelResult } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view
  const [sortBy, setSortBy] = useState('price_low');
  const [filters] = useState<FilterState>({
    priceRange: [50000, 500000],
    starRating: [],
    facilities: [],
    roomTypes: []
  });

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
          console.log('Real API succeeded, got', response?.results?.length || 0, 'hotels');
          
          // Ensure response has proper structure
          const results = response?.results || [];
          const validResults = results.filter((hotel: SearchHotelResult) => 
            hotel && 
            hotel.hotel_id && 
            hotel.property_name && 
            hotel.location &&
            hotel.rating_stars
          );
          
          setHotels(validResults);
          setFilteredHotels(validResults);
        } catch (apiError) {
          // Fallback to mock data
          console.log('Real API failed, using mock data. Error:', apiError);
          try {
            const mockResults = await ApiService.searchHotelsMock(params) as SearchHotelResult[];
            console.log('Using mock data with', mockResults?.length || 0, 'hotels');
            
            // Validate mock data structure
            const validMockResults = (mockResults || []).filter((hotel: SearchHotelResult) => 
              hotel && 
              hotel.hotel_id && 
              hotel.property_name
            );
            
            setHotels(validMockResults);
            setFilteredHotels(validMockResults);
          } catch (mockError) {
            console.error('Mock data also failed:', mockError);
            setHotels([]);
            setFilteredHotels([]);
          }
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
      <div className="bg-white">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-12 bg-blue-500 rounded-lg"></div>
                <div className="h-12 bg-blue-500 rounded-lg"></div>
                <div className="h-12 bg-blue-500 rounded-lg"></div>
                <div className="h-12 bg-blue-500 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Loading Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Main Content */}
            <div className="flex-1 min-w-0">
              {/* Loading Header */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <Skeleton className="h-8 w-64 mb-4" />
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Loading Hotel Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                    <Skeleton className="h-48 w-full rounded-xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Compact Search Form Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HotelSearchForm />
        </div>
      </div>

      {/* Compact Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center text-xs text-gray-600 overflow-x-auto">
            <button 
              onClick={() => window.location.href = '/'}
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Нүүр хуудас
            </button>
            <span className="mx-1 text-gray-400">→</span>
            <span className="whitespace-nowrap">Хайлт</span>
            {searchLocation && (
              <>
                <span className="mx-1 text-gray-400">→</span>
                <span className="text-gray-800 whitespace-nowrap font-medium">{searchLocation}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Compact Filters Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Шүүлтүүр</span>
                  {(filters.starRating.length > 0 || filters.facilities.length > 0 || filters.roomTypes.length > 0) && (
                    <Badge variant="default" className="w-4 h-4 rounded-full p-0 text-xs font-bold flex items-center justify-center">
                      {filters.starRating.length + filters.facilities.length + filters.roomTypes.length}
                    </Badge>
                  )}
                </button>
                
                {/* Mobile Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-6 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-colors"
                  >
                    <option value="price_low">Бага үнэ</option>
                    <option value="price_high">Өндөр үнэ</option>
                    <option value="rating">Үнэлгээ</option>
                    <option value="name">Нэр</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Mobile View Toggle */}
              <div className="flex justify-center mt-3">
                <div className="flex bg-gray-100 p-0.5 rounded">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 border border-blue-200'
                        : 'text-gray-700'
                    }`}
                  >
                    <List className="w-3 h-3" />
                    <span>Жагсаалт</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 border border-blue-200'
                        : 'text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-3 h-3" />
                    <span>Грид</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Filters - Show directly in sidebar */}
            <div className="hidden lg:block">
              <SearchFilters
                isOpen={true}
                onClose={() => {}}
                onFilterChange={handleFilterChange}
                embedded={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Compact Search Results Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-6 mb-6 relative overflow-hidden">
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none"></div>
              <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Results Info */}
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchLocation ? `${searchLocation} дэх зочид буудлууд` : 'Зочид буудлууд'}
                  </h1>
                  
                  {/* Compact Search Details */}
                  <div className="space-y-2">
                    {checkIn && checkOut && (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-900 font-medium">{checkIn} - {checkOut}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                          <span className="text-gray-700 font-medium">
                            {searchParams.get('adults') || '2'} том хүн
                            {(searchParams.get('children') && parseInt(searchParams.get('children') || '0') > 0) && 
                              `, ${searchParams.get('children')} хүүхэд`}
                            {` • ${searchParams.get('rooms') || '1'} өрөө`}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Compact Results Count */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-600">
                        <span className="font-semibold text-sm text-gray-900">{filteredHotels.length}</span> зочид буудал олдлоо
                      </span>
                      {filteredHotels.length !== hotels.length && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {hotels.length}-с шүүгдсэн
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Controls - Hidden on mobile */}
                <div className="hidden lg:flex items-center gap-3">
                  {/* Compact Sort Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Эрэмбэлэх</label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors min-w-[140px]"
                    >
                      <option value="price_low">Үнэ: бага → их</option>
                      <option value="price_high">Үнэ: их → бага</option>
                      <option value="rating">Үнэлгээгээр</option>
                      <option value="name">Нэрээр А-Я</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-4">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Compact View Toggle */}
                  <div className="hidden sm:block">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Харагдах арга</label>
                    <div className="flex bg-gray-100 p-0.5 rounded">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                          viewMode === 'list'
                            ? 'bg-white text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <List className="w-4 h-4" />
                        <span>Жагсаалт</span>
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                          viewMode === 'grid'
                            ? 'bg-white text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                        <span>Грид</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Compact Results Layout */}
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

            {/* Professional Pagination */}
            {filteredHotels.length > 12 && (
              <div className="mt-12">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-800">
                      <span className="font-medium text-gray-900">1-12</span> из {filteredHotels.length} зочид буудлын үр дүн
                    </div>
                    
                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg border border-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Өмнөх</span>
                      </button>
                      
                      <div className="flex items-center gap-1 mx-2">
                        {[1, 2, 3, '...', 8].map((page, i) => (
                          <button
                            key={i}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                              page === 1
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'text-gray-900 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-lg border border-blue-200">
                        <span>Дараах</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional No Results State */}
            {filteredHotels.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="max-w-lg mx-auto">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-50 rounded-full -z-10 animate-pulse"></div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Зочид буудал олдсонгүй
                  </h3>
                  
                  <p className="text-gray-800 mb-2 text-lg leading-relaxed">
                    Таны хайлтын шалгуурт тохирох зочид буудал олдсонгүй.
                  </p>
                  
                  <p className="text-gray-900 mb-8">
                    Хайлтын нөхцөлөө өөрчилж эсвэл шүүлтүүрээ шинэчилж үзээрэй.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={() => {
                          // Clear filters logic would go here
                          console.log('Clear filters');
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                      >
                        Шүүлтүүр тайлах
                      </button>
                      <button 
                        onClick={() => {
                          // Navigate to new search
                          window.location.href = '/';
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                      >
                        Шинэ хайлт хийх
                      </button>
                    </div>
                    
                    {/* Popular destinations suggestion */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-800 mb-3">Алдартай хотод хайлт хийээрэй:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['Улаанбаатар', 'Мөрөн', 'Эрдэнэт'].map((city) => (
                          <button
                            key={city}
                            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-900 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            onClick={() => {
                              // Navigate to city search
                              const newParams = new URLSearchParams(searchParams.toString());
                              newParams.set('location', city);
                              window.location.href = `/search?${newParams.toString()}`;
                            }}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        />
      </div>
        </div>
      </div>
  );
}