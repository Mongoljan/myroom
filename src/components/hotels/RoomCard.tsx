'use client';

import { motion } from 'framer-motion';
import { Bed, User, Clock, Home } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export interface RoomPriceOptions {
  basePrice: number;
  basePriceRaw?: number;
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

interface RoomCardProps {
  room: EnrichedHotelRoom;
  priceOptions?: RoomPriceOptions;
  bookingItems: BookingItem[];
  onQuantityChange: (priceType: 'base' | 'halfDay' | 'singlePerson', quantity: number) => void;
  nights?: number;
  showOnlyBasePrice?: boolean; // Only show full day price
}

export default function RoomCard({
  room,
  priceOptions,
  bookingItems,
  onQuantityChange,
  nights = 1,
  showOnlyBasePrice = false
}: RoomCardProps) {
  const { t } = useHydratedTranslation();
  
  const getRoomQuantity = (priceType: 'base' | 'halfDay' | 'singlePerson'): number => {
    const item = bookingItems.find(item => item.room.id === room.id && item.priceType === priceType);
    return item?.quantity || 0;
  };

  const remainingQuantity = room.number_of_rooms_to_sell -
    bookingItems
      .filter(item => item.room.id === room.id)
      .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount information
  const hasDiscount = priceOptions?.discount?.type && priceOptions.basePriceRaw && priceOptions.basePriceRaw > priceOptions.basePrice;
  const discountPercentage = hasDiscount && priceOptions.basePriceRaw 
    ? Math.round(((priceOptions.basePriceRaw - priceOptions.basePrice) / priceOptions.basePriceRaw) * 100)
    : 0;

  // Get bed icon based on bed type or name
  const getBedIcon = () => {
    const bedName = room.bedTypeName?.toLowerCase() || '';
    const bedType = room.bed_type;

    // Map common bed types to icons - you can extend this based on your bed types
    if (bedName.includes('double') || bedName.includes('queen') || bedName.includes('king') || bedType === 18) {
      return <Bed className="w-4 h-4" />; // Double/larger beds
    } else if (bedName.includes('single') || bedType === 12) {
      return <Bed className="w-4 h-4" />; // Single beds - using same icon for now
    } else {
      return <Bed className="w-4 h-4" />; // Default bed icon
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="flex flex-col lg:flex-row gap-5 p-5">
        {/* Left: Room Image */}
        <div className="w-full lg:w-72 h-56 relative rounded-lg overflow-hidden flex-shrink-0">
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-md">
              -{discountPercentage}%
            </div>
          )}
          {room.images && room.images.length > 0 ? (
            <SafeImage
              src={room.images[0].image}
              alt={room.roomTypeName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Bed className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>

        {/* Middle: Room Details */}
        <div className="flex-1 space-y-4">
          {/* Room Header */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {room.roomTypeName}
            </h3>
            <p className="text-sm font-medium text-blue-600 mb-2">
              {room.roomCategoryName}
            </p>
          </div>

          {/* Room Info Tags */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
              <Home className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{Number(room.room_size) || 0} м²</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {room.adultQty} {t('roomCard.adults', 'насанд хүрэгчид')}
                {room.childQty > 0 && `, ${room.childQty} ${t('roomCard.children', 'хүүхэд')}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
              {getBedIcon()}
              <span className="text-sm text-gray-700">{room.bedTypeName || t('roomCard.standardBed', 'Стандарт ор')}</span>
            </div>
          </div>

          {/* Facilities - Show top items only */}
          {Array.isArray(room.facilitiesDetails) && room.facilitiesDetails.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {room.facilitiesDetails.slice(0, 5).map((facility, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {facility.name_mn || facility.name_en}
                </span>
              ))}
              {room.facilitiesDetails.length > 5 && (
                <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  +{room.facilitiesDetails.length - 5} {t('roomCard.more', 'өөр')}
                </span>
              )}
            </div>
          )}

          {/* Room Description */}
          {room.room_Description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {room.room_Description}
            </p>
          )}
        </div>

        {/* Right: Pricing Options */}
        <div className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 pt-5 lg:pt-0 lg:pl-5">
          <div className="space-y-3">
            {/* Price Display with Discount */}
            <div className="mb-4">
              {hasDiscount && priceOptions?.basePriceRaw ? (
                <div>
                  <div className="text-sm text-gray-500 line-through">₮{priceOptions.basePriceRaw.toLocaleString()}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">₮{priceOptions.basePrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">/ {t('roomCard.night', 'шөнө')}</span>
                  </div>
                </div>
              ) : priceOptions ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">₮{priceOptions.basePrice.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">/ {t('roomCard.night', 'шөнө')}</span>
                </div>
              ) : null}
            </div>

            {/* Room Selection */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{t('roomCard.numberOfRooms', 'Өрөөний тоо')}</span>
                <select
                  value={getRoomQuantity('base')}
                  onChange={(e) => onQuantityChange('base', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[80px]"
                >
                  {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('base') + 1, 6) }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? t('roomCard.select', '0') : `${i} ${i > 1 ? t('roomCard.rooms', 'өрөө') : t('roomCard.room', 'өрөө')}`}
                    </option>
                  ))}
                </select>
              </div>

              {getRoomQuantity('base') > 0 && (
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{getRoomQuantity('base')} өрөө × {nights} шөнө</span>
                    <span>₮{(priceOptions!.basePrice * getRoomQuantity('base') * nights).toLocaleString()}</span>
                  </div>
                  {hasDiscount && priceOptions?.basePriceRaw && (
                    <div className="text-xs text-green-600 font-medium">
                      {t('roomCard.youSave', 'Та хэмнэлт')}: ₮{((priceOptions.basePriceRaw - priceOptions.basePrice) * getRoomQuantity('base') * nights).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Price Options */}
            {!showOnlyBasePrice && priceOptions && (
              <>
                {priceOptions.halfDayPrice && priceOptions.halfDayPrice > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{t('roomCard.halfDayPrice', 'Хагас өдөр')}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₮{priceOptions.halfDayPrice.toLocaleString()}</span>
                    </div>
                    <select
                      value={getRoomQuantity('halfDay')}
                      onChange={(e) => onQuantityChange('halfDay', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('halfDay') + 1, 6) }, (_, i) => (
                        <option key={i} value={i}>{i === 0 ? t('roomCard.select', '0') : `${i}`}</option>
                      ))}
                    </select>
                  </div>
                )}

                {priceOptions.singlePersonPrice && priceOptions.singlePersonPrice > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">{t('roomCard.singleGuest', '1 хүний үнэ')}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₮{priceOptions.singlePersonPrice.toLocaleString()}</span>
                    </div>
                    <select
                      value={getRoomQuantity('singlePerson')}
                      onChange={(e) => onQuantityChange('singlePerson', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('singlePerson') + 1, 6) }, (_, i) => (
                        <option key={i} value={i}>{i === 0 ? t('roomCard.select', '0') : `${i}`}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Availability Notice */}
            {remainingQuantity <= 3 && remainingQuantity > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700 font-medium text-center">
                  {t('roomCard.onlyLeft', `Зөвхөн ${remainingQuantity} өрөө үлдсэн`)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}