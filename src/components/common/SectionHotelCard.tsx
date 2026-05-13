'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { text } from '@/styles/design-system';
import SafeImage from '@/components/common/SafeImage';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import WishlistHeart from '@/components/wishlist/WishlistHeart';

interface SectionHotelCardProps {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  ratingLabel: string | null;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: 'orange' | 'green' | 'blue' | 'purple' | 'gray';
  index?: number;
  className?: string;
  /** Hotel star classification (1–5). Shows ★ icons next to the name. */
  stars?: number;
  /** ISO date string — when the user viewed this hotel. Shows "Өнөөдөр" / "N өдрийн өмнө". */
  viewedAt?: string;
}

export default function SectionHotelCard({
  id,
  name,
  location,
  rating,
  ratingLabel,
  price,
  image,
  badge,
  badgeColor = 'gray',
  index = 0,
  className = "",
  stars,
  viewedAt,
}: SectionHotelCardProps) {
  const { t } = useHydratedTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      blue: 'bg-primary',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format'
    ];
    return fallbackImages[parseInt(id) % fallbackImages.length];
  };

  const starCount = stars ? Math.min(5, Math.max(1, Math.round(stars))) : 0;
  const imageUrl = image || getFallbackImage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`w-[280px] flex-shrink-0 ${className}`}
    >
      <Link
        href={`/hotel/${id}`}
        className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:shadow-lg block"
      >
        {/* Hotel Image - Fixed dimensions for consistent sizing */}
          <div className="relative w-full h-[180px] overflow-hidden bg-gray-100 dark:bg-gray-700">
          <SafeImage
            src={imageUrl}
            alt={`${name} - Hotel image`}
            fill
            className="object-cover"
          />

          {/* Badge - Top Left */}
          {badge && (
            <div className="absolute top-2 left-2 z-10">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md text-white ${getBadgeColor(badgeColor)}`}>
                {badge}
              </span>
            </div>
          )}

          {/* Wishlist Heart - Top Right */}
          <div className="absolute top-2 right-2 z-10">
            <WishlistHeart 
              hotelId={parseInt(id)}
              size={24}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full"
              showTooltip={true}
              tooltipPosition="left"
            />
          </div>
        </div>

        {/* Hotel Info */}
        <div className="p-3 flex flex-col gap-1.5">

          {/* Name + star classification */}
          <div>
            <h3 className={`${text.h4} text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors`}>
              {name}
            </h3>
            {starCount > 0 && (
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: starCount }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
                {Array.from({ length: 5 - starCount }).map((_, i) => (
                  <Star key={`e${i}`} className="w-3 h-3 text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600" />
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className={`${text.caption} line-clamp-1`}>{location || t('hotelDetails.locationUnknown', 'Location unknown')}</span>
          </div>

          {/* Guest rating + starting price */}
          <div className="flex items-end justify-between mt-0.5">
            {/* Зочдын үнэлгээ */}
            <div className="flex items-center gap-1">
              <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded leading-none">
                {rating.toFixed(1)}
              </span>
              <span className={`${text.caption} text-gray-500 dark:text-gray-400 leading-none`}>
                {ratingLabel?.replace(/\d+\s*stars?/i, '').trim() || t('hotel.rating', 'Үнэлгээ')}
              </span>
            </div>
            {/* Эхлэх үнэ */}
            {price > 0 && (
              <div className="text-right">
                <div className={`${text.caption} text-gray-400 dark:text-gray-500 leading-none mb-0.5`}>{t('hotelDetails.startingPrice', 'Эхлэх үнэ')}</div>
                <div className={`${text.bodySm} font-bold text-gray-900 dark:text-white leading-none`}>
                  ₮{formatPrice(price)}
                </div>
              </div>
            )}
          </div>

        </div>
      </Link>
    </motion.div>
  );
}