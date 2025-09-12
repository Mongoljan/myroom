'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TYPOGRAPHY } from '@/styles/containers';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { SearchHotelResult } from '@/types/api';

interface RecentHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating_label: string;
}

export default function RecentlyViewed() {
  const { recentlyViewed, removeRecentlyViewed } = useRecentlyViewed();
  const [recentHotels, setRecentHotels] = useState<RecentHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Helper function to extract image URL from hotel data
  const getHotelImage = (hotel: SearchHotelResult): string => {
    let imageUrl: string;

    // Try cover image first
    if (hotel.images?.cover) {
      if (typeof hotel.images.cover === 'string') {
        imageUrl = hotel.images.cover;
        console.log(`Using cover image (string) for hotel ${hotel.property_name}:`, imageUrl);
        return imageUrl;
      } else if (hotel.images.cover.url) {
        imageUrl = hotel.images.cover.url;
        console.log(`Using cover image (object) for hotel ${hotel.property_name}:`, imageUrl);
        return imageUrl;
      }
    }

    // Try first gallery image as fallback
    if (hotel.images?.gallery && hotel.images.gallery.length > 0) {
      imageUrl = hotel.images.gallery[0].url;
      console.log(`Using gallery image for hotel ${hotel.property_name}:`, imageUrl);
      return imageUrl;
    }

    // Return a variety of fallback images instead of always the same one
    const fallbackImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format', 
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format'
    ];
    
    imageUrl = fallbackImages[hotel.hotel_id % fallbackImages.length];
    console.log(`Using fallback image for hotel ${hotel.property_name}:`, imageUrl);
    return imageUrl;
  };

  useEffect(() => {
    const loadRecentHotels = () => {
      setIsLoading(true);
      
      // Only show hotels that user has actually viewed - no fallbacks
      if (recentlyViewed.length === 0) {
        // No recently viewed hotels - show empty state
        setRecentHotels([]);
      } else {
        // Convert recently viewed to RecentHotel format
        const hotels: RecentHotel[] = recentlyViewed.map((item, index) => {
          const hotel = item.hotel;
          const viewedDate = new Date(item.viewedAt);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - viewedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let badge: string | undefined;
          if (diffDays === 1) {
            badge = 'TODAY';
          } else if (diffDays <= 3) {
            badge = 'RECENT';
          } else if (index === 0) {
            badge = 'LAST VIEWED';
          }

          return {
            id: item.id,
            name: hotel.property_name,
            location: `${hotel.location.province_city}, ${hotel.location.soum}`,
            rating: parseFloat(hotel.rating_stars.value) || 4.0,
            price: hotel.cheapest_room?.price_per_night || 0,
            image: getHotelImage(hotel),
            badge,
            rating_label: hotel.rating_stars.label
          };
        });
        setRecentHotels(hotels);
      }
      
      setIsLoading(false);
    };

    loadRecentHotels();
  }, [recentlyViewed]);

  // Check scroll positions
  useEffect(() => {
    const element = scrollRef.current;
    if (element && recentHotels.length > 0) {
      const checkScroll = () => {
        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
      };
      
      setTimeout(checkScroll, 100);
    }
  }, [recentHotels]);


  const removeFromRecent = (hotelId: string) => {
    removeRecentlyViewed(hotelId);
    setRecentHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  // Get current availability date range for display (Hotels.com style)
  const getAvailabilityDateRange = () => {
    const today = new Date();
    const tomorrow = new Date(Date.now() + 24*60*60*1000);
    
    const formatDate = (date: Date) => {
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('mn-MN', { month: 'short' })
      };
    };
    
    const startDate = formatDate(today);
    const endDate = formatDate(tomorrow);
    
    return { startDate, endDate };
  };

  if (recentHotels.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Сүүлд үзсэн</h2>
            <p className="text-sm text-gray-600">
              {recentHotels.length === 1 
                ? 'Сүүлд үзсэн зочид буудал' 
                : `Сүүлд үзсэн ${recentHotels.length} зочид буудал`}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse min-w-[280px] flex-shrink-0"
              >
                <div className="h-36 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded-md mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded-md mb-2 w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                 style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                 onScroll={() => {
                   const element = scrollRef.current;
                   if (element) {
                     setCanScrollLeft(element.scrollLeft > 0);
                     setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
                   }
                 }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {/* Left scroll button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
              )}
              
              {/* Right scroll button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              )}
            {recentHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white border border-gray-200 rounded-lg transition-all duration-200 overflow-hidden min-w-[280px] flex-shrink-0"
              >
              <Link href={`/hotel/${hotel.id}`}>
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={`${hotel.name} - Hotel image`}
                    fill
                    className="object-cover transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    onError={(e) => {
                      // Fallback to a different image if the current one fails
                      const target = e.currentTarget;
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
                        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format',
                        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format'
                      ];
                      const currentIndex = fallbackImages.findIndex(img => img === target.src);
                      const nextIndex = (currentIndex + 1) % fallbackImages.length;
                      target.src = fallbackImages[nextIndex];
                    }}
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {hotel.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="text-xs line-clamp-1">{hotel.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium mr-1">
                        {hotel.rating}
                      </div>
                      <span className="text-xs text-gray-500">
                        {hotel.rating_label?.replace(/\d+\s*stars?/i, '').trim() || 'үнэлгээ'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">эхлэх үнэ</div>
                      <div className="text-sm font-bold text-gray-900">
                        ₮{formatPrice(hotel.price)}-с
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}