'use client';

import { useState, useEffect, useCallback } from 'react';

import EnhancedHotelDetail from '@/components/hotels/EnhancedHotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';
import HotelCancellationPolicy from '@/components/hotels/HotelCancellationPolicy';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

import { SearchHotelResult, PropertyDetails, PropertyBasicInfo, AdditionalInfo, HotelFacility, PropertyImage, CancellationFee, PropertyPolicy } from '@/types/api';

interface HotelPageContentProps {
  hotel: SearchHotelResult;
  searchParams?: { 
    check_in?: string; 
    check_out?: string; 
    guests?: string; 
  };
  propertyDetails?: PropertyDetails | null;
  basicInfo?: PropertyBasicInfo | null;
  additionalInfo?: AdditionalInfo | null;
  propertyImages?: PropertyImage[];
  cancellationFee?: CancellationFee | null;
  policies?: PropertyPolicy[];
}

export default function HotelPageContent({ hotel, searchParams, propertyDetails, basicInfo, additionalInfo, propertyImages, cancellationFee, policies }: HotelPageContentProps) {
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

  // Prefer facilities from property_details (complete data) over search API result
  const generalFacilities: HotelFacility[] =
    (propertyDetails?.general_facilities?.length
      ? propertyDetails.general_facilities
      : hotel.general_facilities) ?? [];

  const additionalFacilities: HotelFacility[] =
    (propertyDetails?.additional_facilities?.length
      ? propertyDetails.additional_facilities
      : hotel.additional_facilities) ?? [];

  const activities: HotelFacility[] =
    (propertyDetails?.activities?.length
      ? propertyDetails.activities
      : hotel.activities) ?? [];

  // Prefer search-API accessibility_features (complete with names) over property-details
  // join-table records which lack name fields.
  const accessibilityFeatures: HotelFacility[] =
    hotel.accessibility_features?.length
      ? hotel.accessibility_features
      : ((propertyDetails?.accessibility_feature ?? []) as HotelFacility[]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero section with ID for sticky nav detection */}
      <div id="hotel-hero" className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div id="overview">
            <EnhancedHotelDetail
              hotel={hotel}
              propertyDetails={propertyDetails ?? null}
              basicInfo={basicInfo ?? null}
              additionalInfo={additionalInfo ?? null}
              propertyImages={propertyImages ?? []}
            />
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <HotelSubNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        hotelName={hotel.property_name}
        price={hotel.cheapest_room?.price_per_night_final || hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0}
      />

      {/* Content Sections - More Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-10">
          {/* Rooms Section */}
          <div id="rooms" className="">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">{t('hotelDetails.selectRoom', 'Өрөө сонгох')}</h2>
            <ImprovedHotelRoomsSection
              hotelId={hotel.hotel_id}
              hotelName={hotel.property_name}
              checkIn={searchParams?.check_in}
              checkOut={searchParams?.check_out}
              initialPolicies={policies}
            />
          </div>

          {/* House Rules Section */}
          <div id="house-rules">
            <HotelHouseRules hotelId={hotel.hotel_id} hotelName={hotel.property_name} initialPolicies={policies} />
          </div>

          {/* Cancellation Policy Section */}
          {cancellationFee && (
            <div id="cancellation-policy">
              <HotelCancellationPolicy cancellationFee={cancellationFee} />
            </div>
          )}

          {/* Facilities Section */}
          <div id="facilities" className="">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">{t('hotelDetails.facilities', 'Үйлчилгээ')}</h2>
            <HotelAmenities
              generalFacilities={generalFacilities}
              additionalFacilities={additionalFacilities}
              activities={activities}
              accessibilityFeatures={accessibilityFeatures}
            />
          </div>
        </div>


        {/* Similar Hotels */}
        <div className="mt-8">
          {/* <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">{t('hotelDetails.similarHotels', 'Төстәй зочид буудлууд')}</h2> */}
          <SimilarHotels currentHotelId={hotel.hotel_id.toString()} checkIn={searchParams?.check_in} checkOut={searchParams?.check_out} />
        </div>
      </div>
    </div>
  );
}