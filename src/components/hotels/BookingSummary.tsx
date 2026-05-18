'use client';

import { X, Plus, Minus } from 'lucide-react';
import { BookingItem } from './RoomCard';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingSummaryProps {
  items: BookingItem[];
  totalRooms: number;
  totalPrice: number;
  checkIn: string;
  checkOut: string;
  nights?: number;
  onQuantityChange: (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast', quantity: number) => void;
  onRemoveRoom: (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast') => void;
  onBookNow: () => void;
}

export default function BookingSummary({
  items,
  totalRooms,
  totalPrice,
  checkIn,
  checkOut,
  nights = 1,
  onQuantityChange,
  onRemoveRoom,
  onBookNow
}: BookingSummaryProps) {
  const { t } = useHydratedTranslation();
  const totalPriceWithNights = totalPrice * nights;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-20 max-h-[calc(100vh-88px)] overflow-y-auto">
      {/* Date Range Display */}
      <div className="mb-2.5 pb-2.5 border-b border-gray-200 dark:border-gray-700">
       
        <div className="flex items-center justify-between text-sm">
          <div>
               <div className="text-sm text-gray-600 dark:text-gray-400">{t('bookingExtra.checkIn')}</div>
            <div className=" text-[16px] font-bold dark:text-white">{checkIn}</div>
          </div>
          <div className="flex-1 mx-3 relative flex items-center">
            <div className="w-full h-px bg-gray-200 dark:bg-gray-600" />
            <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-2 text-[12px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {nights} {nights !== 1 ? t('bookingExtra.nights') : t('bookingExtra.night')}
            </div>
          </div>
          <div>
  
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('bookingExtra.checkOut')}</div>
                      <div className=" text-[16px] font-bold dark:text-white">{checkOut}</div>
          </div>
        </div>
      </div>
        <div className="">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">{t('bookingExtra.selectedRooms')}</h3>

        {items.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('bookingExtra.noRoomsSelected')}</p>
        ) : (
          <div className="space-y-3 overflow-y-auto scroll-auto h-80">
            {items.map((item) => (
              <div key={`${item.room.id}-${item.priceType}`} className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700/50 space-y-2">
                {/* Row 1: Room name + remove */}
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {item.room.roomCategoryNameEn}    {item.room.roomTypeName} 
                  </h4>
                  <button
                    onClick={() => onRemoveRoom(item.room.id, item.priceType)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors text-red-500"
                    title={t('common.delete', 'Устгах')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Row 2: Breakfast status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Өглөөний цай</span>
                  {item.priceType === 'withBreakfast' ? (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Багтсан</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Багтаагүй</span>
                  )}
                </div>
                {/* Row 3: Quantity controls */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Өрөөний тоо:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onQuantityChange(item.room.id, item.priceType, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onQuantityChange(item.room.id, item.priceType, item.quantity + 1)}
                      disabled={items.filter(i => i.room.id === item.room.id).reduce((sum, i) => sum + i.quantity, 0) >= item.maxQuantity}
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {/* Row 4: Price */}
                <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Үнэ:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    ₮{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-bold">{t('bookingExtra.totalRooms')}:</span>
            <span className="font-bold">{totalRooms}</span>
          </div>
        </div>
      </div>

      <div className="text-left flex justify-between mb-4 pb-4">
        <div className="text-[16px]  mb-1 font-bold">{t('bookingExtra.totalPrice')}</div>
        <div>
        <div className="text-[16px] font-bold text-gray-900 dark:text-white text-right">₮{totalPriceWithNights.toLocaleString()}</div>
        <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 text-right">
          ₮{totalPrice.toLocaleString()} × {nights} {nights !== 1 ? t('bookingExtra.nights') : t('bookingExtra.night')}
        </div>
        </div>
      </div>

      <button
        onClick={onBookNow}
        disabled={items.length === 0}
        className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-medium hover:bg-secondary/90 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('hotel.bookNow')}
      </button>

    
    </div>
  );
}