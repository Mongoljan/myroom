'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import SafeImage from '@/components/common/SafeImage';
import { ApiService } from '@/services/api';
import { SearchHotelResult, RoomPrice } from '@/types/api';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface HotelWithPrices extends SearchHotelResult {
  priceOptions?: {
    basePrice: number;
    halfDayPrice?: number;
    singlePersonPrice?: number;
    hasDiscount?: boolean;
  };
}

interface SimilarHotelsProps {
  currentHotelId: string | number;
  currentLocation?: string;
}

export default function SimilarHotels({ currentHotelId }: SimilarHotelsProps) {
  const { t } = useHydratedTranslation();
  const [hotels, setHotels] = useState<HotelWithPrices[]>([]);
  const [loading, setLoading] = useState(true);
  const { recentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const fetchSimilarHotels = async () => {
      try {
        setLoading(true);

        // Get recently viewed hotels as similar hotels
        const currentId = typeof currentHotelId === 'string' ? parseInt(currentHotelId) : currentHotelId;
        const similarHotels = recentlyViewed
          .filter(item => item.hotel.hotel_id !== currentId)
          .slice(0, 4)
          .map(item => item.hotel);

        // If not enough recently viewed, fallback to mock data or leave empty
        if (similarHotels.length === 0) {
          setHotels([]);
          return;
        }

        // Fetch price options for each hotel
        const hotelsWithPrices = await Promise.all(
          similarHotels.map(async (hotel) => {
            try {
              const roomPrices = await ApiService.getRoomPrices(hotel.hotel_id);

              // Get the cheapest room's price options
              const cheapestRoom = roomPrices.reduce((min, current) =>
                current.base_price < min.base_price ? current : min
              , roomPrices[0]);

              if (cheapestRoom) {
                return {
                  ...hotel,
                  priceOptions: {
                    basePrice: cheapestRoom.base_price,
                    halfDayPrice: cheapestRoom.half_day_price && cheapestRoom.half_day_price > 0 ? cheapestRoom.half_day_price : undefined,
                    singlePersonPrice: cheapestRoom.single_person_price && cheapestRoom.single_person_price > 0 ? cheapestRoom.single_person_price : undefined,
                    hasDiscount: cheapestRoom.half_day_price !== null && cheapestRoom.half_day_price > 0
                  }
                };
              }
              return hotel;
            } catch (error) {
              console.error(`Failed to fetch prices for hotel ${hotel.hotel_id}:`, error);
              return hotel;
            }
          })
        );

        setHotels(hotelsWithPrices);
      } catch (error) {
        console.error('Failed to fetch similar hotels:', error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarHotels();
  }, [currentHotelId, recentlyViewed]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('similar_hotels', 'Ижил төстэй буудлууд')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-300"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotels.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{t('similar_hotels', 'Ижил төстэй буудлууд')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotels.map((hotel) => (
          <Link key={hotel.hotel_id} href={`/hotel/${hotel.hotel_id}`}>
            <div className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="relative h-32 overflow-hidden">
                <SafeImage
                  src={hotel.images?.cover ?
                    (typeof hotel.images.cover === 'string' ? hotel.images.cover : hotel.images.cover.url) :
                    '/placeholder-hotel.jpg'
                  }
                  alt={hotel.property_name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {hotel.priceOptions?.hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Хямдрал
                  </div>
                )}
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-blue-600 transition-colors text-gray-900">
                    {hotel.property_name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">
                      {hotel.location?.province_city}, {hotel.location?.soum}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {[...Array(Math.floor(parseFloat(hotel.rating_stars?.value || '0')))].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {hotel.rating_stars?.label || 'Үнэлгээгүй'}
                  </span>
                </div>

                {/* Simple pricing display */}
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold">
                    {hotel.priceOptions ? (() => {
                      const validPrices = [
                        hotel.priceOptions.basePrice,
                        hotel.priceOptions.halfDayPrice,
                        hotel.priceOptions.singlePersonPrice
                      ].filter(price => price !== null && price !== undefined && price > 0) as number[];

                      const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : hotel.priceOptions.basePrice;
                      return `₮${lowestPrice.toLocaleString()}`;
                    })() :
                      `₮${hotel.cheapest_room?.price_per_night?.toLocaleString() || 'Үнэ тодорхойгүй'}`
                    }
                  </span>
                  <span className="text-xs text-gray-600">-с эхлэн</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}