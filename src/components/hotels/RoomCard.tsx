'use client';

import { motion } from 'framer-motion';
import { Bed, User, Clock, Wifi, Car, Utensils, Coffee, Cigarette, Check, Home, Image as ImageIcon } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { EnrichedHotelRoom, PriceBreakdown, RoomFacility } from '@/services/hotelRoomsApi';
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

  // Map a room facility to a small inline icon (best-effort, falls back to dot).
  const getFacilityIcon = (facility: RoomFacility): React.ReactNode => {
    const name = `${facility.name_en || ''} ${facility.name_mn || ''}`.toLowerCase();
    if (name.includes('wifi') || name.includes('wi-fi')) return <Wifi className="w-3.5 h-3.5" />;
    if (name.includes('parking') || name.includes('зогсоол')) return <Car className="w-3.5 h-3.5" />;
    if (name.includes('kitchen') || name.includes('гал тогоо')) return <Utensils className="w-3.5 h-3.5" />;
    if (name.includes('breakfast') || name.includes('өглөөний')) return <Coffee className="w-3.5 h-3.5" />;
    if (name.includes('smok') || name.includes('тамхи')) return <Cigarette className="w-3.5 h-3.5" />;
    return <Check className="w-3.5 h-3.5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header: title + last-rooms badge */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {room.roomTypeName}
          </h3>
          {room.number_of_rooms_to_sell > 0 && room.number_of_rooms_to_sell <= 5 && (
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              {t('roomCard.lastRooms', { count: room.number_of_rooms_to_sell, defaultValue: 'Сүүлийн {{count}} өрөө' })}
            </span>
          )}
        </div>
        {room.roomCategoryName && room.roomCategoryName !== 'Unknown' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{room.roomCategoryName}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 p-5">
        {/* Left: Image stack + small facility icon list */}
        <div className="w-full lg:w-60 flex-shrink-0 space-y-2">
          <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {hasDiscount && (
              <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow">
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
              <div className="w-full h-full flex items-center justify-center">
                <Bed className="w-12 h-12 text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </div>

          {room.images && room.images.length > 1 && (
            <div className="grid grid-cols-2 gap-2 h-16">
              {room.images.slice(1, 3).map((img, idx) => {
                const isLast = idx === 1 && room.images.length > 3;
                return (
                  <div key={idx} className="relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <SafeImage src={img.image} alt={`${room.roomTypeName} ${idx + 2}`} fill className="object-cover" />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {room.images.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tiny icon list under images — top facility icons */}
          {Array.isArray(room.facilitiesDetails) && room.facilitiesDetails.length > 0 && (
            <ul className="pt-1 space-y-1.5 text-[12px] text-gray-700 dark:text-gray-300">
              {room.facilitiesDetails.slice(0, 4).map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-gray-500">{getFacilityIcon(f)}</span>
                  <span className="truncate">{f.name_mn || f.name_en}</span>
                </li>
              ))}
              {room.facilitiesDetails.length > 4 && (
                <li className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  +{room.facilitiesDetails.length - 4} {t('roomCard.more', 'өөр')}
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Middle: Capacity + features (checkmark list) */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200 flex-wrap">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold">x{room.adultQty}</span>
              {room.childQty > 0 && (
                <span className="text-gray-500">+ {room.childQty} {t('roomCard.children', 'хүүхэд')}</span>
              )}
            </div>
            {room.room_size && Number(room.room_size) > 0 && (
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <Home className="w-4 h-4 text-gray-500" />
                <span>{Number(room.room_size)} м²</span>
              </div>
            )}
          </div>

          {/* Bed details — show each bed with name + quantity, prominent */}
          {Array.isArray(room.bed_details) && room.bed_details.length > 0 ? (
            <div className="rounded-md bg-gray-50 dark:bg-gray-700/40 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                {t('roomCard.bedType', 'Орны төрөл')}
              </div>
              <div className="flex flex-col gap-1">
                {room.bed_details.map((bed, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                    <Bed className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="font-semibold">
                      {bed.quantity > 1 ? `${bed.quantity}× ` : ''}
                      {bed.name || t('roomCard.standardBed', 'Стандарт ор')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : room.bedTypeName && room.bedTypeName !== 'Unknown' ? (
            <div className="rounded-md bg-gray-50 dark:bg-gray-700/40 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                {t('roomCard.bedType', 'Орны төрөл')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                <Bed className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="font-semibold">{room.bedTypeName}</span>
              </div>
            </div>
          ) : null}

          <ul className="space-y-1.5 text-[13px] pt-1">
            <li className="flex items-center gap-2">
              <Coffee className={`w-4 h-4 ${room.breakfast_include_price ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={room.breakfast_include_price ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}>
                {room.breakfast_include_price
                  ? t('roomCard.breakfastIncluded', 'Өглөөний цай багтсан')
                  : t('roomCard.breakfastNotIncluded', 'Өглөөний цай багтаагүй')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Cigarette className={`w-4 h-4 ${room.smoking_allowed ? 'text-amber-600' : 'text-gray-400'}`} />
              <span className="text-gray-800 dark:text-gray-200">
                {room.smoking_allowed
                  ? t('roomCard.smokingAllowed', 'Тамхи зөвшөөрнө')
                  : t('roomCard.nonSmoking', 'Тамхи татдаггүй')}
              </span>
            </li>
            {room.is_Bathroom && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">{t('roomCard.privateBathroom', 'Хувийн угаалгын өрөө')}</span>
              </li>
            )}
          </ul>

          {room.room_Description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed pt-1">
              {room.room_Description}
            </p>
          )}
        </div>

        {/* Right: Price + Quantity */}
        <div className="w-full lg:w-72 flex-shrink-0 lg:border-l border-gray-100 dark:border-gray-700 lg:pl-5 flex flex-col gap-3">
          <div>
            {hasDiscount && priceOptions?.basePriceRaw && (
              <div className="text-xs text-gray-400 line-through">₮{priceOptions.basePriceRaw.toLocaleString()}</div>
            )}
            {priceOptions ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₮{priceOptions.basePrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/ {t('roomCard.night', 'шөнө')}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('roomCard.priceUnavailable', 'Үнэ боломжгүй')}</div>
            )}
            {priceOptions && nights > 1 && (
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {t('roomCard.totalPrice', 'Нийт үнэ')}: ₮{(priceOptions.basePrice * nights).toLocaleString()}
                <div>{nights} {t('roomCard.nights', 'шөнө')} {t('roomCard.taxesIncluded', 'татвартай')}</div>
              </div>
            )}
          </div>

          <div className="mt-auto">
            <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">
              {t('roomCard.numberOfRooms', 'Өрөөний тоо')}
            </label>
            <select
              value={getRoomQuantity('base')}
              onChange={(e) => onQuantityChange('base', parseInt(e.target.value))}
              disabled={!priceOptions}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('base') + 1, 6) }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0
                    ? t('roomCard.select', 'Сонгох')
                    : `${i}${priceOptions ? ` (₮${(priceOptions.basePrice * i * nights).toLocaleString()})` : ''}`}
                </option>
              ))}
            </select>

            {remainingQuantity > 0 && remainingQuantity <= 3 && (
              <p className="text-[11px] text-orange-600 mt-1.5 font-medium">
                {t('roomCard.onlyLeft', { count: remainingQuantity, defaultValue: 'Зөвхөн {{count}} өрөө үлдсэн' })}
              </p>
            )}
          </div>

          {/* Optional: half-day & single-person rate plans, only if API exposes them */}
          {!showOnlyBasePrice && priceOptions && (priceOptions.halfDayPrice || priceOptions.singlePersonPrice) && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
              {priceOptions.halfDayPrice && priceOptions.halfDayPrice > 0 && (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Clock className="w-3.5 h-3.5" />
                    {t('roomCard.halfDayPrice', 'Хагас өдөр')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">₮{priceOptions.halfDayPrice.toLocaleString()}</span>
                    <select
                      value={getRoomQuantity('halfDay')}
                      onChange={(e) => onQuantityChange('halfDay', parseInt(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-xs bg-white dark:bg-gray-800"
                    >
                      {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('halfDay') + 1, 6) }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {priceOptions.singlePersonPrice && priceOptions.singlePersonPrice > 0 && (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <User className="w-3.5 h-3.5" />
                    {t('roomCard.singleGuest', '1 хүн')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">₮{priceOptions.singlePersonPrice.toLocaleString()}</span>
                    <select
                      value={getRoomQuantity('singlePerson')}
                      onChange={(e) => onQuantityChange('singlePerson', parseInt(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-xs bg-white dark:bg-gray-800"
                    >
                      {Array.from({ length: Math.min(remainingQuantity + getRoomQuantity('singlePerson') + 1, 6) }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}