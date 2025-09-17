'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Users } from 'lucide-react';
import Link from 'next/link';
import { CheapestRoom } from '@/types/api';

interface HotelPricingSectionProps {
  hotelId: number;
  cheapestRoom: CheapestRoom | null;
  viewMode: 'list' | 'grid';
  className?: string;
}

export default function HotelPricingSection({
  hotelId,
  cheapestRoom,
  viewMode,
  className = ""
}: HotelPricingSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
    }).format(price).replace('MNT', '₮');
  };

  if (!cheapestRoom) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-slate-500 text-sm mb-3">
          Үнийн мэдээлэл байхгүй
        </div>
        <Link href={`/hotel/${hotelId}`} className="block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:bg-slate-200"
          >
            Дэлгэрэнгүй үзэх
          </motion.div>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Room Type & Capacity */}
      <div className="mb-3">
        <div className="text-sm font-medium text-slate-900 mb-1">
          {cheapestRoom.room_type_label}
        </div>
        <div className="text-xs text-slate-600 flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>
            {cheapestRoom.capacity_per_room_adults} том хүн
            {cheapestRoom.capacity_per_room_children > 0 &&
              `, ${cheapestRoom.capacity_per_room_children} хүүхэд`
            }
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            {formatPrice(cheapestRoom.price_per_night)}
          </span>
          <span className="text-sm text-slate-600">/ шөнө</span>
        </div>

        {cheapestRoom.nights > 1 && (
          <div className="text-sm text-slate-600">
            Нийт {cheapestRoom.nights} шөнө: {' '}
            <span className="font-semibold text-slate-900">
              {formatPrice(cheapestRoom.estimated_total_for_requested_rooms)}
            </span>
          </div>
        )}

        {/* Availability */}
        <div className="text-xs text-slate-500">
          {cheapestRoom.available_in_this_type > 0 ? (
            <>
              {cheapestRoom.available_in_this_type} өрөө боломжтой
            </>
          ) : (
            <span className="text-red-600 font-medium">Дууссан</span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/hotel/${hotelId}`} className="block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700
            hover:from-blue-700 hover:to-blue-800 text-white font-semibold
            rounded-lg transition-all duration-300 flex items-center justify-center gap-2
            ${viewMode === 'list' ? 'px-6 py-3 text-sm' : 'px-4 py-2.5 text-xs'}
          `}
        >
          {/* Animated background on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          <motion.span
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {viewMode === 'list' ? 'Дэлгэрэнгүй үзэх' : 'Үзэх'}
          </motion.span>

          <motion.div
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <ExternalLink className="w-3 h-3" />
          </motion.div>
        </motion.div>
      </Link>

      {/* Savings Info */}
      {viewMode === 'list' && (
        <div className="mt-2 text-xs text-green-600">
          <span className="font-medium">Шилдэг үнэ!</span> Онлайн захиалгаар хямдрах
        </div>
      )}

      {/* Additional Room Info for List View */}
      {viewMode === 'list' && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="space-y-1">
            <div>Өрөөний ангилал: {cheapestRoom.room_category_label}</div>
            <div>Бүх татвар орсон үнэ</div>
          </div>
        </div>
      )}
    </div>
  );
}