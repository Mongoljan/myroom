'use client';

import { useState } from 'react';
import {
  Bed,
  User,
  Home,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cigarette,
  Bath,
  Sparkles,
  Wine,
  Mountain,
  Wrench,
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import type { EnrichedHotelRoom } from '@/services/hotelRoomsApi';

interface RoomDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: EnrichedHotelRoom;
}

type LocalizedItem = { name_en: string; name_mn: string };

export default function RoomDetailsModal({ open, onOpenChange, room }: RoomDetailsModalProps) {
  const { t, i18n } = useHydratedTranslation();
  const locale: 'en' | 'mn' = i18n?.language?.startsWith('en') ? 'en' : 'mn';
  const [imageIdx, setImageIdx] = useState(0);

  const labelOf = (item: LocalizedItem) => (locale === 'mn' ? item.name_mn : item.name_en) || item.name_en || item.name_mn;

  const sections: Array<{ key: string; title: string; Icon: React.ElementType; items: LocalizedItem[] }> = [
    {
      key: 'facilities',
      title: t('roomDetails.facilities', 'Өрөөний тохижилт'),
      Icon: Wrench,
      items: room.facilitiesDetails || [],
    },
    {
      key: 'bathroom',
      title: t('roomDetails.bathroom', 'Угаалгын өрөө'),
      Icon: Bath,
      items: room.bathroomItemsDetails || [],
    },
    {
      key: 'toiletries',
      title: t('roomDetails.toiletries', 'Үнэгүй ариун цэврийн хэрэгсэл'),
      Icon: Sparkles,
      items: room.freeToiletriesDetails || [],
    },
    {
      key: 'foodAndDrink',
      title: t('roomDetails.foodAndDrink', 'Хоол ундаа'),
      Icon: Wine,
      items: room.foodAndDrinkDetails || [],
    },
    {
      key: 'outdoorAndView',
      title: t('roomDetails.outdoorAndView', 'Гадаа болон харагдах байдал'),
      Icon: Mountain,
      items: room.outdoorAndViewDetails || [],
    },
  ];

  const images = room.images || [];
  const goPrev = () => setImageIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setImageIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-2xl rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">{room.roomTypeName}</DialogTitle>

        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="min-w-0">
              <h2 className="text-h3 font-bold text-gray-900 dark:text-white truncate">{room.roomTypeName}</h2>
              {room.roomCategoryName && room.roomCategoryName !== 'Unknown' && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{room.roomCategoryName}</p>
              )}
            </div>
            <DialogClose asChild>
              <button
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                aria-label={t('common.close', 'Хаах')}
              >
                <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            </DialogClose>
          </div>

          {/* Body — scrollable */}
          <div className="overflow-y-auto p-5 space-y-6">
            {/* Image gallery */}
            {images.length > 0 ? (
              <div className="space-y-2">
                <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <SafeImage
                    src={images[imageIdx].image}
                    alt={`${room.roomTypeName} ${imageIdx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-2 py-0.5 rounded">
                        {imageIdx + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={img.id ?? i}
                        onClick={() => setImageIdx(i)}
                        className={`relative w-20 h-14 rounded-md overflow-hidden border shrink-0 ${
                          i === imageIdx ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <SafeImage src={img.image} alt={`thumb ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Bed className="w-12 h-12 text-gray-300" />
              </div>
            )}

            {/* Quick facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {room.room_size && Number(room.room_size) > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800 dark:text-gray-200">{Number(room.room_size)} м²</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  x{room.adultQty}
                  {room.childQty > 0 && ` + ${room.childQty} ${t('roomCard.children', 'хүүхэд')}`}
                </span>
              </div>
              {room.bedTypeName && room.bedTypeName !== 'Unknown' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800 dark:text-gray-200 truncate">{room.bedTypeName}</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Cigarette className={`w-4 h-4 ${room.smoking_allowed ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className="text-gray-800 dark:text-gray-200">
                  {room.smoking_allowed
                    ? t('roomCard.smokingAllowed', 'Тамхи зөвшөөрнө')
                    : t('roomCard.nonSmoking', 'Тамхи татдаггүй')}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Coffee className={`w-4 h-4 ${room.breakfast_include_price ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-gray-800 dark:text-gray-200">
                  {room.breakfast_include_price
                    ? t('roomCard.breakfastIncluded', 'Өглөөний цай багтсан')
                    : t('roomCard.breakfastNotIncluded', 'Өглөөний цай багтаагүй')}
                </span>
              </div>
              {room.is_Bathroom && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Bath className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {t('roomCard.privateBathroom', 'Хувийн угаалгын өрөө')}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {room.room_Description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('roomDetails.description', 'Тайлбар')}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {room.room_Description}
                </p>
              </div>
            )}

            {/* Detail sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {sections
                .filter((s) => s.items.length > 0)
                .map(({ key, title, Icon, items }) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
                      <span className="text-sm text-gray-500">({items.length})</span>
                    </div>
                    <ul className="space-y-1.5 text-[13px]">
                      {items.map((it, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                          <span>{labelOf(it)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
