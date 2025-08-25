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
  '24-hour Front Desk': <Users className="w-4 h-4 text-gray-600" />,
};

export default function HotelCard({ hotel, searchParams, viewMode = 'grid', index = 0 }: HotelCardProps) {
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

  const isListView = viewMode === 'list';

  if (isListView) {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 group">
        <div className="flex flex-col md:flex-row">
          {/* Hotel Image - List View */}
          <div className="relative md:w-80 h-48 md:h-auto min-h-[200px] flex-shrink-0">
            <Image
              src={hotel.images.cover.url}
              alt={hotel.images.cover.description}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 320px"
            />
            
            {/* Image Overlay with Rating */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-semibold text-gray-900">{stars}</span>
              </div>
            </div>

            {/* Availability Badge */}
            {hotel.cheapest_room && hotel.cheapest_room.available_in_this_type > 0 && (
              <div className="absolute bottom-3 left-3 bg-green-100 text-green-800 rounded-full px-2.5 py-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {hotel.cheapest_room.available_in_this_type} өрөө үлдсэн
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hotel Details - List View */}
          <div className="flex-1 p-6 flex flex-col justify-between min-h-[200px]">
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {hotel.property_name}
                </h3>
                
                {/* Location */}
                {hotel.location.province_city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {hotel.location.district && `${hotel.location.district} дүүрэг, `}
                      {hotel.location.soum && `${hotel.location.soum}, `}
                      {hotel.location.province_city}
                    </span>
                  </div>
                )}
              </div>

              {/* Room Details */}
              {hotel.cheapest_room && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">
                        {hotel.cheapest_room.room_category_label}
                      </h4>
                      <p className="text-xs text-blue-700 mb-2">
                        {hotel.cheapest_room.room_type_label}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-blue-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{hotel.cheapest_room.capacity_per_room_adults} том хүн</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{hotel.nights} шөнө</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {hotel.general_facilities.slice(0, 6).map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 rounded-full px-2.5 py-1 border border-gray-200"
                    >
                      {facilityIcons[facility] || <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                      <span>{facility}</span>
                    </div>
                  ))}
                  {hotel.general_facilities.length > 6 && (
                    <div className="text-xs text-blue-600 bg-blue-50 rounded-full px-2.5 py-1 border border-blue-200">
                      +{hotel.general_facilities.length - 6} бусад
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-end justify-between pt-4 border-t border-gray-100">
              <div className="space-y-1">
                {hotel.cheapest_room && (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₮{formatPrice(hotel.cheapest_room.price_per_night)}
                      </span>
                      <span className="text-sm text-gray-500">/{t('hotel.night', 'шөнө')}</span>
                    </div>
                    {hotel.min_estimated_total > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Нийт: ₮{formatPrice(hotel.min_estimated_total)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Link
                href={buildHotelUrl()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm hover:shadow-md flex items-center gap-2 group"
              >
                <span>{t('hotel.viewDetails', 'Дэлгэрэнгүй үзэх')}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 group">
      {/* Hotel Image - Grid View */}
      <div className="relative h-56">
        <Image
          src={hotel.images.cover.url}
          alt={hotel.images.cover.description}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-xs font-semibold text-gray-900">{stars}</span>
          </div>
        </div>

        {/* Price Badge */}
        {hotel.cheapest_room && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-lg px-3 py-1.5 shadow-lg">
            <div className="text-right">
              <div className="text-sm font-bold leading-tight">₮{formatPrice(hotel.cheapest_room.price_per_night)}</div>
              <div className="text-xs opacity-90">{t('hotel.night', 'шөнө')}</div>
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        {hotel.cheapest_room && hotel.cheapest_room.available_in_this_type > 0 && (
          <div className="absolute bottom-3 left-3 bg-green-100 text-green-800 rounded-full px-2.5 py-1">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs font-medium">
                {hotel.cheapest_room.available_in_this_type} өрөө
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Info - Grid View */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {hotel.property_name}
            </h3>
            
            {/* Location */}
            {hotel.location.province_city && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm line-clamp-1">
                  {hotel.location.district && `${hotel.location.district} дүүрэг, `}
                  {hotel.location.soum && `${hotel.location.soum}, `}
                  {hotel.location.province_city}
                </span>
              </div>
            )}
          </div>

          {/* Room Info */}
          {hotel.cheapest_room && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900 text-sm">
                  {hotel.cheapest_room.room_category_label}
                </h4>
                <p className="text-xs text-blue-700">
                  {hotel.cheapest_room.room_type_label}
                </p>
                <div className="flex items-center gap-3 text-xs text-blue-600 pt-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{hotel.cheapest_room.capacity_per_room_adults} хүн</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{hotel.nights} шөнө</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facilities */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {hotel.general_facilities.slice(0, 3).map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs text-gray-700 bg-gray-50 rounded-full px-2.5 py-1 border border-gray-200"
                >
                  {facilityIcons[facility] || <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                  <span>{facility}</span>
                </div>
              ))}
              {hotel.general_facilities.length > 3 && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded-full px-2.5 py-1 border border-blue-200">
                  +{hotel.general_facilities.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Price and Total */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {hotel.min_estimated_total > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {hotel.nights} шөнийн нийт:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ₮{formatPrice(hotel.min_estimated_total)}
                </span>
              </div>
            )}

            {/* Action Button */}
            <Link
              href={buildHotelUrl()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-center text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
            >
              <span>{t('hotel.viewDetails', 'Дэлгэрэнгүй үзэх')}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}