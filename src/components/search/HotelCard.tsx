'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Wifi, Car, Utensils } from 'lucide-react';
import { SearchHotelResult } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
}

const facilityIcons: { [key: string]: React.ReactNode } = {
  'Free Wi-Fi': <Wifi className="w-4 h-4" />,
  'Free WiFi': <Wifi className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Restaurant': <Utensils className="w-4 h-4" />,
};

export default function HotelCard({ hotel, searchParams }: HotelCardProps) {
  const { t } = useHydratedTranslation();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating(hotel.rating_stars.value);

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) {
      url += `?${searchParams.toString()}`;
    }
    return url;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Hotel Image */}
      <div className="relative h-64">
        <Image
          src={hotel.images.cover.url}
          alt={hotel.images.cover.description}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium">{hotel.rating_stars.value}</span>
          </div>
        </div>

        {/* Price Badge */}
        {hotel.cheapest_room && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-xl px-3 py-2 shadow-lg">
            <div className="text-right">
              <div className="text-lg font-bold">₮{formatPrice(hotel.cheapest_room.price_per_night)}</div>
              <div className="text-xs opacity-90">{t('hotel.night', 'шөнө')}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {hotel.property_name}
          </h3>
        </div>

        {/* Location */}
        {hotel.location.province_city && (
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {hotel.location.district && `${hotel.location.district} дүүрэг, `}
              {hotel.location.soum && `${hotel.location.soum}, `}
              {hotel.location.province_city}
            </span>
          </div>
        )}

        {/* Room Info */}
        {hotel.cheapest_room && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800 font-medium mb-1">
              {hotel.cheapest_room.room_category_label}
            </div>
            <div className="text-xs text-blue-600">
              {hotel.cheapest_room.room_type_label} • {hotel.cheapest_room.available_in_this_type} өрөө үлдсэн
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {hotel.nights} шөнө • {hotel.cheapest_room.capacity_per_room_adults} том хүн
            </div>
          </div>
        )}

        {/* Facilities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {hotel.general_facilities.slice(0, 4).map((facility, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1"
              >
                {facilityIcons[facility] || <div className="w-4 h-4" />}
                <span>{facility}</span>
              </div>
            ))}
            {hotel.general_facilities.length > 4 && (
              <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                +{hotel.general_facilities.length - 4} бусад
              </div>
            )}
          </div>
        </div>

        {/* Total Price */}
        {hotel.min_estimated_total > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {hotel.nights} шөнийн нийт үнэ:
              </div>
              <div className="text-xl font-bold text-green-600">
                ₮{formatPrice(hotel.min_estimated_total)}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <Link
            href={buildHotelUrl()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold text-center block transition-all duration-200 shadow-lg hover:shadow-xl"
          >
{t('hotel.viewDetails', 'Дэлгэрэнгүй үзэх')}
          </Link>
        </div>
      </div>
    </div>
  );
}