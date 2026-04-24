'use client';

import { useState, useEffect, useCallback } from 'react';

import EnhancedHotelDetail from '@/components/hotels/EnhancedHotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

import { SearchHotelResult } from '@/types/api';

interface HotelPageContentProps {
  hotel: SearchHotelResult;
  searchParams?: { 
    check_in?: string; 
    check_out?: string; 
    guests?: string; 
  };
}

export default function HotelPageContent({ hotel, searchParams }: HotelPageContentProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const { addRecentlyViewed } = useRecentlyViewed();
  const { t } = useHydratedTranslation();

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  // Track this hotel as viewed when component mounts
  useEffect(() => {
    if (hotel) {
      addRecentlyViewed(hotel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero section with ID for sticky nav detection */}
      <div id="hotel-hero" className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div id="overview">
            <EnhancedHotelDetail hotel={hotel} />
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <HotelSubNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        hotelName={hotel.property_name}
        price={hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0}
      />

      {/* Content Sections - More Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-6">
          {/* Rooms Section */}
          <div id="rooms" className="">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('hotelDetails.selectRoom', 'Өрөө сонгох')}</h2>
            <ImprovedHotelRoomsSection
              hotelId={hotel.hotel_id}
              hotelName={hotel.property_name}
              checkIn={searchParams?.check_in}
              checkOut={searchParams?.check_out}
            />
          </div>

          {/* House Rules Section */}
          <div id="house-rules">
            <HotelHouseRules hotelId={hotel.hotel_id} hotelName={hotel.property_name} />
          </div>

          {/* Facilities Section */}
          <div id="facilities" className="">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('hotelDetails.facilities', 'Үйлчилгээ')}</h2>
            <HotelAmenities facilities={hotel.general_facilities} />
          </div>
        </div>


        {/* Similar Hotels */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('hotelDetails.similarHotels', 'Төстэй зочид буудлууд')}</h2>
          <SimilarHotels currentHotelId={hotel.hotel_id.toString()} />
        </div>
      </div>
    </div>
  );
}