'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import type { HotelReviewItem, HotelReviewsResponse } from '@/types/customer';

interface HotelReviewsProps {
  reviewsData: HotelReviewsResponse | null;
}

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

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

interface ReviewCommentProps {
  comment: string;
  isExpanded: boolean;
  onToggle: () => void;
  readMoreLabel: string;
  showLessLabel: string;
}

function ReviewComment({
  comment,
  isExpanded,
  onToggle,
  readMoreLabel,
  showLessLabel,
}: ReviewCommentProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || isExpanded) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [comment, isExpanded]);

  const showToggle = isExpanded || isOverflowing;

  return (
    <div className={isExpanded ? '' : 'min-h-[140px]'}>
      <p
        ref={textRef}
        className={`text-sm text-gray-800 dark:text-gray-200 leading-snug ${
          isExpanded ? '' : 'line-clamp-7'
        }`}
      >
        {comment}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isExpanded ? showLessLabel : readMoreLabel}
        </button>
      )}
    </div>
  );
}

export default function HotelReviews({ reviewsData }: HotelReviewsProps) {
  const { t } = useHydratedTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<number>>(new Set());

  const total = reviewsData?.total ?? 0;
  const avgRating = reviewsData?.avg_rating ?? 0;
  const reviews = reviewsData?.reviews ?? [];
  const ratingBreakdown = reviewsData?.rating_breakdown ?? {};
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

  const formatDateShort = (dateString: string) => {
    const d = new Date(dateString);
    if (!Number.isFinite(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}/${m}/${day}`;
  };

  const updateScrollButtons = () => {
    const element = scrollRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
  };

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setTimeout(updateScrollButtons, 100);
    return () => clearTimeout(timer);
  }, [reviews, expandedReviewIds]);

  const toggleExpanded = (reviewId: number) => {
    setExpandedReviewIds((prev) => {
      if (prev.has(reviewId)) {
        return new Set();
      }
      return new Set([reviewId]);
    });
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -296 : 296,
      behavior: 'smooth',
    });
  };

  const renderReviewCard = (review: HotelReviewItem) => {
    const isExpanded = expandedReviewIds.has(review.id);
    const avatarColor = getAvatarColor(review.customer_name || '?');

    return (
      <div
        key={review.id}
        className={`flex shrink-0 w-[280px] flex-col border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 p-3.5 transition-[height] duration-200 ${
          isExpanded ? 'shadow-md z-1 relative' : 'min-h-[220px]'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center shrink-0`}
          >
            <span className="text-sm font-semibold text-white">
              {review.customer_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {review.customer_name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatDateShort(review.created_at)}
            </p>
          </div>
        </div>

        <div className="mt-2.5">
          {review.comment ? (
            <ReviewComment
              comment={review.comment}
              isExpanded={isExpanded}
              onToggle={() => toggleExpanded(review.id)}
              readMoreLabel={t('common.readMore', 'Read more')}
              showLessLabel={t('common.showLess', 'Show less')}
            />
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t('hotel.reviewsSection.noComment', 'No written comment')}
            </p>
          )}
        </div>
      </div>
    );
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
                {t('hotel.comments', 'Сэтгэгдэл')} - {total}
              </span>
            </>
          ) : (
            <>
              <span className="text-[52px] font-extrabold text-indigo-700 dark:text-indigo-300 leading-none">—</span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
                {t('hotel.noRatingsYet', 'Үнэлгээ байхгүй')}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t('hotel.comments', 'Сэтгэгдэл')} - 0
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
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {t('hotel.comments', 'Сэтгэгдэл')} ({total})
        </h3>

        {reviews.length === 0 ? (
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
          <div className="relative">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={t('common.previous', 'Previous')}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={t('common.next', 'Next')}
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <div
              ref={scrollRef}
              className="flex items-start gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={updateScrollButtons}
            >
              {reviews.map((review) => renderReviewCard(review))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
