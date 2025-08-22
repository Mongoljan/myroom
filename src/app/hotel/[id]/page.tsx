import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import HotelDetail from '@/components/hotels/HotelDetail';
import HotelGallery from '@/components/hotels/HotelGallery';
import HotelAmenities from '@/components/hotels/HotelAmenities';
import HotelReviews from '@/components/hotels/HotelReviews';
import BookingCard from '@/components/hotels/BookingCard';
import SimilarHotels from '@/components/hotels/SimilarHotels';

// Mock hotel data - replace with actual API call
const getHotelById = async (id: string) => {
  // This would be replaced with actual API call
  const hotels = [
    {
      id: '1',
      name: 'Grand Luxury Hotel',
      location: 'New York, NY',
      rating: 4.8,
      reviewCount: 1247,
      price: 299,
      originalPrice: 399,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      ],
      description: 'Experience luxury at its finest in the heart of Manhattan. Our hotel offers world-class amenities and exceptional service.',
      amenities: [
        'Free WiFi',
        'Swimming Pool',
        'Fitness Center',
        'Spa',
        'Restaurant',
        'Room Service',
        'Concierge',
        'Parking',
      ],
      rooms: [
        {
          type: 'Standard Room',
          price: 299,
          features: ['King Bed', 'City View', '32" TV', 'Mini Bar'],
        },
        {
          type: 'Deluxe Suite',
          price: 499,
          features: ['King Bed', 'Ocean View', '55" TV', 'Balcony', 'Living Area'],
        },
      ],
    },
  ];
  
  return hotels.find(hotel => hotel.id === id);
};

export default async function HotelPage({ params }: { params: { id: string } }) {
  const hotel = await getHotelById(params.id);
  
  if (!hotel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <HotelGallery images={hotel.images} hotelName={hotel.name} />
            <HotelDetail hotel={hotel} />
            <HotelAmenities amenities={hotel.amenities} />
            <Suspense fallback={<div>Loading reviews...</div>}>
              <HotelReviews rating={hotel.rating} reviewCount={hotel.reviewCount} />
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
          <SimilarHotels currentHotelId={hotel.id} />
        </div>
      </div>
    </div>
  );
}