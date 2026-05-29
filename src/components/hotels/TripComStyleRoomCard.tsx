'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BedTypeIcon } from '@/utils/bedTypeIcons';
import {
  User,
  Users,
  Baby,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Coffee,
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
  breakfastPrice?: number; // Per-night selling price with breakfast
  breakfastPriceRaw?: number; // Original price with breakfast (before discount)
  discount?: {
    type: 'PERCENT' | 'FIXED';
    value: number;
  };
  priceBreakdown?: PriceBreakdown;
}

export interface BookingItem {
  room: EnrichedHotelRoom;
  priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast';
  quantity: number;
  price: number;
  maxQuantity: number;
}

interface TripComStyleRoomCardProps {
  room: EnrichedHotelRoom;
  priceOptions?: RoomPriceOptions;
  bookingItems: BookingItem[];
  onQuantityChange: (priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast', quantity: number) => void;
  nights?: number;
  cancellationFee?: CancellationFee | null;
  checkIn?: string; // YYYY-MM-DD
  totalSelectedRooms?: number;
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
  { key: 'bathroom',                    labelMn: 'Угаалгын өрөө',           labelEn: 'Bathroom',         icon: <Bath className="w-3.5 h-3.5 text-primary-400" /> },
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

function RoomCountSelect({
  value,
  maxQty,
  pricePerNight,
  nights,
  onChange,
  accentClass = 'focus:ring-primary/50',
}: {
  value: number;
  maxQty: number;
  pricePerNight: number;
  nights: number;
  onChange: (qty: number) => void;
  accentClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  const handleToggle = () => {
    if (!open && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen((o) => !o);
  };

  const options = [0, ...Array.from({ length: maxQty }, (_, i) => i + 1)];

  const dropdownStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 200),
        zIndex: 9999,
      }
    : { display: 'none' };

  return (
    <div className="relative w-14">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 ${accentClass} cursor-pointer`}
      >
        <span>{value}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </button>
      {open && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropRef}
          style={dropdownStyle}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden"
        >
          {options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { onChange(n); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                n === value ? 'bg-gray-100 dark:bg-gray-700 font-medium' : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {n} өрөө{n > 0 ? ` · ₮${(pricePerNight * n * nights).toLocaleString()}` : ''}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export default function TripComStyleRoomCard({
  room,
  priceOptions,
  bookingItems,
  onQuantityChange,
  nights = 1,
  cancellationFee = null,
  checkIn,
  totalSelectedRooms = 0,
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
  const breakfastQty =
    bookingItems.find((i) => i.room.id === room.id && i.priceType === 'withBreakfast')?.quantity ?? 0;

  // rooms_possible is always date-specific (dates are always passed when fetching rooms).
  // Do NOT fall back to number_of_rooms_to_sell — rooms_possible === 0 means fully booked.
  const maxQty = room.rooms_possible;
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
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700">
          <div className="" >
   
      <h3 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight pb-1 border-b border-solid border-gray-200 mb-1">  {room.roomCategoryNameEn } { room.roomTypeName}</h3>   
        
     <div className="text-[14px] leading-tight text-gray-500 dark:text-gray-400">   {i18n.language === 'mn' &&
  `${room.roomCategoryNameMn} ${room.roomTypeName}`
  
}</div>  
   </div>
     
          {isLowStock && (
            <span className="text-red-500 bg-red-100 px-2 py-1 rounded-sm text-sm font-medium whitespace-nowrap ml-3">
              *{t('roomCard.lastRooms', 'Сүүлийн')} {maxQty} {t('roomCard.rooms', 'өрөө')}
            </span>
          )}
        </div>

        {/* ── Body: Left | Middle | Right ── */}
        <div className="flex flex-col sm:flex-row items-stretch">

          {/* ── LEFT: image + thumbnails + bed + amenities ── */}
          <div className="w-full sm:w-1/3 sm:shrink-0 flex flex-col border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700">

            {/* Main image */}
            <div
              className="relative bg-gray-100 dark:bg-gray-700 cursor-pointer group overflow-hidden"
              style={{ height: '160px' }}
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



            {/* Bed type + capacity + size */}
            <div className="px-3 pt-2 pb-1 space-y-1">
              {Array.isArray(room.bed_details) && room.bed_details.slice(0, 2).map((bed, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <BedTypeIcon name={bed.name || ''} className="w-5 h-5 shrink-0 text-gray-500" />
                  <span className="truncate font-medium">
                    {bed.quantity > 1 ? `${bed.quantity}× ` : ''}
                    {bed.name || t('roomCard.standardBed', 'Стандарт ор')}
                  </span>
                  {bed.bed_size?.size && (
                    <span className="text-gray-400 dark:text-gray-500 shrink-0">({bed.bed_size.size})</span>
                  )}
                </div>
              ))}

            </div>

            {/* Priority amenities — always 4 slots so height is consistent */}
            <div className="px-3 pb-1 space-y-1 border-t border-gray-50 dark:border-gray-700 pt-1.5">
              {Array.from({ length: 4 }).map((_, i) => {
                const f = shownFacilities[i];
                return (
                  <div key={i} className={`flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 ${!f ? 'invisible' : ''}`}>
                    <span className="shrink-0 text-gray-400 dark:text-gray-500">{f?.icon}</span>
                    <span>{f?.labelMn}</span>
                  </div>
                );
              })}
            </div>

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

          {/* ── MIDDLE + RIGHT: price rows + booking conditions ── */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* ── Compute cancellation info once ── */}
            {(() => {
              const time = cancellationFee?.cancel_time?.slice(0, 5) ?? '';
              const beforePct = parseFloat(cancellationFee?.single_before_time_percentage ?? '0');
              let cancelDateStr = '';
              if (checkIn) {
                const d = new Date(checkIn);
                d.setDate(d.getDate() - 1);
                cancelDateStr = d.toISOString().slice(0, 10);
              }
              const dateLabel = cancelDateStr ? `${cancelDateStr} ${time}` : time;
              const today = new Date(); today.setHours(0, 0, 0, 0);
              const cancelDeadline = cancelDateStr ? new Date(cancelDateStr + 'T00:00:00') : null;
              const deadlinePassed = cancelDeadline ? today > cancelDeadline : false;

              // Multi-room mode: 2+ total rooms selected across all room types
              const isMultiRoom = totalSelectedRooms >= 2;
              let canCancel: boolean | null;
              let multiRoomPct: number | null = null;
              if (isMultiRoom) {
                // Multi-room rule: can cancel if today is before check-in day
                const checkInMs = checkIn ? new Date(checkIn + 'T00:00:00').getTime() : null;
                canCancel = checkInMs ? today.getTime() < checkInMs : null;

                // Find the applicable tier percentage based on days until check-in
                if (canCancel && checkIn && cancellationFee) {
                  const msPerDay = 1000 * 60 * 60 * 24;
                  const daysUntil = Math.ceil((new Date(checkIn + 'T00:00:00').getTime() - today.getTime()) / msPerDay);
                  const cf = cancellationFee;
                  if (daysUntil >= 5 && cf.multi_5days_before_percentage != null)
                    multiRoomPct = parseFloat(cf.multi_5days_before_percentage);
                  else if (daysUntil >= 3 && cf.multi_3days_before_percentage != null)
                    multiRoomPct = parseFloat(cf.multi_3days_before_percentage);
                  else if (daysUntil >= 2 && cf.multi_2days_before_percentage != null)
                    multiRoomPct = parseFloat(cf.multi_2days_before_percentage);
                  else if (daysUntil >= 1 && cf.multi_1day_before_percentage != null)
                    multiRoomPct = parseFloat(cf.multi_1day_before_percentage);
                }
              } else {
                canCancel = cancellationFee ? (beforePct < 100 && !deadlinePassed) : null;
              }

              // Conditions stacked inside each row (below breakfast label)
              const Conditions = () => (
                <div className="space-y-0.5">
                  {canCancel !== null && (
                    <div className={`flex items-center gap-1 text-sm ${canCancel ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      <CheckCircle className="w-3 h-3 shrink-0 self-start mt-0.5" />
                      {canCancel ? (
                        isMultiRoom ? (
                          <span className="flex flex-col leading-tight">
                            <span>Цуцлах боломжтой</span>
                            {multiRoomPct === 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">Үнэгүй цуцлах боломжтой</span>
                            )}
                          </span>
                        ) : (
                          <span className="flex flex-col leading-tight">
                            <span>{dateLabel}</span>
                            <span>цагаас өмнө цуцлах боломжтой</span>
                          </span>
                        )
                      ) : (
                        <span>Цуцлах боломжгүй</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="w-3 h-3 shrink-0" />
                    <span>Шууд баталгаажилт</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-3 h-3 shrink-0" />
                    <span>100% урьдчилгаа төлөлт</span>
                  </div>
                </div>
              );

              const GuestBlock = () => (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Users className="w-3 h-3 text-gray-600 dark:text-gray-400" strokeWidth={2} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">×{room.adultQty}</span>
                  {room.childQty > 0 && (
                    <>
                      <Baby className="w-3 h-3 text-gray-600 dark:text-gray-400 ml-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">×{room.childQty}</span>
                    </>
                  )}
                </div>
              );

              return (
                <div className="font-medium flex flex-col flex-1">
                  {/* ── Row 1: WITH breakfast (first, per Figma) ── */}
                  {priceOptions.breakfastPrice && priceOptions.breakfastPrice > 0 && (
                    <div className="flex  items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      {/* COL 1: conditions */}
                      <div className="flex flex-col gap-1  ">
                        <GuestBlock />
                        <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400"><Coffee className="w-3 h-3 shrink-0" />Өглөөний цай багтсан</span>
                        <Conditions />
                      </div>
                      {/* COL 2: price */}
                      <div className="flex flex-col mx-auto text-right">
                        {priceOptions.breakfastPriceRaw && priceOptions.breakfastPriceRaw > priceOptions.breakfastPrice && (
                          <div className="flex items-center justify-end gap-1 mb-0.5">
                            <span className="text-xs text-gray-400 line-through">₮{priceOptions.breakfastPriceRaw.toLocaleString()}</span>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded">
                              {Math.round((1 - priceOptions.breakfastPrice / priceOptions.breakfastPriceRaw) * 100)}% OFF
                            </span>
                          </div>
                        )}
                        <div className="text-lg font-bold text-gray-900 dark:text-white">₮{priceOptions.breakfastPrice.toLocaleString()}</div>
                        {breakfastQty > 0 && (
                          <div className="text-[12px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            Нийт ₮{(priceOptions.breakfastPrice * (breakfastQty || 1) * nights).toLocaleString()}
                          </div>
                        )}
                        <div className="text-[12px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {breakfastQty > 0 ? `${breakfastQty} өрөө x ${nights} шөнө` : '1 шөнийн үнэ'}
                        </div>
                      </div>
                      {/* COL 3: selector — far right */}
                      <div className=" flex justify-end flex-col">
                        <RoomCountSelect
                          value={breakfastQty}
                          maxQty={maxQty - selectedQty}
                          pricePerNight={priceOptions.breakfastPrice!}
                          nights={nights}
                          onChange={(qty) => onQuantityChange('withBreakfast', qty)}
                          accentClass="focus:ring-green-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Row 2: WITHOUT breakfast ── */}
                  <div className="flex items-center px-4 py-3 mb-1 justify-between">
                    {/* COL 1: conditions */}
                    <div className="flex flex-col gap-1  ">
                      <GuestBlock />
                      <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><Coffee className="w-3 h-3 shrink-0" />Өглөөний цай багтаагүй</span>
                      <Conditions />
                    </div>
                    {/* COL 2: price */}
                    <div className="flex flex-col mx-auto text-right">
                      {hasDiscount && (
                        <div className="flex items-center justify-end gap-1 mb-0.5">
                          <span className="text-xs text-gray-400 line-through">₮{rawPrice.toLocaleString()}</span>
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded">{discountPct}% OFF</span>
                        </div>
                      )}
                      <div className="text-lg font-bold text-gray-900 dark:text-white">₮{finalPrice.toLocaleString()}</div>
                      {selectedQty > 0 && (
                        <div className="text-[12px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          Нийт ₮{(finalPrice * (selectedQty || 1) * nights).toLocaleString()}
                        </div>
                      )}
                      <div className="text-[12px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {selectedQty > 0 ? `${selectedQty} өрөө x ${nights} шөнө` : '1 шөнийн үнэ'}
                      </div>
                    </div>
                    {/* COL 3: selector — far right */}
                    <div className=" flex justify-end flex-col">
                      <RoomCountSelect
                        value={selectedQty}
                        maxQty={maxQty - breakfastQty}
                        pricePerNight={finalPrice}
                        nights={nights}
                        onChange={(qty) => onQuantityChange('base', qty)}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
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
