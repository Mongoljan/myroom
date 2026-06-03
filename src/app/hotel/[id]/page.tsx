import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HotelPageContent from '@/components/hotels/HotelPageContent';
import { HotelPageSkeleton } from '@/components/skeletons';
import { ApiService } from '@/services/api';
import { SearchHotelResult, PropertyDetails, PropertyBasicInfo, AdditionalInfo, PropertyImage, CancellationFee, PropertyPolicy } from '@/types/api';

// ISR-style revalidation - cache hotel data for 60 seconds
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const hotel = await getHotelById(id);
  
  if (!hotel) {
    return { 
      title: 'Зочид буудал олдсонгүй | MyRoom',
      description: 'Хайж буй зочид буудал олдсонгүй.'
    };
  }

  const location = hotel.location?.province_city || 'Монгол';
  const hotelImage = hotel.images?.cover 
    ? (typeof hotel.images.cover === 'string' ? hotel.images.cover : hotel.images.cover.url)
    : '/img/general/og-image.jpg';
  
  return {
    title: `${hotel.property_name} | MyRoom`,
    description: `${location}-д байрлах ${hotel.property_name}-г захиалах. Хамгийн сайн үнийн баталгаа, шууд баталгаажуулалт.`,
    openGraph: {
      title: `${hotel.property_name} | MyRoom`,
      description: `${hotel.property_name} - ${location}. Одоо захиалаарай!`,
      images: [hotelImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hotel.property_name} | MyRoom`,
      description: `${hotel.property_name} - ${location}`,
      images: [hotelImage],
    },
  };
}

// Hotel fetching function
async function getHotelById(id: string, checkIn?: string, checkOut?: string): Promise<SearchHotelResult | null> {
  try {
    const hotelId = parseInt(id);
    const hotel = await ApiService.getHotelDetails(hotelId, checkIn, checkOut) as SearchHotelResult;
    return hotel;
  } catch (error) {
    return null;
  }
}

export default async function HotelPage({ params, searchParams }: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ check_in?: string; check_out?: string; guests?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  
  return (
    <Suspense fallback={<HotelPageSkeleton />}>
      <HotelContent id={id} searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

// Separate async component for the hotel content
async function HotelContent({ id, searchParams }: {
  id: string;
  searchParams?: { check_in?: string; check_out?: string; guests?: string };
}) {
  const hotel = await getHotelById(id, searchParams?.check_in, searchParams?.check_out);
  
  if (!hotel) {
    notFound();
  }

  const hotelId = hotel.hotel_id;

  // Fetch property details, basicInfo, property images, and policies in parallel
  const [propertyDetailsResult, basicInfoResult, propertyImagesResult, policiesResult] = await Promise.allSettled([
    ApiService.getPropertyDetails(hotelId),
    ApiService.getPropertyBasicInfo(hotelId),
    ApiService.getPropertyImages(hotelId),
    ApiService.getPropertyPolicies(hotelId),
  ]);

  const propertyDetails: PropertyDetails | null =
    propertyDetailsResult.status === 'fulfilled' && propertyDetailsResult.value.length > 0
      ? propertyDetailsResult.value[0]
      : null;

  const basicInfo: PropertyBasicInfo | null =
    basicInfoResult.status === 'fulfilled' && basicInfoResult.value.length > 0
      ? basicInfoResult.value[0]
      : null;

  const propertyImages: PropertyImage[] =
    propertyImagesResult.status === 'fulfilled' ? propertyImagesResult.value : [];

  const policies: PropertyPolicy[] =
    policiesResult.status === 'fulfilled' ? policiesResult.value : [];

  const cancellationFee: CancellationFee | null =
    policies.length > 0 && policies[0].cancellation_fee
      ? policies[0].cancellation_fee
      : null;

  // Fetch additional info using the ID from property details
  let additionalInfo: AdditionalInfo | null = null;
  if (propertyDetails?.Additional_Information) {
    try {
      additionalInfo = await ApiService.getAdditionalInfo(propertyDetails.Additional_Information);
    } catch {
      // non-fatal – show page without about text
    }
  }
  

  return (
    <HotelPageContent
      hotel={hotel}
      searchParams={searchParams}
      propertyDetails={propertyDetails}
      basicInfo={basicInfo}
      additionalInfo={additionalInfo}
      propertyImages={propertyImages}
      cancellationFee={cancellationFee}
      policies={policies}
    />
  );
}