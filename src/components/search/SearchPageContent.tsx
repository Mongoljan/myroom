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

  const handleFilterChange = () => {
    // You can add logic here to refetch results with filters applied
  };

  return (
    <>
      {/* Aceternity-style Background System */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:60px_60px]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(15 23 42 / 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(15 23 42 / 0.04) 1px, transparent 1px)
              `,
              animation: 'grid-move 20s ease-in-out infinite alternate'
            }}
          />
        </div>
        
        {/* Aurora effect */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-80 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 -left-80 w-[800px] h-[800px] bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-400/20 via-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        </div>
        
        {/* Meteor shower effect */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-16 bg-gradient-to-b from-white/40 to-transparent rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: '-20%',
                transform: `rotate(45deg)`,
                animation: `meteor-fall ${3 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.8}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Search Form Section - Enhanced */}
      <section className="relative pt-16 pb-4 bg-gradient-to-br from-slate-50/80 via-blue-50/50 to-purple-50/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModernSearchBar />
        </div>
      </section>

      {/* Results Section - Enhanced */}
      <section className="relative py-4 bg-gradient-to-br from-white/90 via-slate-50/50 to-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-72">
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
              {/* Results Header - Enhanced */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div className="relative">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <div>
                        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32 animate-pulse" />
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-pulse mt-1" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {searchResults?.count || 0}
                        </span>
                        <span>properties found</span>
                        {searchResults?.count && searchResults.count > 0 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                        {/* DEBUG: Show current view mode */}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {viewMode} view
                        </span>
                      </h1>
                      <p className="text-sm text-gray-800 mt-1 flex items-center gap-1">
                        {searchParams.get('location') && (
                          <>
                            <span>in</span>
                            <span className="font-medium text-gray-900">{searchParams.get('location')}</span>
                          </>
                        )}
                        {searchParams.get('check_in') && searchParams.get('check_out') && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{searchParams.get('check_in')} to {searchParams.get('check_out')}</span>
                          </>
                        )}
                      </p>
                    </>
                  )}
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

                  {/* View Mode Toggle - List First (Default) */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 font-semibold ${viewMode === 'list' ? 'bg-green-600 text-white ring-2 ring-green-200' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                      title="List View (DEFAULT)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                      title="Grid View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hotel List - Enhanced loading with Aceternity-style skeletons */}
              {loading ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                  {[...Array(viewMode === 'grid' ? 6 : 3)].map((_, i) => (
                    <div key={i} className="group relative bg-gradient-to-br from-white/90 via-white/70 to-slate-50/50 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-xl">
                      {/* Aceternity shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      
                      {viewMode === 'list' ? (
                        <div className="flex flex-col md:flex-row animate-pulse">
                          <div className="md:w-80 h-64 md:h-auto bg-gradient-to-br from-slate-200/80 to-slate-300/80 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                          </div>
                          <div className="flex-1 p-6 space-y-4">
                            <div className="h-6 bg-gradient-to-r from-slate-200/80 to-slate-300/80 rounded-lg w-3/4 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer" />
                            </div>
                            <div className="h-4 bg-gradient-to-r from-slate-200/60 to-slate-300/60 rounded w-1/2 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer animation-delay-500" />
                            </div>
                            <div className="flex gap-2">
                              {[...Array(4)].map((_, j) => (
                                <div key={j} className="h-6 bg-gradient-to-r from-slate-200/60 to-slate-300/60 rounded-lg w-16 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer" style={{ animationDelay: `${j * 200}ms` }} />
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="space-y-2">
                                <div className="h-8 bg-gradient-to-r from-slate-200/80 to-slate-300/80 rounded-lg w-24 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer animation-delay-1000" />
                                </div>
                                <div className="h-4 bg-gradient-to-r from-slate-200/60 to-slate-300/60 rounded w-16" />
                              </div>
                              <div className="h-10 bg-gradient-to-r from-slate-200/80 to-slate-300/80 rounded-xl w-28 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer animation-delay-1500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-pulse">
                          <div className="h-56 bg-gradient-to-br from-slate-200/80 to-slate-300/80 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="h-5 bg-gradient-to-r from-slate-200/80 to-slate-300/80 rounded w-3/4 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer animation-delay-300" />
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="h-4 bg-gradient-to-r from-slate-200/60 to-slate-300/60 rounded w-1/3" />
                              <div className="h-4 bg-gradient-to-r from-slate-200/60 to-slate-300/60 rounded w-1/4" />
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, j) => (
                                <div key={j} className="w-7 h-7 bg-gradient-to-r from-slate-200/60 to-slate-300/60 rounded-lg" />
                              ))}
                            </div>
                            <div className="h-10 bg-gradient-to-r from-slate-200/80 to-slate-300/80 rounded-lg w-full relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer animation-delay-800" />
                            </div>
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