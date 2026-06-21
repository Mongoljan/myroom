'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMotionValue, useMotionTemplate, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/components/common/BackButton';

import EnhancedHotelDetail from '@/components/hotels/EnhancedHotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';
import HotelFAQSection from '@/components/hotels/HotelFAQSection';
import HotelReviews from '@/components/hotels/HotelReviews';
import SearchHeader from '@/components/search/SearchHeader';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

import { ApiService } from '@/services/api';
import { SearchHotelResult, PropertyDetails, PropertyBasicInfo, AdditionalInfo, HotelFacility, PropertyImage, CancellationFee, PropertyPolicy, getRoomSellingPrice } from '@/types/api';
import type { HotelReviewsResponse } from '@/types/customer';

const STRUCTURED_LOCATION_PARAMS = ['province_id', 'soum_id', 'name_id', 'district', 'location'] as const;

function hasStructuredLocationParam(params: URLSearchParams): boolean {
  return STRUCTURED_LOCATION_PARAMS.some((key) => params.get(key));
}

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
  reviewsData?: HotelReviewsResponse | null;
}

export default function HotelPageContent({ hotel, searchParams, propertyDetails, basicInfo, additionalInfo, propertyImages, cancellationFee, policies, reviewsData }: HotelPageContentProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const { addRecentlyViewed } = useRecentlyViewed();
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const bannerMouseX = useMotionValue(0);
  const bannerMouseY = useMotionValue(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const bannerMask = useMotionTemplate`radial-gradient(420px circle at ${bannerMouseX}px ${bannerMouseY}px, white, transparent 80%)`;

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const handleBackToSearch = useCallback(async () => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.delete('from');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (!params.get('check_in')) params.set('check_in', today);
    if (!params.get('check_out')) params.set('check_out', tomorrow);
    if (!params.get('adults')) params.set('adults', '2');
    if (!params.get('children')) params.set('children', '0');
    if (!params.get('rooms')) params.set('rooms', '1');
    if (!params.get('acc_type')) params.set('acc_type', 'hotel');

    // Search API prefers `name` over `province_id` — drop free-text name when IDs exist
    if (hasStructuredLocationParam(params)) {
      params.delete('name');
    } else if (params.get('name')) {
      try {
        const combined = await ApiService.getCombinedData();
        const province = combined.province?.find((p) => p.name === params.get('name'));
        if (province) {
          params.delete('name');
          params.set('province_id', String(province.id));
        }
      } catch {
        // keep name as fallback
      }
    }

    router.push(`/search?${params.toString()}`);
  }, [router, urlSearchParams]);
  

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
      {/* Search banner: primary bg, dots revealed only under cursor */}
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          bannerMouseX.set(e.clientX - rect.left);
          bannerMouseY.set(e.clientY - rect.top);
        }}
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        className="relative w-full overflow-hidden py-6 group/banner"
        style={{ backgroundColor: 'var(--color-navy)' }}
      >
        {/* Grain texture — always on, gives the tactile feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            mixBlendMode: 'overlay',
            opacity: 0.55,
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)' }} />
        {/* Aceternity dot reveal — only shown through cursor mask */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/banner:opacity-100"
          style={{ maskImage: bannerMask }}
        >
          {isBannerHovered && (
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={[[99, 102, 241], [139, 92, 246]]}
              dotSize={3}
              showGradient={false}
            />
          )}
        </motion.div>
        <SearchHeader disableSticky noBackground />
      </div>

      {/* Hero section with ID for sticky nav detection */}
      <div id="hotel-hero" className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-5">
          <BackButton
            onClick={handleBackToSearch}
            className="mb-4"
          />
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
        price={hotel.cheapest_room ? getRoomSellingPrice(hotel.cheapest_room) : (hotel.min_estimated_total || 0)}
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
              locationName={hotel.location?.province_city ?? undefined}
              checkIn={searchParams?.check_in}
              checkOut={searchParams?.check_out}
              initialPolicies={policies}
            />
          </div>

          {/* House Rules Section */}
          <div id="house-rules">
            <HotelHouseRules hotelId={hotel.hotel_id} hotelName={hotel.property_name} initialPolicies={policies} basicInfo={basicInfo} />
          </div>

          {/* Guest Reviews Section */}
          <div id="reviews">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">{t('hotel.reviews', 'Шүүмж, үнэлгээ')}</h2>
            <HotelReviews reviewsData={reviewsData ?? null} />
          </div>

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

          {/* FAQ Section */}
          <div id="faq">
            <HotelFAQSection hotelId={hotel.hotel_id} />
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