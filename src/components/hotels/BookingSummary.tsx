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
  onQuantityChange: (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson', quantity: number) => void;
  onRemoveRoom: (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson') => void;
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

  const priceTypeLabels = {
    base: t('hotelRooms.standardRate', 'Үндсэн үнэ'),
    halfDay: t('hotelRooms.halfDayRate', 'Хагас хоногийн үнэ'),
    singlePerson: t('hotelRooms.singleGuestRate', '1 хүний үнэ')
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
      {/* Date Range Display */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="text-xs text-gray-600 mb-2">Stay Dates</div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium text-gray-900">{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div className="text-xs text-gray-600">Check-in</div>
          </div>
          <div className="flex-1 border-t border-gray-300 mx-3 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-600">
              {nights} night{nights !== 1 ? 's' : ''}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div className="text-xs text-gray-600">Check-out</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4 pb-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Total Price</div>
        <div className="text-2xl font-bold text-gray-900">₮{totalPriceWithNights.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">
          ₮{totalPrice.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
        </div>
      </div>

      <button
        onClick={onBookNow}
        disabled={items.length === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Book Now ({totalRooms} room{totalRooms !== 1 ? 's' : ''})
      </button>

      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-900 mb-3">Selected Rooms</h3>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No rooms selected</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.room.id}-${item.priceType}`} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {item.room.roomTypeName}
                    </h4>
                    <div className="text-xs text-blue-600 mb-1">
                      {priceTypeLabels[item.priceType]}
                    </div>
                    <div className="text-xs text-gray-600">
                      ₮{item.price.toLocaleString()} × {item.quantity} = ₮{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveRoom(item.room.id, item.priceType)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors text-red-600"
                    title={t('common.delete', 'Устгах')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQuantityChange(item.room.id, item.priceType, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onQuantityChange(item.room.id, item.priceType, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={item.quantity >= item.maxQuantity ? `Maximum ${item.maxQuantity} rooms available` : 'Increase quantity'}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">Total Rooms:</span>
            <span className="font-bold">{totalRooms}</span>
          </div>
        </div>
      </div>
    </div>
  );
}