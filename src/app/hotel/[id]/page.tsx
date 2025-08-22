import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import HotelDetail from '@/components/hotels/HotelDetail';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import HotelReviews from '@/components/hotels/HotelReviews';
import BookingCard from '@/components/hotels/BookingCard';
import SimilarHotels from '@/components/hotels/SimilarHotels';
import { ApiService } from '@/services/api';

const getHotelById = async (id: string) => {
  try {
    const hotelId = parseInt(id);
    const hotel = await ApiService.getHotelDetails(hotelId);
    return hotel;
  } catch (error) {
    console.error('Failed to fetch hotel details:', error);
    return null;
  }
};

export default async function HotelPage({ params }: { params: { id: string } }) {
  const hotel = await getHotelById(params.id);
  
  if (!hotel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <HotelDetail hotel={hotel} />
            <HotelAmenities facilities={hotel.general_facilities} />
            <Suspense fallback={<div>Loading reviews...</div>}>
              <HotelReviews hotelId={hotel.hotel_id} />
            </Suspense>
          </div>
          
          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingCard hotel={hotel} />
            </div>
          </div>
        </div>
        
        {/* Similar Hotels */}
        <div className="mt-16">
          <SimilarHotels currentHotelId={hotel.hotel_id} />
        </div>
      </div>
    </div>
  );
}