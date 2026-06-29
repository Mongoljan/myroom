"use client"

import { Star, Bed, Calendar, Briefcase, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { HotelReviewsResponse } from '@/types/customer';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-blue-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-orange-600',
] as const;

function getAvatarColor(name: string): (typeof AVATAR_COLORS)[number] {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface ReviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewsData: HotelReviewsResponse | null;
}

export function ReviewDrawer({ open, onOpenChange, reviewsData }: ReviewDrawerProps) {
  const { t } = useHydratedTranslation();
  if (!reviewsData) return null;

  const { total, avg_rating, reviews } = reviewsData;
  const guestReviewTotal = total ?? 0;
  const guestAvgRating = avg_rating ?? 0;

  const getGuestRatingText = (rating: number) => {
    if (rating >= 4.5) return t('hotel.excellent', 'Excellent');
    if (rating >= 4.0) return t('hotel.veryGood', 'Very Good');
    if (rating >= 3.5) return t('hotel.good', 'Good');
    if (rating >= 3.0) return t('hotel.fair', 'Fair');
    return t('hotel.poor', 'Poor');
  };
  const safeAvgRating = typeof avg_rating === 'number' ? avg_rating : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${t('reviews.writtenOn', '-нд бичсэн')}`;
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed inset-y-0 right-0 left-auto bottom-auto mt-0 h-screen w-[90vw] sm:w-[500px] md:w-[700px] lg:w-[800px] rounded-l-2xl sm:rounded-l-none bg-white p-0 flex flex-col shadow-2xl [&>div.mx-auto]:hidden">
        <DrawerHeader className="border-b border-gray-100 p-6 flex flex-row items-center justify-between shrink-0">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            Зочдын үнэлгээ
          </DrawerTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold text-gray-900">{safeAvgRating.toFixed(1)}</span>
              <span className="text-sm font-medium text-gray-500">
                Маш сайн ({total} Сэтгэгдэл)
              </span>
            </div>
            <DrawerClose className="rounded-full p-1 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6">
          {/* Rating Breakdown Bar */}
          <div className="bg-[#7fb4f5] rounded-xl p-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 text-white shadow-sm">
            {[
              { label: 'Цэвэрхэн тухтай', value: safeAvgRating.toFixed(1) },
              { label: 'Үйлчилгээ', value: safeAvgRating.toFixed(1) },
              { label: 'Байршил', value: safeAvgRating.toFixed(1) },
              { label: 'Үнэ цэнэ', value: safeAvgRating.toFixed(1) },
              { label: 'Дотоод тохижилт', value: safeAvgRating.toFixed(1) },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 text-center gap-1">
                <span className="text-lg sm:text-xl font-semibold">{item.value}</span>
                <span className="text-xs sm:text-sm font-medium opacity-90">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Reviews List */}
          <div className="flex flex-col gap-6 mt-4">
            {reviews.map((review) => {
              const avatarColor = getAvatarColor(review.customer_name || '?');
              return (
              <div key={review.id} className="border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-[240px] flex flex-col gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${avatarColor}`}>
                        <span className="text-sm font-semibold text-white">
                          {review.customer_name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 truncate">
                        {review.customer_name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 text-sm text-gray-500 mt-2">
                      <div className="flex items-center gap-3">
                        <Bed className="w-4 h-4 shrink-0" />
                        <span className="truncate">{t('hotel.mockRoom', 'Standard King Өрөө')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span className="truncate">{t('hotel.mockDate', '2025/05 сард захиалсан')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 shrink-0" />
                        <span className="truncate">{t('hotel.mockTrip', 'Бизнес аялалаар')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Rating & Comment */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 shrink-0">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed mt-2 text-sm sm:text-base">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
