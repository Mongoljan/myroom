'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { text } from '@/styles/design-system';

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
  className = ""
}: SectionHotelCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    ];
    return fallbackImages[parseInt(id) % fallbackImages.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`min-w-[280px] flex-shrink-0 ${className}`}
    >
      <Link
        href={`/hotel/${id}`}
        className="group bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:shadow-lg block"
      >
        {/* Hotel Image */}
        <div className="relative h-36 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={`${name} - Hotel image`}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
              onError={(e) => {
                const target = e.currentTarget;
                target.src = getFallbackImage();
              }}
            />
          ) : (
            <Image
              src={getFallbackImage()}
              alt={`${name} - Hotel image`}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
          )}

          {/* Badge - Top Left */}
          {badge && (
            <div className="absolute top-2 left-2">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md text-white ${getBadgeColor(badgeColor)}`}>
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="p-4">
          <h3 className={`${text.h4} text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors`}>
            {name}
          </h3>

          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className={`${text.caption} line-clamp-1`}>{location || 'Байршил тодорхойгүй'}</span>
          </div>

          {/* Rating and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium mr-1">
                {rating}
              </div>
              <span className={`${text.caption} text-gray-500`}>
                {ratingLabel?.replace(/\d+\s*stars?/i, '').trim() || 'үнэлгээ'}
              </span>
            </div>
            <div className="text-right">
              <div className={`${text.caption} text-gray-500`}>эхлэх үнэ</div>
              <div className={`${text.bodySm} font-bold text-gray-900`}>
                ₮{formatPrice(price)}-с
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}