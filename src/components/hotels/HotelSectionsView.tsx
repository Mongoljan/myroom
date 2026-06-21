'use client';

import ImprovedHotelRoomsSection from '@/components/hotels/ImprovedHotelRoomsSection';
import HotelHouseRules from '@/components/hotels/HotelHouseRules';
import HotelFAQSection from '@/components/hotels/HotelFAQSection';
import HotelReviews from '@/components/hotels/HotelReviews';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import {
  SearchHotelResult,
  PropertyDetails,
  PropertyBasicInfo,
  PropertyPolicy,
  HotelFacility,
  PropertyFaq,
} from '@/types/api';
import type { HotelReviewsResponse } from '@/types/customer';

interface HotelSectionsViewProps {
  hotel: SearchHotelResult;
  searchParams?: {
    check_in?: string;
    check_out?: string;
    guests?: string;
  };
  propertyDetails?: PropertyDetails | null;
  basicInfo?: PropertyBasicInfo | null;
  policies?: PropertyPolicy[];
  reviewsData?: HotelReviewsResponse | null;
  faqs?: PropertyFaq[];
}

export default function HotelSectionsView({
  hotel,
  searchParams,
  propertyDetails,
  basicInfo,
  policies,
  reviewsData,
  faqs = [],
}: HotelSectionsViewProps) {
  const { t } = useHydratedTranslation();

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

  const accessibilityFeatures: HotelFacility[] =
    hotel.accessibility_features?.length
      ? hotel.accessibility_features
      : ((propertyDetails?.accessibility_feature ?? []) as HotelFacility[]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-10">
        <div id="rooms">
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
            {t('hotelDetails.selectRoom', 'Өрөө сонгох')}
          </h2>
          <ImprovedHotelRoomsSection
            hotelId={hotel.hotel_id}
            hotelName={hotel.property_name}
            locationName={hotel.location?.province_city ?? undefined}
            checkIn={searchParams?.check_in}
            checkOut={searchParams?.check_out}
            initialPolicies={policies}
          />
        </div>

        <div id="house-rules">
          <HotelHouseRules
            hotelId={hotel.hotel_id}
            hotelName={hotel.property_name}
            initialPolicies={policies}
            basicInfo={basicInfo}
          />
        </div>

        <div id="reviews">
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
            {t('hotel.reviews', 'Шүүмж, үнэлгээ')}
          </h2>
          <HotelReviews reviewsData={reviewsData ?? null} />
        </div>

        <div id="facilities">
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
            {t('hotelDetails.facilities', 'Үйлчилгээ')}
          </h2>
          <HotelAmenities
            generalFacilities={generalFacilities}
            additionalFacilities={additionalFacilities}
            activities={activities}
            accessibilityFeatures={accessibilityFeatures}
          />
        </div>
      </div>

      <div id="faq" className="mt-10">
        <HotelFAQSection faqs={faqs} />
      </div>

      <div className="mt-10">
        <SimilarHotels
          currentHotelId={hotel.hotel_id.toString()}
          checkIn={searchParams?.check_in}
          checkOut={searchParams?.check_out}
        />
      </div>
    </div>
  );
}
