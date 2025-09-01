'use client'
import { SearchHotelResult } from '@/types/api';
import ProfessionalHotelCard from '@/components/search/ProfessionalHotelCard';

interface HotelListProps {
  hotels: SearchHotelResult[];
  viewMode: 'list' | 'grid';
}


const HotelList: React.FC<HotelListProps> = ({ hotels, viewMode }) => {
  // Ensure hotels is always an array
  const safeHotels = Array.isArray(hotels) ? hotels : [];
  
  if (safeHotels.length === 0) {
    return (
      <div className="text-center py-20 relative">
        {/* Aceternity-style empty state background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 rounded-full filter blur-3xl animate-blob" />
        </div>
        
        <div className="relative z-10">
          {/* Animated empty state icon */}
          <div className="relative mb-6 inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-ping" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-xl">
              <svg className="w-16 h-16 mx-auto text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent">
            No hotels found
          </h3>
          
          <p className="text-gray-800 mb-6 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find any properties matching your criteria. Try adjusting your search parameters or removing some filters.
          </p>
          
          {/* Action suggestions */}
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
              Clear Filters
            </button>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
              Modify Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6'
        : 'space-y-4'
    }>
      {safeHotels.map((hotel) => (
        <ProfessionalHotelCard key={hotel.hotel_id} hotel={hotel} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default HotelList;