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
        <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image */}
            <div className="relative md:w-80 h-56 md:h-56 flex-shrink-0 overflow-hidden">
              <Image
                src={typeof hotel.images?.cover === 'string' ? hotel.images.cover : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 320px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-3 py-1.5 shadow-lg">
                <span className="text-sm font-bold">{stars}.0</span>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors">
                    {hotel.property_name}
                  </h3>
                  
                  {hotel.location.province_city && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{hotel.location.province_city}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
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
                  {hotel.general_facilities.slice(0, 3).map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 text-sm text-green-700 bg-green-100 rounded-lg px-3 py-1.5 font-medium"
                    >
                      {facilityIcons[facility] || <div className="w-2 h-2 bg-green-500 rounded-full" />}
                      <span>{facility}</span>
                    </div>
                  ))}
                  {hotel.general_facilities.length > 3 && (
                    <div className="text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 font-medium">
                      +{hotel.general_facilities.length - 3} бусад
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  {hotel.cheapest_room && (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-600 font-medium">эхлэх үнэ</span>
                        <span className="text-3xl font-bold text-gray-900">
                          ₮{formatPrice(hotel.cheapest_room.price_per_night)}
                        </span>
                        <span className="text-base text-gray-700 font-medium">-с /{t('hotel.night', 'шөнө')}</span>
                      </div>
                      {hotel.min_estimated_total > 0 && (
                        <div className="text-base text-green-600 font-bold bg-green-50 rounded-lg px-3 py-1 inline-block">
                          Нийт: ₮{formatPrice(hotel.min_estimated_total)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  {t('hotel.viewDetails', 'Үзэх')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link href={buildHotelUrl()} className="block">
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
        {/* Hotel Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={typeof hotel.images?.cover === 'string' ? hotel.images.cover : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
            alt={hotel.property_name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-3 py-1.5 shadow-lg">
            <span className="text-sm font-bold">{stars}.0</span>
          </div>
          
          {hotel.cheapest_room && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg px-3 py-1.5 text-sm font-bold shadow-lg">
              ₮{formatPrice(hotel.cheapest_room.price_per_night)}
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                {hotel.property_name}
              </h3>
              
              {hotel.location.province_city && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hotel.location.province_city}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
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
              {hotel.general_facilities.slice(0, 2).map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 rounded-lg px-2.5 py-1 font-medium"
                >
                  {facilityIcons[facility] || <div className="w-2 h-2 bg-green-500 rounded-full" />}
                  <span>{facility}</span>
                </div>
              ))}
              {hotel.general_facilities.length > 2 && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-2.5 py-1 font-medium">
                  +{hotel.general_facilities.length - 2}
                </div>
              )}
            </div>

            {hotel.cheapest_room && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-600 font-medium">эхлэх үнэ</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₮{formatPrice(hotel.cheapest_room.price_per_night)}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">-с</span>
                </div>
                {hotel.min_estimated_total > 0 && (
                  <div className="text-sm text-green-600 font-bold bg-green-50 rounded-lg px-2 py-1 mt-2 inline-block">
                    Нийт: ₮{formatPrice(hotel.min_estimated_total)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}