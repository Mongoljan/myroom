'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Wifi, Car, Utensils, Users, Calendar, CheckCircle } from 'lucide-react';
import { SearchHotelResult } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
  viewMode?: 'grid' | 'list';
  index?: number;
}

const facilityIcons: { [key: string]: React.ReactNode } = {
  'Free Wi-Fi': <Wifi className="w-4 h-4 text-green-600" />,
  'Free WiFi': <Wifi className="w-4 h-4 text-green-600" />,
  'Parking': <Car className="w-4 h-4 text-blue-600" />,
  'Restaurant': <Utensils className="w-4 h-4 text-orange-600" />,
  'Room Service': <Users className="w-4 h-4 text-purple-600" />,
  'Fitness Center': <Users className="w-4 h-4 text-red-600" />,
  'Spa & Wellness Center': <Users className="w-4 h-4 text-pink-600" />,
  'Pool': <Users className="w-4 h-4 text-cyan-600" />,
  'Conference Room': <Users className="w-4 h-4 text-indigo-600" />,
  '24-hour Front Desk': <Users className="w-4 h-4 text-gray-800" />,
};

export default function HotelCard({ hotel, searchParams, viewMode = 'grid' }: HotelCardProps) {
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

  if (viewMode === 'list') {
    return (
      <Link href={buildHotelUrl()} className="block">
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image - Cleaner look */}
            <div className="relative md:w-72 h-48 md:h-48 flex-shrink-0 overflow-hidden">
              <Image
                src={typeof hotel.images?.cover === 'string' ? hotel.images.cover : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 320px"
                unoptimized
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {hotel.cheapest_room && hotel.cheapest_room.price_per_night < 200000 && (
                  <span className="px-2 py-1 text-xs font-medium rounded-md text-white bg-green-500">
                    Хямдралтай
                  </span>
                )}
              </div>
              
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                {stars}.0
              </div>
            </div>

            {/* Hotel Details - Cleaner and more compact */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                    {hotel.property_name}
                  </h3>
                  
                  {hotel.location.province_city && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-sm">{hotel.location.province_city}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {hotel.rating_stars.label?.replace(/\d+\s*stars?/i, '').trim()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hotel.general_facilities.slice(0, 4).map((facility, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-600 bg-gray-100 rounded px-2.5 py-1"
                    >
                      {facility}
                    </div>
                  ))}
                  {hotel.general_facilities.length > 4 && (
                    <div className="text-xs text-blue-600 bg-blue-50 rounded px-2.5 py-1">
                      +{hotel.general_facilities.length - 4}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between pt-4 mt-4 border-t border-gray-100">
                <div>
                  {hotel.cheapest_room && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">эхлэх үнэ</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          ₮{formatPrice(hotel.cheapest_room.price_per_night)}
                        </span>
                        <span className="text-sm text-gray-600">-с /шөнө</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200">
                  Дэлгэрэнгүй
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View - Modernized to match home page design
  return (
    <Link href={buildHotelUrl()} className="block">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:shadow-lg group">
        {/* Hotel Image - Reduced height for compact look */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={typeof hotel.images?.cover === 'string' ? hotel.images.cover : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
            alt={hotel.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          
          {/* Category/Status Badge - Compact */}
          <div className="absolute top-3 left-3">
            {hotel.cheapest_room && hotel.cheapest_room.price_per_night < 200000 && (
              <span className="px-2 py-1 text-xs font-medium rounded-md text-white bg-green-500">
                Хямдралтай
              </span>
            )}
            {stars >= 4 && !hotel.cheapest_room || (hotel.cheapest_room && hotel.cheapest_room.price_per_night >= 200000) && (
              <span className="px-2 py-1 text-xs font-medium rounded-md text-white bg-orange-500">
                Эрэлттэй
              </span>
            )}
          </div>

          {/* Rating Badge - Top Right */}
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            {stars}.0
          </div>
        </div>

        {/* Hotel Info - Compact and Clean */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {hotel.property_name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-gray-500 mb-3">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span className="text-sm line-clamp-1">{hotel.location.province_city}</span>
          </div>

          {/* Rating Stars and Label */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                {hotel.rating_stars.label?.replace(/\d+\s*stars?/i, '').trim() || 'үнэлгээ'}
              </span>
            </div>
          </div>

          {/* Facilities - Compact Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.general_facilities.slice(0, 2).map((facility, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-0.5"
              >
                {facility}
              </div>
            ))}
            {hotel.general_facilities.length > 2 && (
              <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                +{hotel.general_facilities.length - 2}
              </div>
            )}
          </div>

          {/* Price - Clean and Prominent */}
          <div className="border-t border-gray-100 pt-3">
            {hotel.cheapest_room && (
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">эхлэх үнэ</div>
                  <div className="text-lg font-bold text-gray-900">
                    ₮{formatPrice(hotel.cheapest_room.price_per_night)}<span className="text-sm font-normal text-gray-600">-с</span>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Үзэх →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}