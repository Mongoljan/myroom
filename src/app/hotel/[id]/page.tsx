import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import HotelDetail from '@/components/hotels/HotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import HotelReviews from '@/components/hotels/HotelReviews';
import BookingCard from '@/components/hotels/BookingCard';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import HotelRoomsSection from '@/components/hotels/HotelRoomsSection';
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
  params: { id: string };
  searchParams?: { check_in?: string; check_out?: string; guests?: string };
}) {
  const hotel = await getHotelById(params.id);
  
  if (!hotel) {
    notFound();
  }

  // TypeScript assertion: hotel is definitely not null after the check above
  const hotelData = hotel as Hotel;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <HotelDetail hotel={hotelData} />
            <HotelAmenities facilities={hotelData.general_facilities} />
            <Suspense fallback={<div>Loading reviews...</div>}>
              <HotelReviews rating={4.2} reviewCount={89} />
            </Suspense>
          </div>
          
          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingCard hotel={{
                id: hotelData.hotel_id.toString(),
                name: hotelData.property_name,
                price: 200000
              }} />
            </div>
          </div>
        </div>

        {/* Rooms Section - Always Visible */}
        <div className="mt-16">
          <HotelRoomsSection 
            hotelId={hotelData.hotel_id}
            checkIn={searchParams?.check_in}
            checkOut={searchParams?.check_out}
          />
        </div>
        
        {/* Similar Hotels */}
        <div className="mt-16">
          <SimilarHotels currentHotelId={hotelData.hotel_id.toString()} />
        </div>
      </div>
    </div>
  );
}