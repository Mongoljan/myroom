import { notFound } from 'next/navigation';
import HotelPageContent from '@/components/hotels/HotelPageContent';
import { ApiService } from '@/services/api';

interface Hotel {
  hotel_id: number;
  property_name: string;
  location: {
    province_city: string;
    soum: string;
    district: string;
  };
  images: {
    cover: {
      url: string;
      description: string;
    };
    gallery: Array<{
      img: {
        url: string;
        description: string;
      };
    }>;
  };
  rating_stars: {
    id: number;
    label: string;
    value: string;
  };
  google_map: string;
  general_facilities: string[];
  description?: string;
}

const getHotelById = async (id: string): Promise<Hotel | null> => {
  try {
    const hotelId = parseInt(id);
    const hotel = await ApiService.getHotelDetails(hotelId) as Hotel;
    return hotel;
  } catch (error) {
    console.error('Failed to fetch hotel details:', error);
    return null;
  }
};

export default async function HotelPage({ params, searchParams }: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ check_in?: string; check_out?: string; guests?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const hotel = await getHotelById(id);
  
  if (!hotel) {
    notFound();
  }

  // TypeScript assertion: hotel is definitely not null after the check above
  const hotelData = hotel as Hotel;

  return (
    <HotelPageContent hotel={hotelData} searchParams={resolvedSearchParams} />
  );
}