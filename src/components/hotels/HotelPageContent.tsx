'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMotionValue, useMotionTemplate, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import EnhancedHotelDetail from '@/components/hotels/EnhancedHotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';
import SearchHeader from '@/components/search/SearchHeader';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

import { SearchHotelResult, PropertyDetails, PropertyBasicInfo, AdditionalInfo, HotelFacility, PropertyImage, CancellationFee, PropertyPolicy, getRoomSellingPrice } from '@/types/api';

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
  const router = useRouter();
  const bannerMouseX = useMotionValue(0);
  const bannerMouseY = useMotionValue(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const bannerMask = useMotionTemplate`radial-gradient(420px circle at ${bannerMouseX}px ${bannerMouseY}px, white, transparent 80%)`;

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
        style={{ backgroundColor: '#1e1b4b' }}
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
          <button
            onClick={() => router.push('/search')}
            className="flex items-center gap-1.5 text-sm font-bold text-primary dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-primary font-bold" />
            Буцах
          </button>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              {/* Score + Category bars */}
              <div className="flex gap-8">
                {/* Left: overall score */}
                <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 min-w-[160px]">
                  <span className="text-[52px] font-extrabold text-indigo-700 dark:text-indigo-300 leading-none">—</span>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">{t('hotel.noRatingsYet', 'Үнэлгээ байхгүй')}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">0 {t('hotel.reviews_count', 'үнэлгээ')}</span>
                </div>

                {/* Right: category bars */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 content-center">
                  {[
                    { label: 'Байршил', key: 'location' },
                    { label: 'Ажилтан', key: 'staff' },
                    { label: 'Цэвэрлэгээ', key: 'cleanliness' },
                    { label: 'Үнэ / чанарын харьцаа', key: 'value' },
                    { label: 'Тав тух', key: 'comfort' },
                    { label: 'Тоног төхөөрөмж', key: 'facilities' },
                    { label: 'Үнэгүй Wi-Fi', key: 'wifi' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{label}</span>
                        <span className="text-gray-400 dark:text-gray-500 font-medium">—</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-1.5 w-0 bg-indigo-600 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-5" />

              {/* Comments */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  {t('hotel.comments', 'Сэтгэгдэл')}
                </h3>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{t('hotel.noComments', 'Одоогоор сэтгэгдэл байхгүй байна')}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('hotel.noCommentsDesc', 'Энэ буудалд анхны сэтгэгдлийг үлдээгээрэй')}</p>
                </div>
              </div>
            </div>
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