'use client';

import { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Users,
  Maximize2,
  Bath,
  CigaretteOff,
  Cigarette,
  Wifi,
  Wind,
  Tv,
  UtensilsCrossed,
  ShowerHead,
  Flame,
  Eye,
  Coffee,
  Shirt,
  Camera,
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface RoomDetailModalProps {
  room: EnrichedHotelRoom | null;
  isOpen: boolean;
  onClose: () => void;
}

// Facility section config — mirrors what the API returns grouped
const SECTION_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  wind: <Wind className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
  kitchen: <UtensilsCrossed className="w-4 h-4" />,
  shower: <ShowerHead className="w-4 h-4" />,
  fire: <Flame className="w-4 h-4" />,
  view: <Eye className="w-4 h-4" />,
  coffee: <Coffee className="w-4 h-4" />,
  shirt: <Shirt className="w-4 h-4" />,
};

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function SectionBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-5">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-gray-700 pb-1">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <CheckIcon />
            <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  const { t } = useHydratedTranslation();
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (isOpen) setImgIdx(0);
  }, [isOpen, room?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setImgIdx((p) => Math.max(0, p - 1));
      if (e.key === 'ArrowRight' && room?.images)
        setImgIdx((p) => Math.min(room.images.length - 1, p + 1));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, room]);

  if (!isOpen || !room) return null;

  const images = room.images ?? [];
  const hasImages = images.length > 0;

  // Basic info chips
  const chips: Array<{ label: string; icon?: React.ReactNode }> = [
    ...(room.room_size && Number(room.room_size) > 0
      ? [{ label: `${Number(room.room_size)}㎡`, icon: <Maximize2 className="w-3.5 h-3.5" /> }]
      : []),
    {
      label: `${room.adultQty + room.childQty} ${t('roomCard.guests', 'зочин')}`,
      icon: <Users className="w-3.5 h-3.5" />,
    },
    ...(room.is_Bathroom
      ? [{ label: t('roomCard.privateBathroom', 'Хувийн угаалгын өрөө'), icon: <Bath className="w-3.5 h-3.5" /> }]
      : []),
    {
      label: room.smoking_allowed
        ? t('roomCard.smokingAllowed', 'Тамхи татах боломжтой')
        : t('roomCard.nonSmoking', 'Тамхи татдаггүй'),
      icon: room.smoking_allowed ? (
        <Cigarette className="w-3.5 h-3.5 text-orange-400" />
      ) : (
        <CigaretteOff className="w-3.5 h-3.5 text-green-500" />
      ),
    },
  ];

  // Sections from API data
  const facilitiesMn = room.facilitiesDetails?.map((f) => f.name_mn || f.name_en) ?? [];
  const bathroomMn = room.bathroomItemsDetails?.map((b) => b.name_mn || b.name_en) ?? [];
  const toiletries = room.freeToiletriesDetails?.map((f) => f.name_mn || f.name_en) ?? [];
  const foodDrink = room.foodAndDrinkDetails?.map((f) => f.name_mn || f.name_en) ?? [];
  const outdoor = room.outdoorAndViewDetails?.map((o) => o.name_mn || o.name_en) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={room.roomTypeName}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {room.roomTypeName}
            {room.roomCategoryName && room.roomCategoryName !== 'Unknown' && (
              <span className="ml-1 font-normal text-gray-500 dark:text-gray-400">
                / {room.roomCategoryName}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Хаах"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Body: two columns */}
        <div className="flex flex-1 min-h-0">
          {/* ── Left: image gallery ── */}
          <div className="w-96 shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-700">
            {/* Main image */}
            <div className="relative flex-1 bg-gray-100 dark:bg-gray-800 min-h-0" style={{ minHeight: '220px', maxHeight: '340px' }}>
              {hasImages ? (
                <>
                  <SafeImage
                    src={images[imgIdx].image}
                    alt={`${room.roomTypeName} ${imgIdx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx((p) => Math.max(0, p - 1))}
                        disabled={imgIdx === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 shadow disabled:opacity-30 transition-opacity"
                        aria-label="Өмнөх"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => setImgIdx((p) => Math.min(images.length - 1, p + 1))}
                        disabled={imgIdx === images.length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 shadow disabled:opacity-30 transition-opacity"
                        aria-label="Дараах"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {imgIdx + 1}/{images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <BedDouble className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="p-3 flex gap-2 overflow-x-auto border-t border-gray-100 dark:border-gray-700 shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-14 h-10 rounded overflow-hidden shrink-0 border-2 transition-all ${
                      i === imgIdx
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <SafeImage src={img.image} alt={`thumb ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* No-image placeholder thumbnails row */}
            {!hasImages && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
                <p className="text-xs text-gray-400 text-center">{t('roomCard.noImages', 'Зураг байхгүй')}</p>
              </div>
            )}
          </div>

          {/* ── Right: room details ── */}
          <div className="flex-1 overflow-y-auto p-5 space-y-1">
            {/* Bed details */}
            {Array.isArray(room.bed_details) && room.bed_details.length > 0 && (
              <div className="flex flex-col gap-1 mb-4">
                {room.bed_details.map((bed, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <BedDouble className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="font-medium">
                      {bed.quantity > 1 ? `${bed.quantity}× ` : ''}
                      {bed.name || t('roomCard.standardBed', 'Стандарт ор')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Info chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {chips.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-full"
                >
                  {c.icon}
                  <span>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Facility sections */}
            <SectionBlock
              title={t('roomDetail.facilities', 'Өрөөний тоноглол')}
              items={facilitiesMn}
            />
            <SectionBlock
              title={t('roomDetail.bathroom', 'Угаалгын өрөө')}
              items={bathroomMn}
            />
            <SectionBlock
              title={t('roomDetail.toiletries', 'Үнэгүй ариун цэврийн хэрэгсэл')}
              items={toiletries}
            />
            <SectionBlock
              title={t('roomDetail.foodDrink', 'Хоол, ундаа')}
              items={foodDrink}
            />
            <SectionBlock
              title={t('roomDetail.outdoorView', 'Гадна болон үзэмж')}
              items={outdoor}
            />

            {/* Description */}
            {room.room_Description && room.room_Description !== 'room detailed description' && room.room_Description !== 'testing' && (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1 border-b border-gray-100 dark:border-gray-700 pb-1">
                  {t('roomDetail.description', 'Тайлбар')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {room.room_Description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
