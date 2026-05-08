'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { SearchHotelResult } from '@/types/api';
import SectionHotelCard from '@/components/common/SectionHotelCard';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

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
  stars: number;
  viewedAt: string;
}

export default function RecentlyViewed() {
  const { t } = useHydratedTranslation();
  const { recentlyViewed } = useRecentlyViewed();
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
        return imageUrl;
      } else if (hotel.images.cover.url) {
        imageUrl = hotel.images.cover.url;
        return imageUrl;
      }
    }

    // Try first gallery image as fallback
    if (hotel.images?.gallery && hotel.images.gallery.length > 0) {
      imageUrl = hotel.images.gallery[0].url;
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
            badge = 'Өнөөдөр';
          } else if (diffDays <= 3) {
            badge = 'Саяхан';
          } else if (index === 0) {
            badge = 'Сүүлд үзсэн';
          }

          return {
            id: item.id,
            name: hotel.property_name,
            location: hotel.location?.province_city && hotel.location?.soum 
              ? `${hotel.location.province_city}, ${hotel.location.soum}`
              : hotel.location?.province_city || t('common.locationUnknown', 'Location unknown'),
            rating: parseFloat(hotel.rating_stars?.value) || 4.0,
            price: hotel.cheapest_room?.price_per_night || 0,
            image: getHotelImage(hotel),
            badge,
            rating_label: hotel.rating_stars?.label || t('hotel.rating', 'Rating'),
            stars: parseInt(hotel.rating_stars?.value) || 0,
            viewedAt: item.viewedAt,
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



  if (recentHotels.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('hotel.recentlyViewed')}</h2>
            <p className="text-caption text-gray-500 dark:text-gray-400">
              {t('hotel.recentlyViewedCount', { count: recentHotels.length })}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse min-w-[280px] flex-shrink-0"
              >
                <div className="h-36 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md mb-1"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 w-3/4"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide scroll-smooth"
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
              
              {/* Right scroll button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            {recentHotels.map((hotel, index) => (
              <SectionHotelCard
                key={hotel.id}
                id={hotel.id}
                name={hotel.name}
                location={hotel.location}
                rating={hotel.rating}
                ratingLabel={hotel.rating_label}
                price={hotel.price}
                image={hotel.image}
                badge={hotel.badge}
                badgeColor="blue"
                index={index}
                stars={hotel.stars}
                viewedAt={hotel.viewedAt}
              />
            ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}