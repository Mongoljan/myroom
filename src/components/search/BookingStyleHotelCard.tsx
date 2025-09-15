'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, Heart, Bed, User, Wifi, Car, Utensils, Users, Dumbbell, Clock, Info } from 'lucide-react';
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
  
  // Use ONLY actual hotel data - no made up calculations
  const roomPrice = hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0;
  const totalPrice = roomPrice * nights * rooms;
  

  const buildHotelUrl = () => {
    let url = `/hotel/${hotel.hotel_id}`;
    if (searchParams) url += `?${searchParams.toString()}`;
    return url;
  };

  // Load property details and additional info
  useEffect(() => {
    if (!hotel.hotel_id) return; // Guard against falsy hotel_id
    
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


  if (viewMode === 'list') {
    return (
      <Link href={buildHotelUrl()} className="block">
        <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden group">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image */}
            <div className="relative w-full md:w-48 h-40 md:h-40 flex-shrink-0 overflow-hidden">
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
              
              
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Hotel Details - Compact */}
            <div className="flex-1 p-2.5 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {hotel.property_name}
                    </h3>
                    {stars > 0 && (
                      <div className="flex">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{hotel.location.province_city}</span>
                  </div>
                </div>
              </div>


              {/* Guest info */}
              {hotel.cheapest_room && (
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-1.5">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{adults} том хүн{children > 0 && `, ${children} хүүхэд`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    <span>{rooms} өрөө</span>
                  </div>
                  <span>{nights} шөнө</span>
                </div>
              )}

              {/* Hotel Amenities - Compact */}
              {hotel.general_facilities && hotel.general_facilities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {hotel.general_facilities.slice(0, 4).map((facility, index) => (
                    <span key={index} className="inline-flex items-center gap-0.5 text-xs text-gray-600 bg-gray-50 rounded px-1.5 py-0.5">
                      {facilityIcons[facility] || <CheckCircle className="w-2.5 h-2.5 text-gray-500" />}
                      <span>{facility}</span>
                    </span>
                  ))}
                  {hotel.general_facilities.length > 4 && (
                    <span className="text-xs text-gray-500">+{hotel.general_facilities.length - 4}</span>
                  )}
                </div>
              )}

              {/* Pricing Information - Compact */}
              <div className="flex items-end justify-between mt-auto">
                <div>
                  {hotel.cheapest_room && (
                    <>
                      <div className="text-xs text-gray-500">эхлэх үнэ</div>
                      <div className="text-base font-bold text-gray-900">₮{formatPrice(roomPrice)}</div>
                      <div className="text-xs text-gray-500">1 шөнө</div>
                    </>
                  )}
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
                  Дэлгэрэнгүй үзэх
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View - Compact
  return (
    <Link href={buildHotelUrl()} className="block h-full">
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden group h-full flex flex-col">
        {/* Hotel Image */}
        <div className="relative h-32 overflow-hidden flex-shrink-0">
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
        </div>

        {/* Hotel Info - Compact */}
        <div className="p-2.5 flex flex-col flex-1">
          <div className="mb-1">
            <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {hotel.property_name}
            </h3>
            {stars > 0 && (
              <div className="flex mt-0.5">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-gray-600 mb-1.5">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-xs line-clamp-1">{hotel.location.province_city}</span>
          </div>

          {/* Key amenities */}
          {hotel.general_facilities && hotel.general_facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {hotel.general_facilities.slice(0, 2).map((facility, index) => (
                <span key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-1 py-0.5">
                  {facility}
                </span>
              ))}
            </div>
          )}

          {/* Price - always at bottom */}
          <div className="mt-auto">
            {hotel.cheapest_room && (
              <div className="border-t border-gray-100 pt-1.5">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-gray-500">эхлэх үнэ</div>
                    <div className="text-sm font-bold text-gray-900">₮{formatPrice(roomPrice)}</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors">
                    үзэх
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