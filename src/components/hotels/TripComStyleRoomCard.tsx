'use client';

import { useState } from 'react';
import { BedDouble, BedSingle, User, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaChild } from 'react-icons/fa';
import SafeImage from '@/components/common/SafeImage';
import RoomImageModal from './RoomImageModal';
import { EnrichedHotelRoom, PriceBreakdown } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export interface RoomPriceOptions {
  basePrice: number; // Final customer-facing price (final_customer_price)
  basePriceRaw?: number; // Original price before discount (base_price from API)
  halfDayPrice?: number;
  singlePersonPrice?: number;
  discount?: {
    type: 'PERCENT' | 'FIXED';
    value: number;
  };
  priceBreakdown?: PriceBreakdown; // Full price breakdown from API
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getRoomQuantity = (priceType: 'base' | 'halfDay' | 'singlePerson'): number => {
    const item = bookingItems.find(item => item.room.id === room.id && item.priceType === priceType);
    return item?.quantity || 0;
  };

  const remainingQuantity = room.number_of_rooms_to_sell -
    bookingItems
      .filter(item => item.room.id === room.id)
      .reduce((sum, item) => sum + item.quantity, 0);

  // Image navigation functions
  const nextImage = () => {
    if (room.images && room.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === room.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (room.images && room.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? room.images.length - 1 : prev - 1
      );
    }
  };

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
      <BedDouble className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    ) : (
      <BedSingle className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
    );
  };

  // Render person icons
  const renderPersonIcons = () => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: room.adultQty }).map((_, i) => (
          <User key={`adult-${i}`} className="w-4 h-4 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
        ))}
        {room.childQty > 0 && Array.from({ length: room.childQty }).map((_, i) => (
          <FaChild key={`child-${i}`} className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        ))}
      </div>
    );
  };

  if (!priceOptions) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-3">
        {/* Room Title with Discount Badge - Compact */}
        <div className="mb-2">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {room.roomTypeName}
              {room.roomCategoryName && (
                <span className="ml-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                  - {room.roomCategoryName}
                </span>
              )}
            </h3>
            {hasDiscount && (
              <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {/* Left: Images - Smaller */}
          <div className="w-40 flex-shrink-0">
            <div className="relative w-full h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              {room.images && room.images.length > 0 ? (
                <>
                  <SafeImage
                    src={room.images[selectedImageIndex]?.image || room.images[0].image}
                    alt={room.roomTypeName}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  
                  {/* Navigation buttons - show only if multiple images */}
                  {room.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                      </button>
                    </>
                  )}
                  
                  {/* Image count badge */}
                  {room.images.length > 1 && (
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded flex items-center gap-0.5">
                      <span>📷</span>
                      <span>{selectedImageIndex + 1}/{room.images.length}</span>
                    </div>
                  )}

                  {/* Click to view overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-2 py-1 rounded text-xs font-medium">
                      {t('roomCard.viewFully', 'Бүтнээр харах')}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BedDouble className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Compact bed and occupancy info */}
            <div className="mt-1 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                {getBedIcon()}
                <span className="text-xs">1 {room.bedTypeName?.split(' ')[0] || 'bed'}</span>
              </div>
              <div className="flex items-center gap-0.5">
                {renderPersonIcons()}
              </div>
            </div>
          </div>

          {/* Middle: Room Details - Compact */}
          <div className="flex-1 space-y-1.5">
            {/* Bed Type Info - Compact */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{room.adultQty + room.childQty} guests</span>
              {room.room_size && (
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({room.room_size}m²)</span>
              )}
            </div>

            {/* Amenities - Compact, horizontal layout */}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {room.facilitiesDetails && room.facilitiesDetails.slice(0, 3).map((facility, idx) => (
                <div key={idx} className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>{facility.name_mn || facility.name_en}</span>
                </div>
              ))}
            </div>

            {/* Availability Warning - Compact */}
            {remainingQuantity > 0 && remainingQuantity <= 5 && (
              <div className="text-xs font-medium text-orange-600">
                {t('roomCard.onlyRoomsLeft', { count: remainingQuantity }, `Only ${remainingQuantity} left!`)}
              </div>
            )}
          </div>

          {/* Right: Pricing - More Compact */}
          <div className="w-44 flex flex-col justify-between flex-shrink-0">
            <div>
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="flex justify-end items-center gap-1 mb-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ₮{(priceOptions.basePriceRaw || priceOptions.basePrice).toLocaleString()}
                  </div>
                  <div className="bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                    -{discountPercent}%
                  </div>
                </div>
              )}

              {/* Current Price Per Night - Compact */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ₮{priceOptions.basePrice.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {nights > 1 
                    ? `Total price: ₮${(priceOptions.basePrice * nights).toLocaleString()} • ${nights} nights incl. taxes & fees`
                    : '3 rooms • 6 nights incl. taxes & fees'
                  }
                </div>
              </div>
            </div>

            {/* Room Selector Dropdown - Compact */}
            <div className="mt-2">
              <select
                value={getRoomQuantity('base')}
                onChange={(e) => onQuantityChange('base', parseInt(e.target.value))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                <option value={0}>Select rooms</option>
                {Array.from({ length: Math.min(remainingQuantity, 5) }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'room' : 'rooms'} • ₮{(priceOptions.basePrice * num).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Room Image Modal */}
      <RoomImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={room.images || []}
        initialIndex={selectedImageIndex}
        roomName={room.roomTypeName}
      />
    </div>
  );
}
