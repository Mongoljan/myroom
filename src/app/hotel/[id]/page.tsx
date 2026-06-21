import { Suspense } from 'react';
import { Metadata } from 'next';
import HotelPageBanner from '@/components/hotels/HotelPageBanner';
import HotelHeroAsync from '@/components/hotels/HotelHeroAsync';
import HotelSectionsAsync from '@/components/hotels/HotelSectionsAsync';
import { HotelHeroSkeleton, HotelSectionsSkeleton } from '@/components/skeletons';
import { getCachedHotel } from '@/lib/hotelPageData';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const hotel = await getCachedHotel(id);

  if (!hotel) {
    return {
      title: 'Зочид буудал олдсонгүй | MyRoom',
      description: 'Хайж буй зочид буудал олдсонгүй.',
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

export default async function HotelPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ check_in?: string; check_out?: string; guests?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <HotelPageBanner />

      <Suspense fallback={<HotelHeroSkeleton />}>
        <HotelHeroAsync id={id} searchParams={resolvedSearchParams} />
      </Suspense>

      <Suspense fallback={<HotelSectionsSkeleton />}>
        <HotelSectionsAsync id={id} searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}
