import { cache } from 'react';
import { ApiService } from '@/services/api';
import { CustomerService } from '@/services/customerApi';
import {
  SearchHotelResult,
  PropertyDetails,
  PropertyBasicInfo,
  AdditionalInfo,
  PropertyImage,
  PropertyPolicy,
  CancellationFee,
  PropertyFaq,
} from '@/types/api';
import type { HotelReviewsResponse } from '@/types/customer';

export const getCachedHotel = cache(async (
  id: string,
  checkIn?: string,
  checkOut?: string
): Promise<SearchHotelResult | null> => {
  try {
    const hotelId = parseInt(id, 10);
    return (await ApiService.getHotelDetails(hotelId, checkIn, checkOut)) as SearchHotelResult;
  } catch {
    return null;
  }
});

export async function fetchHotelHeroData(
  id: string,
  checkIn?: string,
  checkOut?: string
) {
  const hotel = await getCachedHotel(id, checkIn, checkOut);
  if (!hotel) return null;

  const hotelId = hotel.hotel_id;
  const [basicInfoResult, propertyImagesResult, propertyDetailsResult, reviewsResult] = await Promise.allSettled([
    ApiService.getPropertyBasicInfo(hotelId),
    ApiService.getPropertyImages(hotelId),
    ApiService.getPropertyDetails(hotelId),
    CustomerService.getHotelReviews(hotelId),
  ]);

  const basicInfo: PropertyBasicInfo | null =
    basicInfoResult.status === 'fulfilled' && basicInfoResult.value.length > 0
      ? basicInfoResult.value[0]
      : null;

  const propertyImages: PropertyImage[] =
    propertyImagesResult.status === 'fulfilled' ? propertyImagesResult.value : [];

  const propertyDetails: PropertyDetails | null =
    propertyDetailsResult.status === 'fulfilled' && propertyDetailsResult.value.length > 0
      ? propertyDetailsResult.value[0]
      : null;

  const reviewsData: HotelReviewsResponse | null =
    reviewsResult.status === 'fulfilled' ? reviewsResult.value : null;

  let additionalInfo: AdditionalInfo | null = null;
  if (propertyDetails?.Additional_Information) {
    try {
      additionalInfo = await ApiService.getAdditionalInfo(propertyDetails.Additional_Information);
    } catch {
      // non-fatal
    }
  }

  return {
    hotel,
    basicInfo,
    propertyImages,
    propertyDetails,
    additionalInfo,
    reviewsData,
  };
}

export async function fetchHotelSectionsData(id: string, checkIn?: string, checkOut?: string) {
  const hotel = await getCachedHotel(id, checkIn, checkOut);
  if (!hotel) return null;

  const hotelId = hotel.hotel_id;
  const [propertyDetailsResult, policiesResult, reviewsResult, basicInfoResult, faqsResult] = await Promise.allSettled([
    ApiService.getPropertyDetails(hotelId),
    ApiService.getPropertyPolicies(hotelId),
    CustomerService.getHotelReviews(hotelId),
    ApiService.getPropertyBasicInfo(hotelId),
    ApiService.getPropertyFaqs(hotelId),
  ]);

  const propertyDetails: PropertyDetails | null =
    propertyDetailsResult.status === 'fulfilled' && propertyDetailsResult.value.length > 0
      ? propertyDetailsResult.value[0]
      : null;

  const policies: PropertyPolicy[] =
    policiesResult.status === 'fulfilled' ? policiesResult.value : [];

  const reviewsData: HotelReviewsResponse | null =
    reviewsResult.status === 'fulfilled' ? reviewsResult.value : null;

  const basicInfo: PropertyBasicInfo | null =
    basicInfoResult.status === 'fulfilled' && basicInfoResult.value.length > 0
      ? basicInfoResult.value[0]
      : null;

  const faqs: PropertyFaq[] =
    faqsResult.status === 'fulfilled' && Array.isArray(faqsResult.value?.faqs)
      ? faqsResult.value.faqs
      : [];

  const cancellationFee: CancellationFee | null =
    policies.length > 0 && policies[0].cancellation_fee
      ? policies[0].cancellation_fee
      : null;

  return {
    hotel,
    propertyDetails,
    basicInfo,
    policies,
    reviewsData,
    cancellationFee,
    faqs,
  };
}
