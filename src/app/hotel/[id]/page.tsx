import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HotelPageContent from '@/components/hotels/HotelPageContent';
import { ApiService } from '@/services/api';
import { SearchHotelResult } from '@/types/api';

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
async function getHotelById(id: string): Promise<SearchHotelResult | null> {
  try {
    const hotelId = parseInt(id);
    const hotel = await ApiService.getHotelDetails(hotelId) as SearchHotelResult;
    return hotel;
  } catch (error) {
    console.error('Failed to fetch hotel details:', error);
    return null;
  }
}

// Loading skeleton for hotel page
function HotelPageSkeleton() {
  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Image gallery skeleton */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="col-span-2 row-span-2 h-[400px] bg-gray-200 rounded-l-xl animate-pulse" />
          <div className="h-[196px] bg-gray-200 animate-pulse" />
          <div className="h-[196px] bg-gray-200 rounded-tr-xl animate-pulse" />
          <div className="h-[196px] bg-gray-200 animate-pulse" />
          <div className="h-[196px] bg-gray-200 rounded-br-xl animate-pulse" />
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
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
  const hotel = await getHotelById(id);
  
  if (!hotel) {
    notFound();
  }

  return <HotelPageContent hotel={hotel} searchParams={searchParams} />;
}