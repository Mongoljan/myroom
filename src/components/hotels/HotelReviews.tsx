'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

// No hardcoded review data - will be loaded from API in the future

interface HotelReviewsProps {
  hotelId?: string;
  rating: number;
  reviewCount: number;
}

export default function HotelReviews({ rating, reviewCount }: Omit<HotelReviewsProps, 'hotelId'>) {
  const { t } = useHydratedTranslation();
  const [reviews] = useState<Review[]>([]); // Empty array - no hardcoded reviews
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return t('hotel.excellent', 'Excellent');
    if (rating >= 4.0) return t('hotel.veryGood', 'Very Good');
    if (rating >= 3.5) return t('hotel.good', 'Good');
    if (rating >= 3.0) return t('hotel.fair', 'Fair');
    return t('hotel.poor', 'Poor');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('hotel.reviews', 'Reviews')}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{rating}</span>
          </div>
          <div className="text-gray-800">
            <span className="font-medium">{getRatingText(rating)}</span>
            <span className="ml-1">({reviewCount} {t('hotel.reviews', 'reviews')})</span>
          </div>
        </div>
      </div>

      {/* Rating Breakdown - Only show when we have review data */}
      {reviewCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-100 rounded-lg">
          <div className="text-center col-span-2 md:col-span-5 text-gray-600">
            {t('hotel.reviewsSection.ratingBreakdownPlaceholder', 'Rating breakdown will be available when review data is integrated')}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <div className="text-lg font-medium mb-2">{t('hotel.reviewsSection.noReviews', 'No reviews yet')}</div>
            <div className="text-sm">{t('hotel.reviewsSection.beFirst', 'Be the first to share your experience!')}</div>
          </div>
        ) : (
          displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 mb-3 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Show More Button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
          >
            {showAll
              ? t('hotel.reviewsSection.showLess', 'Show Less')
              : t('hotel.reviewsSection.showAll', `Show All ${reviews.length} Reviews`)
            }
          </button>
        </div>
      )}
    </div>
  );
}