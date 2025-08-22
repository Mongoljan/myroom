'use client'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import WishlistButton from "@/components/common/WishlistButton";

interface Hotel {
  hotel_id: number;
  property_name: string;
  location: {
    province_city: string;
    soum: string;
    district: string;
  };
  nights: number;
  rooms_possible: number;
  cheapest_room: {
    room_type_id: number;
    room_category_id: number;
    room_type_label: string;
    room_category_label: string;
    price_per_night: number;
    nights: number;
    available_in_this_type: number;
    capacity_per_room_adults: number;
    capacity_per_room_children: number;
    capacity_per_room_total: number;
    estimated_total_for_requested_rooms: number;
  };
  min_estimated_total: number;
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
}

interface HotelListProps {
  hotels: Hotel[];
  viewMode: 'list' | 'grid';
}

const HotelCard: React.FC<{ hotel: Hotel; viewMode: 'list' | 'grid' }> = ({ hotel, viewMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useHydratedTranslation();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
    }).format(price).replace('MNT', '₮');
  };

  const getStarRating = (value: string) => {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const nextImage = () => {
    if (hotel.images.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === hotel.images.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (hotel.images.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? hotel.images.gallery.length - 1 : prev - 1
      );
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-80 h-64 md:h-auto">
            <Image
              src={hotel.images.gallery[currentImageIndex]?.img.url || hotel.images.cover.url}
              alt={hotel.property_name}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';
              }}
            />
            
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <WishlistButton hotelId={hotel.hotel_id.toString()} />
            </div>
            
            {hotel.images.gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {hotel.images.gallery.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.property_name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(getStarRating(hotel.rating_stars.value))].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{hotel.rating_stars.label}</span>
                </div>
                <p className="text-gray-600 mb-3">
                  {hotel.location.province_city}, {hotel.location.soum}, {hotel.location.district}
                </p>
                
                {/* Facilities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.general_facilities.slice(0, 4).map((facility, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {facility}
                    </span>
                  ))}
                  {hotel.general_facilities.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{hotel.general_facilities.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {hotel.cheapest_room ? formatPrice(hotel.cheapest_room.price_per_night) : t('hotel.priceUnavailable', 'Price Unavailable')}
                </div>
                <div className="text-sm text-gray-600">{t('hotel.perNight', 'per night')}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Total: {formatPrice(hotel.min_estimated_total)}
                </div>
                <Link
                  href={`/hotel/${hotel.hotel_id}`}
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('hotel.viewDeal', 'View Deal')}
                </Link>
              </div>
            </div>

            {hotel.cheapest_room && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{hotel.cheapest_room.room_type_label}</span> • 
                <span className="ml-1">{hotel.cheapest_room.room_category_label}</span> • 
                <span className="ml-1">Sleeps {hotel.cheapest_room.capacity_per_room_total}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={hotel.images.gallery[currentImageIndex]?.img.url || hotel.images.cover.url}
          alt={hotel.property_name}
          fill
          className="object-cover"
          unoptimized
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop';
          }}
        />
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3">
          <WishlistButton hotelId={hotel.hotel_id.toString()} />
        </div>
        
        {hotel.images.gallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {hotel.images.gallery.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          {[...Array(getStarRating(hotel.rating_stars.value))].map((_, i) => (
            <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-xs text-gray-600">{hotel.rating_stars.label}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{hotel.property_name}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {hotel.location.province_city}, {hotel.location.soum}
        </p>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {hotel.cheapest_room ? formatPrice(hotel.cheapest_room.price_per_night) : t('hotel.priceUnavailable', 'Price Unavailable')}
            </div>
            <div className="text-xs text-gray-600">{t('hotel.perNight', 'per night')}</div>
          </div>
          <Link
            href={`/hotel/${hotel.hotel_id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {t('hotel.viewDeal', 'View Deal')}
          </Link>
        </div>
      </div>
    </div>
  );
};

const HotelList: React.FC<HotelListProps> = ({ hotels, viewMode }) => {
  // Ensure hotels is always an array
  const safeHotels = Array.isArray(hotels) ? hotels : [];
  
  if (safeHotels.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
        : 'space-y-6'
    }>
      {safeHotels.map((hotel) => (
        <HotelCard key={hotel.hotel_id} hotel={hotel} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default HotelList;