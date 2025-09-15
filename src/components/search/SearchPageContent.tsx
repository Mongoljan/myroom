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
  // FORCE LIST VIEW AS DEFAULT - DO NOT CHANGE
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Force list view on component mount
  useEffect(() => {
    console.log('FORCING LIST VIEW AS DEFAULT');
    setViewMode('list');
  }, []);
  
  // Debug log whenever viewMode changes
  useEffect(() => {
    console.log('VIEW MODE CHANGED TO:', viewMode);
  }, [viewMode]);
  const [showFilters, setShowFilters] = useState(false);

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

        console.log('URL Search Params from browser:', {
          name_id: nameId,
          name: name,
          province_id: provinceId,
          soum_id: soumId,
          district: district,
          location: location
        });

        if (nameId) {
          searchApiParams.name_id = parseInt(nameId);
          console.log('SearchPageContent - Setting name_id:', searchApiParams.name_id);
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

        console.log('Search parameters to send to API:', searchApiParams);

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

  const handleFilterChange = () => {
    // You can add logic here to refetch results with filters applied
  };

  return (
    <>
      {/* Subtle Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-white to-gray-50/30 pointer-events-none" />

      {/* Search Form Section - Material Texture */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' /%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ModernSearchBar />
        </div>
      </section>

      {/* Results Section - Clean */}
      <section className="relative py-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-64">
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
              {/* Results Header - Compact */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="relative">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg font-semibold text-gray-900">
                        {searchResults?.count || 0} зочид буудал олдлоо
                      </h1>
                      {(searchParams.get('location') || searchParams.get('name')) && (
                        <p className="text-sm text-gray-600 mt-0.5">
                          {searchParams.get('location') || searchParams.get('name')} • {searchParams.get('check_in')} - {searchParams.get('check_out')}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Filter Toggle (Mobile) */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Шүүлтүүр
                  </button>

                  {/* View Mode Toggle - Compact */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      title="List View"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      title="Grid View"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hotel List - Clean loading */}
              {loading ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                  {[...Array(viewMode === 'grid' ? 6 : 3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      
                      {viewMode === 'list' ? (
                        <div className="flex flex-col md:flex-row animate-pulse">
                          <div className="md:w-48 h-48 md:h-48 bg-gray-200" />
                          <div className="flex-1 p-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="flex gap-2">
                              {[...Array(3)].map((_, j) => (
                                <div key={j} className="h-6 bg-gray-200 rounded w-16" />
                              ))}
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                <div className="h-6 bg-gray-200 rounded w-24" />
                                <div className="h-3 bg-gray-200 rounded w-16" />
                              </div>
                              <div className="h-8 bg-gray-200 rounded w-24" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-pulse">
                          <div className="h-36 bg-gray-200" />
                          <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="flex gap-1">
                              {[...Array(3)].map((_, j) => (
                                <div key={j} className="h-5 bg-gray-200 rounded w-12" />
                              ))}
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-full" />
                          </div>
                        </div>
                      )}
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