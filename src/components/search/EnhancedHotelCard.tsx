'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Wifi, Car, Utensils, Users, Calendar, CheckCircle, User, Bed, Info, TrendingDown, Heart } from 'lucide-react';
import { SearchHotelResult, AdditionalInfo, PropertyDetails } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
  viewMode?: 'grid' | 'list';
  index?: number;
}

const facilityIcons: { [key: string]: React.ReactNode } = {
  'Free Wi-Fi': <Wifi className="w-3.5 h-3.5 text-green-600" />,
  'Free WiFi': <Wifi className="w-3.5 h-3.5 text-green-600" />,
  'Parking': <Car className="w-3.5 h-3.5 text-blue-600" />,
  'Restaurant': <Utensils className="w-3.5 h-3.5 text-orange-600" />,
  'Room Service': <Users className="w-3.5 h-3.5 text-purple-600" />,
};

export default function EnhancedHotelCard({ hotel, searchParams, viewMode = 'list' }: HotelCardProps) {
  const { t } = useHydratedTranslation();
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  
  // Calculate guest-specific pricing
  const adults = parseInt(searchParams?.get('adults') || '2');
  const children = parseInt(searchParams?.get('children') || '0');
  const rooms = parseInt(searchParams?.get('rooms') || '1');
  const checkIn = searchParams?.get('check_in') || '';
  const checkOut = searchParams?.get('check_out') || '';
  
  // Calculate nights
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating(hotel.rating_stars.value);
  
  // Mock review data (in real app, this would come from API)
  const reviewScore = 8.5 + (stars * 0.3);
  const reviewCount = Math.floor(Math.random() * 1000) + 100;
  const reviewText = reviewScore >= 9 ? 'Маш сайн' : reviewScore >= 8 ? 'Сайн' : 'Дунджаас дээр';
  
  // Calculate total price with mock discount
  const basePrice = hotel.cheapest_room?.price_per_night || 0;
  const totalPrice = basePrice * nights * rooms;
  const discountPercent = Math.floor(Math.random() * 20) + 5; // 5-25% discount
  const discountedPrice = totalPrice * (1 - discountPercent / 100);
  const savedAmount = totalPrice - discountedPrice;

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) {
      url += `?${searchParams.toString()}`;
    }
    return url;
  };

  // Load additional info
  useEffect(() => {
    const loadAdditionalInfo = async () => {
      try {
        // In real app, you would need to have the additional info ID
        // For now, using mock data with the structure you provided
        setAdditionalInfo({
          id: 25,
          About: "Энэхүү зочид буудал нь төв байршилтай, орчин үеийн тохижилттой, найрсаг үйлчилгээгээрээ алдартай.",
          YoutubeUrl: "https://youtu.be/DjKVaY7r370?si=KP67bCtgq-vYDzns",
          property: hotel.hotel_id
        });
      } catch (error) {
        console.error('Failed to load additional info:', error);
        // Fallback to mock data
        setAdditionalInfo({
          id: 25,
          About: "Энэхүү зочид буудал нь төв байршилтай, орчин үеийн тохижилттой, найрсаг үйлчилгээгээрээ алдартай.",
          YoutubeUrl: "https://youtu.be/example",
          property: hotel.hotel_id
        });
      }
    };
    
    loadAdditionalInfo();
  }, [hotel.hotel_id]);

  if (viewMode === 'list') {
    return (
      <Link href={buildHotelUrl()} className="block">
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="flex flex-col md:flex-row h-full">
            {/* Hotel Image - Fixed size */}
            <div className="relative md:w-80 h-52 md:h-64 flex-shrink-0 overflow-hidden">
              <Image
                src={typeof hotel.images?.cover === 'string' ? hotel.images.cover : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 320px"
                unoptimized
              />
              
              {/* Wishlist button */}
              <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discountPercent > 15 && (
                  <span className="px-2 py-1 text-xs font-bold rounded text-white bg-red-500">
                    -{discountPercent}%
                  </span>
                )}
                {hotel.cheapest_room && hotel.cheapest_room.price_per_night < 200000 && (
                  <span className="px-2 py-1 text-xs font-medium rounded text-white bg-green-500">
                    Хямдралтай
                  </span>
                )}
              </div>
            </div>

            {/* Hotel Details - Enhanced */}
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex-1">
                {/* Header with title and rating */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {hotel.property_name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-sm text-gray-600">{hotel.location.province_city}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Score */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{reviewText}</div>
                      <div className="text-xs text-gray-500">{reviewCount} сэтгэгдэл</div>
                    </div>
                    <div className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg">
                      <div className="text-base font-bold">{reviewScore.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-3">
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
                  <span className="text-xs text-gray-600">
                    {hotel.rating_stars.label?.replace(/\d+\s*stars?/i, '').trim()}
                  </span>
                </div>

                {/* About/Additional Info */}
                {additionalInfo?.About && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {additionalInfo.About}
                  </p>
                )}

                {/* Room Preview */}
                {hotel.cheapest_room && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Bed className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {hotel.cheapest_room.room_type_label || 'Стандарт өрөө'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {adults + children} хүн
                          </span>
                        </div>
                      </div>
                      
                      {/* Green checkmarks for included amenities */}
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Өглөөний цай орсон
                        </span>
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Үнэгүй цуцлах
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Facilities */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hotel.general_facilities.slice(0, 5).map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1"
                    >
                      {facilityIcons[facility] || <CheckCircle className="w-3 h-3 text-gray-500" />}
                      <span>{facility}</span>
                    </div>
                  ))}
                  {hotel.general_facilities.length > 5 && (
                    <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                      +{hotel.general_facilities.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-end justify-between">
                  <div>
                    {/* Guest and nights info */}
                    <div className="text-xs text-gray-500 mb-1">
                      {nights} шөнө, {adults} том хүн{children > 0 && `, ${children} хүүхэд`}
                    </div>
                    
                    {/* Price breakdown */}
                    <div className="flex items-baseline gap-2">
                      {discountPercent > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₮{formatPrice(totalPrice)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-gray-900">
                        ₮{formatPrice(discountedPrice)}
                      </span>
                    </div>
                    
                    {/* Savings badge */}
                    {savedAmount > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">
                          ₮{formatPrice(savedAmount)} хэмнэнэ
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200">
                    Өрөө сонгох
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View - Consistent sizing
  return (
    <Link href={buildHotelUrl()} className="block h-full">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:shadow-lg group h-full flex flex-col">
        {/* Hotel Image - Fixed height */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <Image
            src={typeof hotel.images?.cover === 'string' ? hotel.images.cover : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
            alt={hotel.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          
          {/* Wishlist button */}
          <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {discountPercent > 15 && (
              <span className="px-2 py-1 text-xs font-bold rounded text-white bg-red-500">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            {reviewScore.toFixed(1)}
          </div>
        </div>

        {/* Hotel Info - Flex grow for consistent height */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {hotel.property_name}
            </h3>
            
            {/* Location */}
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span className="text-sm line-clamp-1">{hotel.location.province_city}</span>
            </div>

            {/* Rating Stars and Reviews */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{reviewCount} сэтгэгдэл</span>
            </div>

            {/* Room info */}
            {hotel.cheapest_room && (
              <div className="text-xs text-gray-600 mb-2 line-clamp-1">
                <Bed className="w-3 h-3 inline mr-1" />
                {hotel.cheapest_room.room_type_label || 'Стандарт өрөө'}
              </div>
            )}

            {/* Facilities - Compact */}
            <div className="flex flex-wrap gap-1 mb-3">
              {hotel.general_facilities.slice(0, 3).map((facility, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-0.5"
                >
                  {facility}
                </div>
              ))}
              {hotel.general_facilities.length > 3 && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                  +{hotel.general_facilities.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Price - Always at bottom */}
          <div className="border-t border-gray-100 pt-3 mt-auto">
            {hotel.cheapest_room && (
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {nights} шөнө, {adults} хүн
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      {discountPercent > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          ₮{formatPrice(totalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ₮{formatPrice(discountedPrice)}
                    </div>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Үзэх →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}