'use client';

import { motion } from 'framer-motion';
import { SearchHotelResult } from '@/types/api';
import HotelImageGallery from './HotelImageGallery';
import HotelInfo from './HotelInfo';
import HotelPricingSection from './HotelPricingSection';
import HotelAmenitiesGrid from './HotelAmenitiesGrid';

interface ProfessionalHotelCardProps {
  hotel: SearchHotelResult;
  viewMode: 'list' | 'grid';
}

export default function ProfessionalHotelCard({ hotel, viewMode }: ProfessionalHotelCardProps) {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 w-full"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <HotelImageGallery
            images={hotel.images}
            hotelName={hotel.property_name}
            viewMode={viewMode}
            className="md:w-80"
          />

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Left Column: Hotel Info & Amenities */}
              <div className="flex-1 space-y-4">
                <HotelInfo
                  name={hotel.property_name}
                  location={hotel.location}
                  rating={hotel.rating_stars}
                  roomsAvailable={hotel.rooms_possible}
                  viewMode={viewMode}
                />

                <HotelAmenitiesGrid
                  amenities={hotel.general_facilities}
                  viewMode={viewMode}
                />
              </div>

              {/* Right Column: Pricing */}
              <div className="lg:w-64 flex flex-col justify-between">
                <HotelPricingSection
                  hotelId={hotel.hotel_id}
                  cheapestRoom={hotel.cheapest_room}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut"
      }}
      className="group relative bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-slate-300/60 transition-all duration-500 backdrop-blur-sm"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Image Section */}
      <HotelImageGallery
        images={hotel.images}
        hotelName={hotel.property_name}
        viewMode={viewMode}
      />

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Hotel Info */}
        <HotelInfo
          name={hotel.property_name}
          location={hotel.location}
          rating={hotel.rating_stars}
          roomsAvailable={hotel.rooms_possible}
          viewMode={viewMode}
        />

        {/* Amenities */}
        <HotelAmenitiesGrid
          amenities={hotel.general_facilities}
          viewMode={viewMode}
        />

        {/* Pricing */}
        <HotelPricingSection
          hotelId={hotel.hotel_id}
          cheapestRoom={hotel.cheapest_room}
          viewMode={viewMode}
        />
      </div>
    </motion.div>
  );
}