'use client';

import { useState } from 'react';
import { BedTypeIcon } from '@/utils/bedTypeIcons';
import {
  Users,
  User,
  Baby,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Wind,
  Tv,
  UtensilsCrossed,
  Cigarette,
  CigaretteOff,
  Bath,
  Scissors,
  Fan,
  Bug,
  Camera,
  Zap,
  Shield,
  CheckCircle,
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { EnrichedHotelRoom, PriceBreakdown } from '@/services/hotelRoomsApi';
import { CancellationFee } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import RoomDetailModal from './RoomDetailModal';

export interface RoomPriceOptions {
  basePrice: number;
  basePriceRaw?: number;
  halfDayPrice?: number;
  singlePersonPrice?: number;
  discount?: {
    type: 'PERCENT' | 'FIXED';
    value: number;
  };
  priceBreakdown?: PriceBreakdown;
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
  cancellationFee?: CancellationFee | null;
}

// Priority facility list shown in the LEFT column, max 4
// Order defines priority — first 4 that the room actually has get shown
const PRIORITY_FACILITIES: Array<{
  facilityId?: number;
  bathroomId?: number;
  key: string;
  labelMn: string;
  labelEn: string;
  icon: React.ReactNode;
}> = [
  { facilityId: 48, key: 'wifi',        labelMn: 'Үнэгүй Wi-Fi',           labelEn: 'Free Wi-Fi',       icon: <Wifi className="w-3.5 h-3.5" /> },
  { facilityId: 1,  key: 'ac',          labelMn: 'Агааржуулагч',            labelEn: 'Air conditioning', icon: <Wind className="w-3.5 h-3.5" /> },
  { facilityId: 4,  key: 'tv',          labelMn: 'Хавтгай дэлгэцтэй TV',   labelEn: 'Flat-screen TV',   icon: <Tv className="w-3.5 h-3.5" /> },
  { facilityId: 49, key: 'kitchen',     labelMn: 'Гал тогооны хэсэг',       labelEn: 'Kitchen',          icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { facilityId: 13, key: 'smoking',     labelMn: 'Тамхилах өрөө',           labelEn: 'Smoking room',     icon: <Cigarette className="w-3.5 h-3.5 text-orange-400" /> },
  { facilityId: 16, key: 'non_smoking', labelMn: 'Тамхи татдаггүй өрөө',   labelEn: 'Non-smoking',      icon: <CigaretteOff className="w-3.5 h-3.5 text-green-500" /> },
  { key: 'bathroom',                    labelMn: 'Угаалгын өрөө',           labelEn: 'Bathroom',         icon: <Bath className="w-3.5 h-3.5 text-blue-400" /> },
  { bathroomId: 4,  key: 'hairdryer',   labelMn: 'Үсний сэнс',              labelEn: 'Hairdryer',        icon: <Scissors className="w-3.5 h-3.5" /> },
  { facilityId: 35, key: 'fan',         labelMn: 'Сэнс',                    labelEn: 'Fan',              icon: <Fan className="w-3.5 h-3.5" /> },
  { facilityId: 40, key: 'mosquito',    labelMn: 'Шумуулны тор',            labelEn: 'Mosquito net',     icon: <Bug className="w-3.5 h-3.5" /> },
];

function getPriorityFacilities(room: EnrichedHotelRoom, limit = 4) {
  const facilityIds = new Set(room.facilitiesDetails?.map((f) => f.id) ?? []);
  const bathroomIds = new Set(room.bathroomItemsDetails?.map((b) => b.id) ?? []);
  const result: Array<{ labelMn: string; labelEn: string; icon: React.ReactNode }> = [];

  for (const entry of PRIORITY_FACILITIES) {
    if (result.length >= limit) break;
    if (entry.facilityId !== undefined && facilityIds.has(entry.facilityId)) { result.push(entry); continue; }
    if (entry.bathroomId !== undefined && bathroomIds.has(entry.bathroomId)) { result.push(entry); continue; }
    if (entry.key === 'bathroom' && room.is_Bathroom) { result.push(entry); }
  }
  return result;
}

export default function TripComStyleRoomCard({
  room,
  priceOptions,
  bookingItems,
  onQuantityChange,
  nights = 1,
  cancellationFee = null,
}: TripComStyleRoomCardProps) {
  const { t, i18n } = useHydratedTranslation();
  const [imageIndex, setImageIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);

  if (!priceOptions) return null;

  // Language-aware category name (falls back to MN)
  const categoryName = i18n.language === 'en'
    ? (room.roomCategoryNameEn || room.roomCategoryName)
    : (room.roomCategoryNameMn || room.roomCategoryName);

  const selectedQty =
    bookingItems.find((i) => i.room.id === room.id && i.priceType === 'base')?.quantity ?? 0;

  const maxQty = room.number_of_rooms_to_sell;
  const isLowStock = maxQty > 0 && maxQty <= 5;

  // Discount
  const rawPrice = priceOptions.basePriceRaw ?? 0;
  const finalPrice = priceOptions.basePrice;
  const discountPct =
    priceOptions.discount?.type === 'PERCENT'
      ? Math.round(priceOptions.discount.value)
      : rawPrice > 0 && finalPrice < rawPrice
      ? Math.round(((rawPrice - finalPrice) / rawPrice) * 100)
      : 0;
  const hasDiscount = discountPct > 0;

  // Images
  const images = room.images ?? [];
  const hasImages = images.length > 0;
  const goNext = () => setImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  const goPrev = () => setImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  // Facilities for left column (max 4)
  const shownFacilities = getPriorityFacilities(room, 4);
  const totalFacilityCount =
    (room.facilitiesDetails?.length ?? 0) +
    (room.bathroomItemsDetails?.length ?? 0) +
    (room.freeToiletriesDetails?.length ?? 0) +
    (room.foodAndDrinkDetails?.length ?? 0) +
    (room.outdoorAndViewDetails?.length ?? 0);
  const hasMoreToShow = totalFacilityCount > shownFacilities.length;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {room.roomTypeName}
            {categoryName && categoryName !== 'Unknown' && (
              <span className="ml-1 font-normal text-sm text-gray-500 dark:text-gray-400">
                / {categoryName}
              </span>
            )}
          </h3>
          {isLowStock && (
            <span className="text-red-500 text-sm font-semibold whitespace-nowrap ml-3">
              *{t('roomCard.lastRooms', 'Сүүлийн')} {maxQty} {t('roomCard.rooms', 'өрөө')}
            </span>
          )}
        </div>

        {/* ── Body: Left | Middle | Right ── */}
        <div className="flex">

          {/* ── LEFT: image + thumbnails + bed + amenities ── */}
          <div className="w-52 shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-700">

            {/* Main image */}
            <div
              className="relative bg-gray-100 dark:bg-gray-700 cursor-pointer group overflow-hidden"
              style={{ height: '148px' }}
              onClick={() => setDetailOpen(true)}
            >
              {hasImages ? (
                <>
                  <SafeImage
                    src={images[imageIndex].image}
                    alt={room.roomTypeName}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Өмнөх"
                      >
                        <ChevronLeft className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Дараах"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                      </button>
                      <div className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-black/60 text-white text-xs px-1 py-0.5 rounded">
                        <Camera className="w-2.5 h-2.5" />
                        <span>{images.length}</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-1 text-gray-300 dark:text-gray-600">
                  <BedTypeIcon
                    name={room.bed_details?.[0]?.name || ''}
                    className="w-10 h-10"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-1 px-2 py-1.5 border-b border-gray-100 dark:border-gray-700">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`relative w-10 h-7 rounded overflow-hidden shrink-0 border-2 transition-all ${
                      i === imageIndex
                        ? 'border-primary'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <SafeImage src={img.image} alt="" fill className="object-cover" />
                  </button>
                ))}
                {images.length > 4 && (
                  <button
                    onClick={() => setDetailOpen(true)}
                    className="w-10 h-7 rounded shrink-0 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"
                  >
                    +{images.length - 4}
                  </button>
                )}
              </div>
            )}

            {/* Bed type + capacity + size */}
            <div className="px-3 pt-2 pb-1 space-y-1">
              {Array.isArray(room.bed_details) && room.bed_details.slice(0, 2).map((bed, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <BedTypeIcon name={bed.name || ''} className="w-5 h-5 shrink-0 text-gray-500" />
                  <span className="truncate font-medium">
                    {bed.quantity > 1 ? `${bed.quantity}× ` : ''}
                    {bed.name || t('roomCard.standardBed', 'Стандарт ор')}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-0.5">
                  <Users className="w-3 h-3" />
                  <span>{room.adultQty + room.childQty}</span>
                </div>
                {room.room_size && Number(room.room_size) > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Maximize2 className="w-3 h-3" />
                    <span>{Number(room.room_size)}m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Priority amenities (max 4) */}
            {shownFacilities.length > 0 && (
              <div className="px-3 pb-1 space-y-1 border-t border-gray-50 dark:border-gray-700 pt-1.5">
                {shownFacilities.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="shrink-0 text-gray-400 dark:text-gray-500">{f.icon}</span>
                    <span>{f.labelMn}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Дэлгэрэнгүй link */}
            <div className="px-3 pb-3">
              <button
                onClick={() => setDetailOpen(true)}
                className="text-xs text-primary hover:underline"
              >
                {t('roomCard.moreDetails', 'Дэлгэрэнгүй')} →
              </button>
            </div>
          </div>

          {/* ── MIDDLE: Your Choices ── */}
          <div className="flex-1 min-w-0 p-4 flex flex-col gap-3 border-r border-gray-100 dark:border-gray-700">

            {/* Guest capacity icons */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: room.adultQty }).map((_, i) => (
                <User key={`a${i}`} className="w-4 h-4 text-gray-600 dark:text-gray-300" strokeWidth={2} />
              ))}
              {room.childQty > 0 && Array.from({ length: room.childQty }).map((_, i) => (
                <Baby key={`c${i}`} className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              ))}
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                ×{room.adultQty + room.childQty}
              </span>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* Booking conditions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <Zap className="w-4 h-4 shrink-0" />
                <span>Шууд баталгаажилт</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <Shield className="w-4 h-4 shrink-0" />
                <span>100% урьдчилгаа төлөлт</span>
              </div>
              {/* Cancellation policy — using Hotel_front naming */}
              {cancellationFee ? (() => {
                // Format "HH:MM:SS" → "HH:MM"
                const time = cancellationFee.cancel_time?.slice(0, 5) ?? '';
                const beforePct = parseFloat(cancellationFee.single_before_time_percentage ?? '0');
                const afterPct = parseFloat(cancellationFee.single_after_time_percentage ?? '100');
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{t('roomCard.cancellationPolicy', 'Цуцлалтын бодлого')}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-5.5">
                      {`${t('roomCard.beforeCancelLabelPrefix', 'Өмнөх өдрийн')} ${time} ${t('roomCard.beforeCancelLabelSuffix', 'цагаас өмнө')}`}
                      {': '}<span className={beforePct === 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-orange-500 font-medium'}>{beforePct === 0 ? t('roomCard.freeCancelShort', 'үнэгүй') : `${beforePct}%`}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-5.5">
                      {`${t('roomCard.beforeCancelLabelPrefix', 'Өмнөх өдрийн')} ${time} ${t('roomCard.afterCancelLabelSuffix', 'цагаас хойш')}`}
                      {': '}<span className="text-orange-500 font-medium">{afterPct}%</span>
                    </p>
                  </div>
                );
              })() : (
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{t('roomCard.cancellationPolicy', 'Цуцлалтын бодлого')}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Price + Selector ── */}
          <div className="w-48 shrink-0 p-4 flex flex-col justify-between">

            {/* Price block — at top */}
            <div className="space-y-1">
              {hasDiscount && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    ₮{rawPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    {discountPct}% OFF
                  </span>
                </div>
              )}
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                ₮{finalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {nights > 1
                  ? `₮${(finalPrice * nights).toLocaleString()} · ${nights} ${t('roomCard.nights', 'шөнө')}`
                  : t('roomCard.perNight', 'шөнийн үнэ')}
              </div>
              {isLowStock && (
                <p className="text-orange-500 text-xs font-semibold">
                  {t('roomCard.onlyLeft', { count: maxQty, defaultValue: 'Зөвхөн {{count}} үлдлээ!' })}
                </p>
              )}
            </div>

            {/* Room selector — at bottom */}
            <div className="mt-4">
              <select
                value={selectedQty}
                onChange={(e) => onQuantityChange('base', Number(e.target.value))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value={0}>{t('roomCard.selectRooms', 'Өрөө сонгох')}</option>
                {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {t('roomCard.rooms', 'өрөө')} (₮{(finalPrice * n).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      <RoomDetailModal
        room={room}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
