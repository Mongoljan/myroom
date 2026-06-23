import { notFound } from 'next/navigation';
import HotelHeroView from '@/components/hotels/HotelHeroView';
import { fetchHotelHeroData } from '@/lib/hotelPageData';

interface HotelHeroAsyncProps {
  id: string;
  searchParams?: {
    check_in?: string;
    check_out?: string;
    guests?: string;
  };
}

export default async function HotelHeroAsync({ id, searchParams }: HotelHeroAsyncProps) {
  const data = await fetchHotelHeroData(id, searchParams?.check_in, searchParams?.check_out);

  if (!data) {
    notFound();
  }

  return (
    <HotelHeroView
      hotel={data.hotel}
      basicInfo={data.basicInfo}
      propertyImages={data.propertyImages}
      propertyDetails={data.propertyDetails}
      additionalInfo={data.additionalInfo}
      reviewsData={data.reviewsData}
    />
  );
}
