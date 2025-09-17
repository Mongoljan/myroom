'use client';

import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HotelLocation, RatingStars } from '@/types/api';

interface HotelInfoProps {
  name: string;
  location: HotelLocation;
  rating: RatingStars;
  roomsAvailable: number;
  viewMode: 'list' | 'grid';
  className?: string;
}

export default function HotelInfo({
  name,
  location,
  rating,
  roomsAvailable,
  viewMode,
  className = ""
}: HotelInfoProps) {
  const getRatingStars = () => {
    const stars = parseInt(rating.value.match(/\d+/)?.[0] || '0');
    return stars;
  };

  const renderStars = () => {
    const starCount = getRatingStars();
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < starCount
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-slate-300 fill-slate-300'
        }`}
      />
    ));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hotel Name */}
      <div>
        <motion.h3
          whileHover={{ scale: 1.01 }}
          className={`font-bold text-slate-900 leading-tight line-clamp-2 ${
            viewMode === 'list' ? 'text-xl mb-2' : 'text-lg mb-2'
          }`}
        >
          {name}
        </motion.h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {renderStars()}
          </div>
          <span className="text-sm text-slate-600 font-medium">
            {rating.label}
          </span>
          {viewMode === 'list' && (
            <span className="text-xs text-slate-500">
              ({getRatingStars()}/5)
            </span>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-slate-600 leading-relaxed">
          <div className="font-medium">{location.province_city}</div>
          {location.soum && (
            <div className="text-slate-500">{location.soum}</div>
          )}
          {location.district && (
            <div className="text-slate-500">{location.district}</div>
          )}
        </div>
      </div>

      {/* Availability Badge */}
      {roomsAvailable > 0 && (
        <div className="flex items-center gap-2">
          <Badge
            variant={roomsAvailable > 5 ? "default" : "secondary"}
            className={`text-xs px-2 py-1 ${
              roomsAvailable > 5
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-orange-100 text-orange-800 border-orange-200'
            }`}
          >
            {roomsAvailable > 5
              ? `${roomsAvailable}+ өрөө боломжтой`
              : `${roomsAvailable} өрөө үлдсэн`
            }
          </Badge>
        </div>
      )}

      {/* Quick Info for List View */}
      {viewMode === 'list' && (
        <div className="pt-2 border-t border-slate-100">
          <div className="text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Дээд зэрэглэлийн зочид буудал</span>
              <span className="text-xs text-slate-500">
                Үнэлгээ: {getRatingStars()}.0/5.0
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid View Compact Info */}
      {viewMode === 'grid' && (
        <div className="text-xs text-slate-500 line-clamp-2">
          Олон төрлийн тохижилт бүхий зочид буудал.
          Шилдэг үйлчилгээ, тансаг орчин.
        </div>
      )}
    </div>
  );
}