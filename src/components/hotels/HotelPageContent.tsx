'use client';

import { useState, useEffect, useCallback } from 'react';
import { Suspense } from 'react';
import EnhancedHotelDetail from '@/components/hotels/EnhancedHotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import HotelReviews from '@/components/hotels/HotelReviews';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import HotelFAQ from '@/components/hotels/HotelFAQ';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

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

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  // Track this hotel as viewed when component mounts
  useEffect(() => {
    if (hotel) {
      console.log('Adding hotel to recently viewed:', hotel.property_name);
      addRecentlyViewed(hotel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel]);

  return (
    <div className="bg-gray-50">
      {/* Hero section with ID for sticky nav detection */}
      <div id="hotel-hero" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Rooms Section */}
          <div id="rooms">
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

          {/* Reviews Section */}
          <div id="reviews">
            <Suspense fallback={<div>Loading reviews...</div>}>
              <HotelReviews rating={parseFloat(hotel.rating_stars.value) || 0} reviewCount={0} />
            </Suspense>
          </div>

          {/* Facilities Section */}
          <div id="facilities">
            <HotelAmenities facilities={hotel.general_facilities} />
          </div>

          {/* FAQ Section */}
          <div id="faq">
            <HotelFAQ 
              hotelName={hotel.property_name} 
              hotelFacilities={hotel.general_facilities}
              hotelRating={parseFloat(hotel.rating_stars.value)}
            />
          </div>
        </div>

        {/* Similar Hotels */}
        <div className="mt-16">
          <SimilarHotels currentHotelId={hotel.hotel_id.toString()} />
        </div>
      </div>
    </div>
  );
}