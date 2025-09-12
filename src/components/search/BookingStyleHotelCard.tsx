'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, Heart, Bed, User, Wifi, Car, Utensils, Users, Dumbbell, Clock, TrendingDown, Info } from 'lucide-react';
import { SearchHotelResult, AdditionalInfo, PropertyDetails } from '@/types/api';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
  viewMode?: 'grid' | 'list';
}

const facilityIcons: { [key: string]: React.ReactNode } = {
  'Free Wi-Fi': <Wifi className="w-3 h-3 text-green-600" />,
  'Free WiFi': <Wifi className="w-3 h-3 text-green-600" />,
  'Parking': <Car className="w-3 h-3 text-blue-600" />,
  'Restaurant': <Utensils className="w-3 h-3 text-orange-600" />,
  'Room Service': <Users className="w-3 h-3 text-purple-600" />,
  'Fitness Center': <Dumbbell className="w-3 h-3 text-red-600" />,
  '24-hour Front Desk': <Clock className="w-3 h-3 text-gray-600" />,
  'Pool': <Users className="w-3 h-3 text-cyan-600" />,
};

export default function BookingStyleHotelCard({ hotel, searchParams, viewMode = 'list' }: HotelCardProps) {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  
  // Get search parameters
  const adults = parseInt(searchParams?.get('adults') || '2');
  const children = parseInt(searchParams?.get('children') || '0');
  const rooms = parseInt(searchParams?.get('rooms') || '1');
  const checkIn = searchParams?.get('check_in') || '';
  const checkOut = searchParams?.get('check_out') || '';
  
  // Calculate nights
  const nights = checkIn && checkOut ? 
    Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price);
  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating(hotel.rating_stars.value);
  const reviewScore = 8.1 + (Math.random() * 1.4); // 8.1-9.5 range
  const reviewCount = 124 + Math.floor(Math.random() * 800); // 124-924 reviews
  
  // Enhanced pricing calculation
  const baseRoomPrice = hotel.cheapest_room?.price_per_night || 120000;
  const totalRoomsPrice = baseRoomPrice * nights * rooms;
  
  // Add taxes and fees (realistic calculation)
  const taxRate = 0.13; // 13% VAT typical in Mongolia
  const cityTax = 2000 * nights * rooms; // City tax per night per room
  const serviceFee = totalRoomsPrice * 0.05; // 5% service fee
  
  const subtotal = totalRoomsPrice;
  const taxes = subtotal * taxRate;
  const totalWithTaxes = subtotal + taxes + cityTax + serviceFee;
  
  // Calculate discount
  const discountPercent = Math.floor(Math.random() * 25) + 10; // 10-35% discount
  const discountAmount = totalWithTaxes * (discountPercent / 100);
  const finalPrice = totalWithTaxes - discountAmount;
  
  // Review text based on score
  const getReviewText = (score: number) => {
    if (score >= 9.0) return 'Гайхалтай';
    if (score >= 8.5) return 'Маш сайн';
    if (score >= 8.0) return 'Сайн';
    if (score >= 7.5) return 'Дундаж';
    return 'Хангалттай';
  };

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) url += `?${searchParams.toString()}`;
    return url;
  };

  // Load property details and additional info
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        const detailsArray = await ApiService.getPropertyDetails(hotel.hotel_id);
        const details = detailsArray?.[0];
        if (details) {
          setPropertyDetails(details);
          if (details.Additional_Information) {
            const addInfo = await ApiService.getAdditionalInfo(details.Additional_Information);
            setAdditionalInfo(addInfo);
          }
        }
      } catch (error) {
        console.error('Failed to load property details:', error);
      }
    };
    
    loadPropertyData();
  }, [hotel.hotel_id]);

  // Mock room details based on guest count
  const getRoomSuggestion = () => {
    const totalGuests = adults + children;
    if (totalGuests <= 2) {
      return {
        type: 'Стандарт хос өрөө',
        beds: '1 том ор эсвэл 2 ганц ор',
        maxGuests: 2,
        included: ['Үнэгүй Wi-Fi', 'Өглөөний цай', 'Үнэгүй цуцлах']
      };
    } else if (totalGuests <= 3) {
      return {
        type: 'Дэлюкс өрөө',
        beds: '1 том ор + 1 нэмэлт ор',
        maxGuests: 3,
        included: ['Үнэгүй Wi-Fi', 'Өглөөний цай', 'Үнэгүй цуцлах', 'Mini bar']
      };
    } else {
      return {
        type: 'Гэр бүлийн өрөө',
        beds: '2 том ор эсвэл 1 том ор + 2 ганц ор',
        maxGuests: 4,
        included: ['Үнэгүй Wi-Fi', 'Өглөөний цай', 'Үнэгүй цуцлах', 'Гал тогоо']
      };
    }
  };

  const roomSuggestion = getRoomSuggestion();

  if (viewMode === 'list') {
    return (
      <Link href={buildHotelUrl()} className="block">
        <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden group">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image */}
            <div className="relative w-full md:w-48 h-48 md:h-48 flex-shrink-0 overflow-hidden">
              <Image
                src={propertyDetails?.property_photos?.[0]?.image || 
                     (typeof hotel.images?.cover === 'string' ? hotel.images.cover : 
                      hotel.images?.cover?.url || 
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop')}
                alt={hotel.property_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="224px"
                unoptimized
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {discountPercent > 15 && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded text-white bg-red-500">
                    -{discountPercent}% хямдрал
                  </span>
                )}
                <span className="px-1.5 py-0.5 text-xs font-medium rounded text-white bg-green-600">
                  Шууд баталгаажуулалт
                </span>
              </div>
              
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Hotel Details */}
            <div className="flex-1 p-3 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1 mr-2">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {hotel.property_name}
                    </h3>
                    <div className="flex">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{hotel.location.province_city}</span>
                    {hotel.location.distance_from_center && (
                      <span className="text-xs text-gray-500">• {hotel.location.distance_from_center}</span>
                    )}
                  </div>
                </div>
                
                {/* Review Score */}
                <div className="flex items-center gap-1">
                  <div className="text-right">
                    <div className="text-xs text-gray-600">{getReviewText(reviewScore)}</div>
                    <div className="text-xs text-gray-500">{reviewCount} үнэлгээ</div>
                  </div>
                  <div className="bg-blue-600 text-white px-1.5 py-1 rounded text-xs font-bold">
                    {reviewScore.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* About text */}
              {additionalInfo?.About && (
                <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                  {additionalInfo.About}
                </p>
              )}

              {/* Room Preview with Guest Matching */}
              <div className="bg-gray-50 rounded p-2 mb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Bed className="w-3 h-3 text-gray-600" />
                      <span className="text-xs font-medium text-gray-900">{roomSuggestion.type}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {roomSuggestion.beds} • {roomSuggestion.maxGuests} хүнд тохиромжтой
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        {adults} том хүн{children > 0 && `, ${children} хүүхэд`} • {nights} шөнө
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Included amenities */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {roomSuggestion.included.slice(0, 3).map((item, index) => (
                    <span key={index} className="flex items-center gap-0.5 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hotel Amenities */}
              <div className="flex flex-wrap gap-1 mb-2">
                {hotel.general_facilities.slice(0, 6).map((facility, index) => (
                  <div key={index} className="flex items-center gap-0.5 text-xs text-gray-600 bg-gray-100 rounded px-1.5 py-0.5">
                    {facilityIcons[facility] || <CheckCircle className="w-3 h-3 text-gray-500" />}
                    <span>{facility}</span>
                  </div>
                ))}
                {hotel.general_facilities.length > 6 && (
                  <span className="text-xs text-blue-600">+{hotel.general_facilities.length - 6} бусад</span>
                )}
              </div>

              {/* Pricing Information */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    {rooms} өрөө • {nights} шөнө • {adults + children} хүн
                  </div>
                  
                  {/* Price breakdown */}
                  <div className="flex items-baseline gap-1">
                    {discountPercent > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ₮{formatPrice(totalWithTaxes)}
                      </span>
                    )}
                    <span className="text-base font-bold text-gray-900">
                      ₮{formatPrice(finalPrice)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    Татвар, үйлчилгээний төлбөр орсон
                  </div>
                  
                  {discountPercent > 0 && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <TrendingDown className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        ₮{formatPrice(discountAmount)} хэмнэж байна
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Button Section */}
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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

  // Grid View - Booking.com style compact
  return (
    <Link href={buildHotelUrl()} className="block h-full">
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden group h-full flex flex-col">
        {/* Hotel Image */}
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          <Image
            src={propertyDetails?.property_photos?.[0]?.image || 
                 (typeof hotel.images?.cover === 'string' ? hotel.images.cover : 
                  hotel.images?.cover?.url || 
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop')}
            alt={hotel.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="280px"
            unoptimized
          />
          
          <button className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart className="w-3 h-3 text-gray-600" />
          </button>
          
          {discountPercent > 15 && (
            <div className="absolute top-2 left-2">
              <span className="px-1.5 py-0.5 text-xs font-bold rounded text-white bg-red-500">
                -{discountPercent}%
              </span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
            {reviewScore.toFixed(1)}
          </div>
        </div>

        {/* Hotel Info */}
        <div className="p-3 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors flex-1">
              {hotel.property_name}
            </h3>
            <div className="flex">
              {[...Array(stars)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-xs line-clamp-1">{hotel.location.province_city}</span>
          </div>

          {/* Room info */}
          <div className="text-xs text-gray-600 mb-1">
            <Bed className="w-3 h-3 inline mr-1" />
            {roomSuggestion.type}
          </div>

          {/* Key amenities */}
          <div className="flex flex-wrap gap-1 mb-2">
            {roomSuggestion.included.slice(0, 2).map((item, index) => (
              <span key={index} className="text-xs text-green-600 bg-green-50 rounded-lg px-1 py-0.5">
                {item}
              </span>
            ))}
          </div>

          {/* Price and Button - always at bottom */}
          <div className="border-t border-gray-100 pt-2 mt-auto space-y-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {nights} шөнө, {adults + children} хүн
              </div>
              <div className="flex items-baseline gap-1">
                {discountPercent > 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    ₮{formatPrice(totalWithTaxes)}
                  </span>
                )}
                <span className="text-sm font-bold text-gray-900">
                  ₮{formatPrice(finalPrice)}
                </span>
              </div>
              <div className="text-xs text-gray-500">Татвар орсон</div>
            </div>
            
            {/* Button Section */}
            <div className="flex justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-full">
                Өрөө сонгох
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}