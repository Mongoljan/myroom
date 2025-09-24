'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Users } from 'lucide-react';
import Link from 'next/link';
import { CheapestRoom } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

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
  const { t } = useHydratedTranslation();
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
          {t('hotel.priceUnavailable')}
        </div>
        <Link href={`/hotel/${hotelId}`} className="block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:bg-slate-200"
          >
            {t('hotel.viewDetails')}
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
            {cheapestRoom.capacity_per_room_adults} {t('hotel.adults')}
            {cheapestRoom.capacity_per_room_children > 0 &&
              `, ${cheapestRoom.capacity_per_room_children} ${t('hotel.children')}`
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
          <span className="text-sm text-slate-600">/ {t('hotel.night')}</span>
        </div>

        {cheapestRoom.nights > 1 && (
          <div className="text-sm text-slate-600">
            {t('hotel.totalEstimate')}: {cheapestRoom.nights} {t('hotel.nights')}: {' '}
            <span className="font-semibold text-slate-900">
              {formatPrice(cheapestRoom.estimated_total_for_requested_rooms)}
            </span>
          </div>
        )}

        {/* Availability */}
        <div className="text-xs text-slate-500">
          {cheapestRoom.available_in_this_type > 0 ? (
            <>
              {cheapestRoom.available_in_this_type} {t('hotel.roomsAvailable')}
            </>
          ) : (
            <span className="text-red-600 font-medium">{t('common.error')}</span>
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
            {viewMode === 'list' ? t('hotel.viewDetails') : t('common.viewAll')}
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
          <span className="font-medium">{t('features.instantConfirmation')}</span>
        </div>
      )}

      {/* Additional Room Info for List View */}
      {viewMode === 'list' && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="space-y-1">
            <div>{t('hotel.roomsAndRates')}: {cheapestRoom.room_category_label}</div>
            <div>{t('booking.taxes')}</div>
          </div>
        </div>
      )}
    </div>
  );
}