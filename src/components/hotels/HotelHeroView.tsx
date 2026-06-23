'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/components/common/BackButton';
import EnhancedHotelDetail from '@/components/hotels/EnhancedHotelDetail';
import HotelSubNav from '@/components/hotels/HotelSubNav';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ApiService } from '@/services/api';
import {
  SearchHotelResult,
  PropertyDetails,
  PropertyBasicInfo,
  AdditionalInfo,
  PropertyImage,
  getRoomSellingPrice,
} from '@/types/api';
import type { HotelReviewsResponse } from '@/types/customer';

const STRUCTURED_LOCATION_PARAMS = ['province_id', 'soum_id', 'name_id', 'district', 'location'] as const;

function hasStructuredLocationParam(params: URLSearchParams): boolean {
  return STRUCTURED_LOCATION_PARAMS.some((key) => params.get(key));
}

interface HotelHeroViewProps {
  hotel: SearchHotelResult;
  basicInfo?: PropertyBasicInfo | null;
  propertyImages?: PropertyImage[];
  propertyDetails?: PropertyDetails | null;
  additionalInfo?: AdditionalInfo | null;
  reviewsData?: HotelReviewsResponse | null;
}

export default function HotelHeroView({
  hotel,
  basicInfo,
  propertyImages,
  propertyDetails,
  additionalInfo,
  reviewsData,
}: HotelHeroViewProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const { addRecentlyViewed } = useRecentlyViewed();
  const router = useRouter();
  const urlSearchParams = useSearchParams();

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

  useEffect(() => {
    if (hotel) {
      addRecentlyViewed(hotel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel]);

  return (
    <>
      <div id="hotel-hero" className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-5">
          <BackButton onClick={handleBackToSearch} className="mb-4" />
          <div id="overview">
            <EnhancedHotelDetail
              hotel={hotel}
              propertyDetails={propertyDetails ?? null}
              basicInfo={basicInfo ?? null}
              additionalInfo={additionalInfo ?? null}
              propertyImages={propertyImages ?? []}
              reviewsData={reviewsData ?? null}
            />
          </div>
        </div>
      </div>

      <HotelSubNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        hotelName={hotel.property_name}
        price={hotel.cheapest_room ? getRoomSellingPrice(hotel.cheapest_room) : (hotel.min_estimated_total || 0)}
      />
    </>
  );
}
