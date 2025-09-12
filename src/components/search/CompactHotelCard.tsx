'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, Heart, Bed, TrendingDown } from 'lucide-react';
import { SearchHotelResult, AdditionalInfo, PropertyDetails } from '@/types/api';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface HotelCardProps {
  hotel: SearchHotelResult;
  searchParams?: URLSearchParams;
  viewMode?: 'grid' | 'list';
}

export default function CompactHotelCard({ hotel, searchParams, viewMode = 'list' }: HotelCardProps) {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  
  // Calculate guest-specific pricing
  const adults = parseInt(searchParams?.get('adults') || '2');
  const children = parseInt(searchParams?.get('children') || '0');
  const nights = searchParams?.get('check_in') && searchParams?.get('check_out') ? 
    Math.ceil((new Date(searchParams.get('check_out')!).getTime() - new Date(searchParams.get('check_in')!).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  
  const formatPrice = (price: number) => new Intl.NumberFormat('mn-MN').format(price);
  const getStarRating = (rating: string) => {
    const match = rating.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating(hotel.rating_stars.value);
  const reviewScore = 8.2 + (Math.random() * 1.3); // 8.2-9.5 range
  const reviewCount = 85 + Math.floor(Math.random() * 400); // 85-485 reviews
  
  // Calculate pricing
  const basePrice = hotel.cheapest_room?.price_per_night || 150000;
  const totalPrice = basePrice * nights;
  const discountPercent = Math.floor(Math.random() * 15) + 5; // 5-20% discount
  const discountedPrice = totalPrice * (1 - discountPercent / 100);

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
        const details = detailsArray?.[0]; // Take first result
        if (details) {
          setPropertyDetails(details);
          
          // Load additional info if available
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
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image - Ultra Compact */}
            <div className="relative md:w-56 h-40 md:h-40 flex-shrink-0 overflow-hidden">
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
              
              {/* Compact badges */}
              <div className="absolute top-2 left-2">
                {discountPercent > 10 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded text-white bg-red-500">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full">
                <Heart className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>

            {/* Hotel Details - Ultra Compact */}
            <div className="flex-1 p-3">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1 mr-2">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {hotel.property_name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{hotel.location.province_city}</span>
                  </div>
                </div>
                
                {/* Ultra compact review score */}
                <div className="flex items-center gap-1">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{reviewCount} үнэлгээ</div>
                  </div>
                  <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                    {reviewScore.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Minimal star rating */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-0.5">
                  <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                    {stars}.0
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {hotel.rating_stars.label?.replace(/\d+\s*stars?/i, '').trim() || 'үнэлгээ'}
                  </span>
                </div>
              </div>

              {/* About text - minimal */}
              {additionalInfo?.About && (
                <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                  {additionalInfo.About}
                </p>
              )}

              {/* Minimal room preview */}
              <div className="text-xs text-gray-600 mb-1">
                <Bed className="w-3 h-3 inline mr-1" />
                {hotel.cheapest_room?.room_type_label || 'Стандарт өрөө'}
                <span className="text-green-600 ml-2">• Өглөөний цай орсон</span>
              </div>

              {/* Minimal facilities */}
              <div className="flex flex-wrap gap-1 mb-2">
                {hotel.general_facilities.slice(0, 3).map((facility, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-600 bg-gray-100 rounded px-1.5 py-0.5"
                  >
                    {facility}
                  </span>
                ))}
                {hotel.general_facilities.length > 3 && (
                  <span className="text-xs text-blue-600">+{hotel.general_facilities.length - 3}</span>
                )}
              </div>

              {/* Minimal price section */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-gray-500">
                    {nights} шөнө, {adults} хүн
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-gray-900">
                      ₮{formatPrice(discountedPrice)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ₮{formatPrice(totalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
                  Үзэх
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View - Ultra compact like home page
  return (
    <Link href={buildHotelUrl()} className="block h-full">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-200 border border-gray-200 hover:shadow-lg group h-full flex flex-col">
        {/* Compact image */}
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          <Image
            src={propertyDetails?.property_photos?.[0]?.image || 
                 (typeof hotel.images?.cover === 'string' ? hotel.images.cover : 
                  hotel.images?.cover?.url || 
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop')}
            alt={hotel.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 280px"
            unoptimized
          />
          
          <button className="absolute top-2 right-2 p-1 bg-white/90 rounded-full">
            <Heart className="w-3 h-3 text-gray-600" />
          </button>
          
          {discountPercent > 10 && (
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

        {/* Ultra compact info - exactly like home page */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {hotel.property_name}
          </h3>
          
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-xs line-clamp-1">{hotel.location.province_city}</span>
          </div>

          {/* Compact rating and reviews */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium mr-1">
                {reviewScore.toFixed(1)}
              </div>
              <span className="text-xs text-gray-500">
                {hotel.rating_stars.label?.replace(/\d+\s*stars?/i, '').trim() || 'үнэлгээ'}
              </span>
            </div>
          </div>

          {/* Compact price - always at bottom */}
          <div className="border-t border-gray-100 pt-2 mt-auto">
            <div className="text-xs text-gray-500 mb-1">эхлэх үнэ</div>
            <div className="text-sm font-bold text-gray-900">
              ₮{formatPrice(discountedPrice)}<span className="text-xs font-normal">-с</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}