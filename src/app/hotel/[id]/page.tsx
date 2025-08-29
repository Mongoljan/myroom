import { notFound } from 'next/navigation';
import HotelPageContent from '@/components/hotels/HotelPageContent';
import { ApiService } from '@/services/api';
import { SearchHotelResult } from '@/types/api';

const getHotelById = async (id: string): Promise<SearchHotelResult | null> => {
  try {
    const hotelId = parseInt(id);
    const hotel = await ApiService.getHotelDetails(hotelId) as SearchHotelResult;
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

  return (
    <HotelPageContent hotel={hotel} searchParams={resolvedSearchParams} />
  );
}