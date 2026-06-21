'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import type { HotelReviewsResponse } from '@/types/customer';

interface HotelReviewsProps {
  reviewsData: HotelReviewsResponse | null;
}

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

export default function HotelReviews({ reviewsData }: HotelReviewsProps) {
  const { t } = useHydratedTranslation();
  const [showAll, setShowAll] = useState(false);

  const total = reviewsData?.total ?? 0;
  const avgRating = reviewsData?.avg_rating ?? 0;
  const reviews = reviewsData?.reviews ?? [];
  const ratingBreakdown = reviewsData?.rating_breakdown ?? {};
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const maxBreakdownCount = Math.max(
    ...STAR_LEVELS.map((star) => ratingBreakdown[String(star)] ?? 0),
    1
  );

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return t('hotel.excellent', 'Excellent');
    if (rating >= 4.0) return t('hotel.veryGood', 'Very Good');
    if (rating >= 3.5) return t('hotel.good', 'Good');
    if (rating >= 3.0) return t('hotel.fair', 'Fair');
    return t('hotel.poor', 'Poor');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 sm:min-w-40">
          {total > 0 ? (
            <>
              <span className="text-[52px] font-extrabold text-indigo-700 dark:text-indigo-300 leading-none">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
                {getRatingText(avgRating)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {total} {t('hotel.reviews_count', 'үнэлгээ')}
              </span>
            </>
          ) : (
            <>
              <span className="text-[52px] font-extrabold text-indigo-700 dark:text-indigo-300 leading-none">—</span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
                {t('hotel.noRatingsYet', 'Үнэлгээ байхгүй')}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                0 {t('hotel.reviews_count', 'үнэлгээ')}
              </span>
            </>
          )}
        </div>

        <div className="flex-1 space-y-3 content-center">
          {STAR_LEVELS.map((star) => {
            const count = ratingBreakdown[String(star)] ?? 0;
            const widthPercent = total > 0 ? (count / maxBreakdownCount) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 w-8 shrink-0">{star}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-6 text-right shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 my-5" />

      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {t('hotel.comments', 'Сэтгэгдэл')}
        </h3>

        {displayedReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t('hotel.noComments', 'Одоогоор сэтгэгдэл байхгүй байна')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t('hotel.noCommentsDesc', 'Энэ буудалд анхны сэтгэгдлийг үлдээгээрэй')}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-900 dark:text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{review.customer_name}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment ? (
                      <p className="text-gray-800 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        {t('hotel.reviewsSection.noComment', 'No written comment')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviews.length > 3 && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-300"
          >
            {showAll
              ? t('hotel.reviewsSection.showLess', 'Show Less')
              : t('hotel.reviewsSection.showAll', `Show All ${reviews.length} Reviews`)}
          </button>
        </div>
      )}
    </div>
  );
}
