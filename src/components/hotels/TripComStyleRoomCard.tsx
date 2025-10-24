'use client';

import { useState } from 'react';
import { BedDouble, BedSingle, User, Wifi, CheckCircle, X, Coffee } from 'lucide-react';
import { FaChild } from 'react-icons/fa';
import SafeImage from '@/components/common/SafeImage';
import { EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export interface RoomPriceOptions {
  basePrice: number;
  basePriceRaw?: number; // Original price before discount
  halfDayPrice?: number;
  singlePersonPrice?: number;
  discount?: {
    type: 'PERCENT' | 'FIXED';
    value: number;
  };
}

export interface BookingItem {
  room: EnrichedHotelRoom;
  priceType: 'base' | 'halfDay' | 'singlePerson';
  quantity: number;
  price: number;
  maxQuantity: number;
}

interface TripComStyleRoomCardProps {
  room: EnrichedHotelRoom;
  priceOptions?: RoomPriceOptions;
  bookingItems: BookingItem[];
  onQuantityChange: (priceType: 'base' | 'halfDay' | 'singlePerson', quantity: number) => void;
  nights?: number;
}

export default function TripComStyleRoomCard({
  room,
  priceOptions,
  bookingItems,
  onQuantityChange,
  nights = 1
}: TripComStyleRoomCardProps) {
  const { t } = useHydratedTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getRoomQuantity = (priceType: 'base' | 'halfDay' | 'singlePerson'): number => {
    const item = bookingItems.find(item => item.room.id === room.id && item.priceType === priceType);
    return item?.quantity || 0;
  };

  const remainingQuantity = room.number_of_rooms_to_sell -
    bookingItems
      .filter(item => item.room.id === room.id)
      .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount percentage - same logic as search page
  const getDiscountPercent = () => {
    if (!priceOptions) return 0;

    const rawPrice = priceOptions.basePriceRaw || 0;
    const adjustedPrice = priceOptions.basePrice;
    let discountPercent = 0;

    // Calculate discount percentage from actual price difference
    if (rawPrice > 0 && adjustedPrice < rawPrice) {
      const actualDiscount = rawPrice - adjustedPrice;
      const calculatedPercent = (actualDiscount / rawPrice) * 100;
      discountPercent = calculatedPercent > 0 ? Math.max(1, Math.round(calculatedPercent)) : 0;
    }

    // If pricesetting exists and is PERCENT type, use the API value for accuracy
    if (priceOptions.discount?.type === 'PERCENT') {
      discountPercent = Math.max(1, Math.round(priceOptions.discount.value));
    }

    return discountPercent;
  };

  const discountPercent = getDiscountPercent();
  const hasDiscount = discountPercent > 0 || (priceOptions?.basePriceRaw && priceOptions?.basePriceRaw > priceOptions?.basePrice);

  // Get bed icon
  const getBedIcon = () => {
    const bedName = room.bedTypeName?.toLowerCase() || '';
    const isDoubleBed = bedName.includes('double') || bedName.includes('king') || bedName.includes('queen');

    return isDoubleBed ? (
      <BedDouble className="w-4 h-4 text-gray-600" />
    ) : (
      <BedSingle className="w-3.5 h-3.5 text-gray-600" />
    );
  };

  // Render person icons
  const renderPersonIcons = () => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: room.adultQty }).map((_, i) => (
          <User key={`adult-${i}`} className="w-4 h-4 text-gray-700" strokeWidth={2.5} />
        ))}
        {room.childQty > 0 && Array.from({ length: room.childQty }).map((_, i) => (
          <FaChild key={`child-${i}`} className="w-3 h-3 text-gray-500" />
        ))}
      </div>
    );
  };

  if (!priceOptions) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Room Title with Discount Badge */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {room.roomTypeName}
              {room.roomCategoryName && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  - {room.roomCategoryName}
                </span>
              )}
            </h3>
            {hasDiscount && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {t('hotel.goldTierDeal', 'Хямдарсан')}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left: Images */}
          <div className="w-56 flex-shrink-0">
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 group">
              {room.images && room.images.length > 0 ? (
                <>
                  <SafeImage
                    src={room.images[selectedImageIndex]?.image || room.images[0].image}
                    alt={room.roomTypeName}
                    fill
                    className="object-cover"
                  />
                  {/* Image count badge */}
                  {room.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <span>📷</span>
                      <span>{room.images.length}</span>
                    </div>
                  )}
                  {/* Image navigation dots */}
                  {room.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {room.images.slice(0, 5).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            selectedImageIndex === idx ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BedDouble className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Bed and occupancy info */}
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                {getBedIcon()}
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                {renderPersonIcons()}
              </div>
            </div>
          </div>

          {/* Middle: Room Details */}
          <div className="flex-1 space-y-3">
            {/* Bed Type Info */}
            <div className="text-sm text-gray-700">
              <strong>1 {room.bedTypeName || t('roomCard.bed', 'ор')}</strong>
              {room.room_size && (
                <span className="text-gray-500"> ({room.room_size}м x {room.room_size}м)</span>
              )}
            </div>

            {/* Amenities - Green checkmarks */}
            <div className="space-y-1.5">
              {room.facilitiesDetails && room.facilitiesDetails.slice(0, 4).map((facility, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{facility.name_mn || facility.name_en}</span>
                </div>
              ))}
            </div>

            {/* Availability Warning */}
            {remainingQuantity > 0 && remainingQuantity <= 5 && (
              <div className="text-sm font-medium text-orange-600">
                {t('roomCard.onlyRoomsLeft', { count: remainingQuantity }, `Сүүлийн ${remainingQuantity} өрөө үлдлээ.`)}
              </div>
            )}
          </div>

          {/* Right: Pricing */}
          <div className="w-52 flex flex-col justify-between flex-shrink-0">
            <div>
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="flex justify-end items-center gap-2 mb-1">
                  <div className="text-lg text-gray-500 line-through">
                    {(priceOptions.basePriceRaw || priceOptions.basePrice).toLocaleString()} ₮
                  </div>
                  <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    -{discountPercent}%
                  </div>
                </div>
              )}

              {/* Current Price Per Night */}
              <div className="text-2xl font-bold text-gray-900 text-right">
                {priceOptions.basePrice.toLocaleString()} ₮
              </div>
              <div className="text-xs text-gray-500 text-right mt-1">
                {t('hotel.pricePerNightShort', '1 шөнийн үнэ')}
              </div>

              {/* Per night breakdown */}
              <div className="text-sm text-gray-500 text-right mt-3">
                {nights} {nights > 1 ? t('navigation.night', 'шөнө') : t('navigation.night', 'шөнө')}
              </div>
              <div className="text-sm text-gray-500 text-right">
                {t('hotel.totalPrice', 'Нийт үнэ')}: {(priceOptions.basePrice * nights).toLocaleString()} ₮
              </div>
            </div>

            {/* Room Selector Dropdown */}
            <div className="mt-3">
              <select
                value={getRoomQuantity('base')}
                onChange={(e) => onQuantityChange('base', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={0}>0</option>
                {Array.from({ length: Math.min(remainingQuantity, 5) }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} ({(priceOptions.basePrice * num).toLocaleString()} ₮)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
