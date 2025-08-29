'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  image: string;
}

interface SimilarHotelsProps {
  currentHotelId: string;
}

// Mock similar hotels data
const mockSimilarHotels: Hotel[] = [
  {
    id: '2',
    name: 'Boutique City Hotel',
    location: 'Manhattan, NY',
    rating: 4.6,
    reviewCount: 892,
    price: 249,
    originalPrice: 329,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'
  },
  {
    id: '3',
    name: 'Modern Business Hotel',
    location: 'Midtown, NY',
    rating: 4.4,
    reviewCount: 1156,
    price: 199,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'
  },
  {
    id: '4',
    name: 'Luxury Suites',
    location: 'Upper East Side, NY',
    rating: 4.9,
    reviewCount: 743,
    price: 399,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400'
  },
  {
    id: '5',
    name: 'Historic Grand Hotel',
    location: 'Financial District, NY',
    rating: 4.3,
    reviewCount: 2134,
    price: 179,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'
  }
];

export default function SimilarHotels({ currentHotelId }: SimilarHotelsProps) {
  const { t } = useHydratedTranslation();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    // Filter out current hotel and get similar ones
    const similarHotels = mockSimilarHotels.filter(hotel => hotel.id !== currentHotelId);
    setHotels(similarHotels.slice(0, 4));
  }, [currentHotelId]);

  if (hotels.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Similar Hotels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
            <div className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {hotel.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Save ${hotel.originalPrice - hotel.price}
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors text-gray-900">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-900 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{hotel.rating}</span>
                  </div>
                  <span className="text-gray-900 text-sm">
                    ({hotel.reviewCount} {t('hotel.reviews', 'reviews')})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    {hotel.originalPrice && (
                      <div className="text-gray-600 text-sm line-through">
                        ${hotel.originalPrice}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">${hotel.price}</span>
                      <span className="text-gray-900 text-sm">
                        / {t('hotel.night', 'night')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}