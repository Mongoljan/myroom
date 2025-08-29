'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import HotelDetail from '@/components/hotels/HotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import HotelReviews from '@/components/hotels/HotelReviews';
import BookingCard from '@/components/hotels/BookingCard';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import HotelFAQ from '@/components/hotels/HotelFAQ';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';

interface Hotel {
  hotel_id: number;
  property_name: string;
  location: {
    province_city: string;
    soum: string;
    district: string;
  };
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
  description?: string;
}

interface HotelPageContentProps {
  hotel: Hotel;
  searchParams?: { 
    check_in?: string; 
    check_out?: string; 
    guests?: string; 
  };
}

export default function HotelPageContent({ hotel, searchParams }: HotelPageContentProps) {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="bg-gray-50">
      {/* Hero section with ID for sticky nav detection */}
      <div id="hotel-hero" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div id="overview">
                <HotelDetail hotel={hotel} />
              </div>
            </div>
            
            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingCard hotel={{
                  id: hotel.hotel_id.toString(),
                  name: hotel.property_name,
                  price: 200000
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <HotelSubNav 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        hotelName={hotel.property_name}
        price={200000}
      />

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Rooms Section */}
            <div id="rooms">
              <ImprovedHotelRoomsSection 
                hotelId={hotel.hotel_id}
                checkIn={searchParams?.check_in}
                checkOut={searchParams?.check_out}
              />
            </div>

            {/* House Rules Section */}
            <div id="house-rules">
              <HotelHouseRules hotelName={hotel.property_name} />
            </div>

            {/* Reviews Section */}
            <div id="reviews">
              <Suspense fallback={<div>Loading reviews...</div>}>
                <HotelReviews rating={4.2} reviewCount={89} />
              </Suspense>
            </div>

            {/* Facilities Section */}
            <div id="facilities">
              <HotelAmenities facilities={hotel.general_facilities} />
            </div>

            {/* FAQ Section */}
            <div id="faq">
              <HotelFAQ hotelName={hotel.property_name} />
            </div>
          </div>
          
          {/* Sticky booking card space */}
          <div className="lg:col-span-1"></div>
        </div>

        {/* Similar Hotels */}
        <div className="mt-16">
          <SimilarHotels currentHotelId={hotel.hotel_id.toString()} />
        </div>
      </div>
    </div>
  );
}