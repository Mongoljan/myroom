'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { SearchHotelResult } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import SafeImage from '@/components/common/SafeImage';
import Link from 'next/link';

interface RecentHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  rating_label: string;
  stars: number;
  viewedAt: string;
}

export default function RecentlyViewed() {
  const { t } = useHydratedTranslation();
  const { recentlyViewed, removeRecentlyViewed } = useRecentlyViewed();
  const [recentHotels, setRecentHotels] = useState<RecentHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getHotelImage = (hotel: SearchHotelResult): string => {
    if (hotel.images?.cover) {
      if (typeof hotel.images.cover === 'string') return hotel.images.cover;
      if (hotel.images.cover.url) return hotel.images.cover.url;
    }
    if (hotel.images?.gallery && hotel.images.gallery.length > 0) return hotel.images.gallery[0].url;
    const fallbackImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format'
    ];
    return fallbackImages[hotel.hotel_id % fallbackImages.length];
  };

  useEffect(() => {
    setIsLoading(true);
    if (recentlyViewed.length === 0) {
      setRecentHotels([]);
    } else {
      setRecentHotels(recentlyViewed.map((item) => {
        const hotel = item.hotel;
        return {
          id: item.id,
          name: hotel.property_name,
          location: hotel.location?.province_city && hotel.location?.soum
            ? `${hotel.location.province_city}, ${hotel.location.soum}`
            : hotel.location?.province_city || t('common.locationUnknown', 'Location unknown'),
          rating: parseFloat(hotel.rating_stars?.value) || 0,
          price: hotel.cheapest_room?.price_per_night || 0,
          image: getHotelImage(hotel),
          rating_label: hotel.rating_stars?.label || t('hotel.rating', 'Rating'),
          stars: parseInt(hotel.rating_stars?.value) || 0,
          viewedAt: item.viewedAt,
        };
      }));
    }
    setIsLoading(false);
  }, [recentlyViewed]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element && recentHotels.length > 0) {
      const check = () => {
        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
      };
      setTimeout(check, 100);
    }
  }, [recentHotels]);

  if (recentHotels.length === 0 && !isLoading) return null;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {t('hotel.recentlyViewed')}
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] h-[110px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl animate-pulse flex overflow-hidden">
                <div className="w-[110px] bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={() => {
                const el = scrollRef.current;
                if (el) {
                  setCanScrollLeft(el.scrollLeft > 0);
                  setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
                }
              }}
            >
              {recentHotels.map((hotel, index) => {
                const starCount = Math.min(5, Math.max(0, Math.round(hotel.stars)));
                return (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex-shrink-0 w-[300px] group"
                  >
                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.preventDefault(); removeRecentlyViewed(hotel.id); }}
                      className="absolute top-2 right-2 z-20 bg-white/90 dark:bg-gray-800/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      aria-label="Remove"
                    >
                      <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    </button>

                    <Link
                      href={`/hotel/${hotel.id}`}
                      className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 h-[110px]"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-[110px] flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                        <SafeImage
                          src={hotel.image}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug pr-5">
                            {hotel.name}
                          </p>
                          {/* Stars */}
                          {starCount > 0 && (
                            <div className="flex items-center gap-0.5 mt-1">
                              {Array.from({ length: starCount }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              ))}
                              {Array.from({ length: 5 - starCount }).map((_, i) => (
                                <Star key={`e${i}`} className="w-3 h-3 text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600" />
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Rating score */}
                        {hotel.rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded leading-none">
                              {hotel.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {hotel.rating_label?.replace(/\d+\s*stars?/i, '').trim() || ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
