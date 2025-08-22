'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header1 from "@/components/header/Header1";
import HotelList from "@/components/hotels/HotelList";
import SearchFilters from "@/components/hotels/SearchFilters";
import SearchForm from "@/components/hero/SearchForm";

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

interface SearchResults {
  count: number;
  next: string | null;
  previous: string | null;
  results: Hotel[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        // Get search parameters
        const location = searchParams.get('location') || '';
        const checkIn = searchParams.get('check_in') || '2025-09-01';
        const checkOut = searchParams.get('check_out') || '2025-09-03';
        const adults = searchParams.get('adults') || '2';
        const children = searchParams.get('children') || '0';
        const rooms = searchParams.get('rooms') || '1';
        
        params.append('location', location);
        params.append('check_in', checkIn);
        params.append('check_out', checkOut);
        params.append('adults', adults);
        params.append('children', children);
        params.append('rooms', rooms);
        params.append('acc_type', 'hotel');

        const response = await fetch(`https://dev.kacc.mn/api/search?${params.toString()}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  return (
    <>
      <Header1 />
      
      {/* Search Form Section */}
      <section className="pt-24 pb-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <SearchForm />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <SearchFilters />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {loading ? 'Searching...' : `${searchResults?.count || 0} properties found`}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {searchParams.get('location') && `in ${searchParams.get('location')}`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Filter Toggle (Mobile) */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Filters
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hotel List */}
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-80 h-64 md:h-auto bg-gray-200"></div>
                        <div className="flex-1 p-6 space-y-4">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="flex gap-2">
                            {[...Array(4)].map((_, j) => (
                              <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                            ))}
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="space-y-2">
                              <div className="h-8 bg-gray-200 rounded w-24"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <HotelList 
                  hotels={searchResults?.results || []} 
                  viewMode={viewMode}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}