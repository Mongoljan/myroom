'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HotelList from "@/components/hotels/HotelList";
import SearchFilters from "@/components/search/SearchFilters";
import ModernSearchBar from "@/components/search/ModernSearchBar";
import { ApiService } from '@/services/api';
import { SearchResponse } from '@/types/api';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [50000, 500000] as [number, number],
    starRating: [] as number[],
    facilities: [] as string[],
    roomTypes: [] as string[]
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Get search parameters - support both new and legacy parameters
        const searchApiParams: {
          check_in: string;
          check_out: string;
          adults: number;
          children: number;
          rooms: number;
          acc_type: string;
          name_id?: number;
          name?: string;
          province_id?: number;
          soum_id?: number;
          district?: string;
          location?: string;
        } = {
          check_in: searchParams.get('check_in') || '2025-09-01',
          check_out: searchParams.get('check_out') || '2025-09-03',
          adults: parseInt(searchParams.get('adults') || '2'),
          children: parseInt(searchParams.get('children') || '0'),
          rooms: parseInt(searchParams.get('rooms') || '1'),
          acc_type: 'hotel'
        };

        // Handle new enhanced search parameters
        const nameId = searchParams.get('name_id');
        const name = searchParams.get('name');
        const provinceId = searchParams.get('province_id');
        const soumId = searchParams.get('soum_id');
        const district = searchParams.get('district');
        const location = searchParams.get('location');

        if (nameId) {
          searchApiParams.name_id = parseInt(nameId);
        } else if (name) {
          searchApiParams.name = name;
        } else if (provinceId || soumId) {
          if (provinceId) searchApiParams.province_id = parseInt(provinceId);
          if (soumId) searchApiParams.soum_id = parseInt(soumId);
          if (district) searchApiParams.district = district;
        } else if (location) {
          // Fallback to legacy location parameter
          searchApiParams.location = location;
        }

        console.log('Search parameters:', searchApiParams);

        const data = await ApiService.searchHotels(searchApiParams);
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // You can add logic here to refetch results with filters applied
  };

  return (
    <>
      {/* Search Form Section */}
      <section className="pt-16 pb-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModernSearchBar />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-80">
              <SearchFilters 
                isOpen={true}
                onClose={() => {}}
                onFilterChange={handleFilterChange}
                embedded={true}
              />
            </div>

            {/* Mobile Filters Modal - Only show on mobile/tablet */}
            <div className="lg:hidden">
              <SearchFilters 
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                onFilterChange={handleFilterChange}
                embedded={false}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {loading ? 'Searching...' : `${searchResults?.count || 0} properties found`}
                  </h1>
                  <p className="text-xs text-gray-600 mt-1">
                    {searchParams.get('location') && `in ${searchParams.get('location')}`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Filter Toggle (Mobile) */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
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