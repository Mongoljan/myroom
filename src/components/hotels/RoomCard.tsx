'use client';

import { motion } from 'framer-motion';
import { Bed, User, Clock, Home, Bath, Coffee, Baby } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export interface RoomPriceOptions {
  basePrice: number;
  halfDayPrice?: number;
  singlePersonPrice?: number;
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
}

export default function RoomCard({
  room,
  priceOptions,
  bookingItems,
  onQuantityChange
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
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex gap-4 p-4">
        {/* Left: Room Image */}
        <div className="w-64 h-48 relative rounded-lg overflow-hidden flex-shrink-0">
          {room.images && room.images.length > 0 ? (
            <SafeImage
              src={room.images[0].image}
              alt={room.roomTypeName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Bed className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Middle: Room Details */}
        <div className="flex-1 space-y-3">
          {/* Room Header */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {room.roomTypeName}
            </h3>
            <p className="text-sm font-medium text-blue-600 mb-1">
              {room.roomCategoryName}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {room.room_Description}
            </p>
          </div>

          {/* Room Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{t('roomCard.squareMeters', { count: Number(room.room_size) || 0 })}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Show individual icons for each person */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: room.adultQty }, (_, i) => (
                  <User key={`adult-${i}`} className="w-4 h-4" />
                ))}
                {Array.from({ length: room.childQty }, (_, i) => (
                  <Baby key={`child-${i}`} className="w-3 h-3" />
                ))}
              </div>
              <span>
                {room.adultQty} {room.adultQty > 1 ? t('roomCard.adults') : t('roomCard.adult')}
                {room.childQty > 0 && `, ${room.childQty} ${room.childQty > 1 ? t('roomCard.children') : t('roomCard.child')}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {getBedIcon()}
              <span>{room.bedTypeName || t('roomCard.standardBed')}</span>
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-2">
            {/* Room Facilities */}
            {Array.isArray(room.facilitiesDetails) && room.facilitiesDetails.length > 0 && (
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{t('roomCard.facilities')}:</span>{' '}
                  {room.facilitiesDetails.slice(0, 4).map(f => f.name_mn || f.name_en).join(', ')}
                  {room.facilitiesDetails.length > 4 && ` (+${room.facilitiesDetails.length - 4} more)`}
                </div>
              </div>
            )}

            {/* Bathroom */}
            {Array.isArray(room.bathroomItemsDetails) && room.bathroomItemsDetails.length > 0 && (
              <div className="flex items-start gap-2">
                <Bath className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{t('roomCard.bathroom')}:</span>{' '}
                  {room.bathroomItemsDetails.slice(0, 3).map(b => b.name_mn || b.name_en).join(', ')}
                  {room.bathroomItemsDetails.length > 3 && ` (+${room.bathroomItemsDetails.length - 3} ...)`}
                </div>
              </div>
            )}

            {/* Food & Drink */}
            {Array.isArray(room.foodAndDrinkDetails) && room.foodAndDrinkDetails.length > 0 && (
              <div className="flex items-start gap-2">
                <Coffee className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{t('roomCard.foodAndDrink')}:</span>{' '}
                  {room.foodAndDrinkDetails.slice(0, 3).map(f => f.name_mn || f.name_en).join(', ')}
                  {room.foodAndDrinkDetails.length > 3 && ` (+${room.foodAndDrinkDetails.length - 3} ...)`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pricing Options */}
        <div className="w-80 flex-shrink-0">
          <div className="space-y-1">
            {/* Standard Rate */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{t('roomCard.fullDay')}</div>
                  <div className="text-xs text-gray-600">₮{priceOptions!.basePrice.toLocaleString()}</div>
                </div>
              </div>
              <select
                value={getRoomQuantity('base')}
                onChange={(e) => onQuantityChange('base', parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('base') + 1, 6) }, (_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '0' : `${i}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Half Day Rate */}
            {(priceOptions?.halfDayPrice && priceOptions.halfDayPrice > 0) && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t('roomCard.halfDay')}</div>
                    <div className="text-xs text-gray-600">₮{priceOptions.halfDayPrice.toLocaleString()}</div>
                  </div>
                </div>
                <select
                  value={getRoomQuantity('halfDay')}
                  onChange={(e) => onQuantityChange('halfDay', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('halfDay') + 1, 6) }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? '0' : `${i}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Single Person Rate */}
            {(priceOptions?.singlePersonPrice && priceOptions.singlePersonPrice > 0) && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t('roomCard.singleGuest')}</div>
                    <div className="text-xs text-gray-600">₮{priceOptions.singlePersonPrice.toLocaleString()}</div>
                  </div>
                </div>
                <select
                  value={getRoomQuantity('singlePerson')}
                  onChange={(e) => onQuantityChange('singlePerson', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('singlePerson') + 1, 6) }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? '0' : `${i}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Availability Notice */}
          {remainingQuantity <= 3 && remainingQuantity > 0 && (
            <div className="mt-3 p-2 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-700 text-center">
                {t('roomCard.onlyLeft', { count: remainingQuantity })}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}