"use client";

import { useState, useEffect } from 'react';
import { Star, X, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { CustomerBooking, Review } from '@/types/customer';
import { HotelService, HotelInfo } from '@/services/hotelApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

type ReviewTab = 'my' | 'pending';

const EMOJI_RATINGS = ['😢', '😕', '😐', '😊', '😄'];

  // Will be populated with translations
  const LIKE_TAGS = [
    'cleanliness',
    'location',
    'food',
    'service',
    'value'
  ];

export default function ReviewsPage() {
  const { token, user } = useAuth();
  const { t } = useHydratedTranslation();

  const [activeTab, setActiveTab] = useState<ReviewTab>('my');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingBookings, setPendingBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<Map<number, HotelInfo>>(new Map());

  // Write review modal
  const [reviewTarget, setReviewTarget] = useState<CustomerBooking | null>(null);
  const [emojiRating, setEmojiRating] = useState(3);
  const [likedTags, setLikedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        // Fetch reviews and bookings first (these are critical)
        const [revRes, bookRes] = await Promise.all([
          CustomerService.getReviews(token),
          CustomerService.getBookings(token, 'finished'),
        ]);

        setReviews(revRes.reviews);

        // Debug: Log the actual booking data
        console.log('[DEBUG] Raw booking data:', bookRes.bookings);
        if (bookRes.bookings.length > 0) {
          console.log('[DEBUG] First booking full object:', JSON.stringify(bookRes.bookings[0], null, 2));
        }

        // Set pending bookings
        const pendingList = bookRes.bookings.filter((b) => !b.has_review);
        setPendingBookings(pendingList);

        // Try to fetch hotels, but don't fail if it doesn't work
        try {
          const allHotels = await HotelService.getApprovedHotels();

          // Create a map of all hotels by ID and name
          const hotelMap = new Map<number, HotelInfo>();
          const hotelByNameMap = new Map<string, HotelInfo>();

          allHotels.forEach((hotel: HotelInfo) => {
            hotelMap.set(hotel.pk, hotel);
            hotelByNameMap.set(hotel.PropertyName.toLowerCase(), hotel);
          });

          setHotels(hotelMap);

          // Also store the name map for later use
          (window as any).__hotelByNameMap = hotelByNameMap;
        } catch (hotelError) {
          console.error('Failed to fetch hotel info (non-critical):', hotelError);
          // Continue without hotel info - we can still match by name
        }
      } catch (error) {
        console.error('Failed to fetch reviews/bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget || !token) return;

    // Find hotel ID from the hotel name
    let hotelId = reviewTarget.hotel;

    // If hotel ID is missing or 0, try to find it by name
    if (!hotelId || hotelId === 0) {
      console.log('Hotel ID missing, trying to find by name:', reviewTarget.hotel_name);

      // Try different matching strategies
      const hotelNameLower = reviewTarget.hotel_name?.toLowerCase() || '';

      // First check our stored name map
      const hotelByNameMap = (window as any).__hotelByNameMap as Map<string, HotelInfo> | undefined;

      if (hotelByNameMap) {
        const hotelEntry = hotelByNameMap.get(hotelNameLower);
        if (hotelEntry) {
          hotelId = hotelEntry.pk;
          console.log('Found hotel by exact name match:', hotelEntry);
        } else {
          // Try partial match
          const entries = Array.from(hotelByNameMap.entries());
          const partialMatch = entries.find(([name, hotel]) =>
            name.includes(hotelNameLower) || hotelNameLower.includes(name)
          );
          if (partialMatch) {
            hotelId = partialMatch[1].pk;
            console.log('Found hotel by partial name match:', partialMatch[1]);
          }
        }
      }

      // If still not found, try from the hotels map
      if (!hotelId || hotelId === 0) {
        const hotelEntry = Array.from(hotels.values()).find(
          h => h.PropertyName.toLowerCase() === hotelNameLower ||
               h.PropertyName.toLowerCase().includes(hotelNameLower) ||
               hotelNameLower.includes(h.PropertyName.toLowerCase())
        );
        if (hotelEntry) {
          hotelId = hotelEntry.pk;
          console.log('Found hotel from hotels map:', hotelEntry);
        }
      }
    }

    console.log('Final hotel ID to submit:', hotelId, 'for booking:', reviewTarget.id);

    if (!hotelId || hotelId === 0) {
      setSubmitError(`Cannot find hotel "${reviewTarget.hotel_name}" in the system. Please contact support.`);
      setIsSubmitting(false);
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      // Ensure we have valid data
      const reviewData: any = {
        hotel: parseInt(hotelId.toString()), // Ensure it's a number
        booking: reviewTarget.id,
        rating: emojiRating,
      };

      // Only add comment if it's not empty
      if (comment && comment.trim().length > 0) {
        reviewData.comment = comment.trim();
      }

      console.log('Submitting review data:', JSON.stringify(reviewData));

      await CustomerService.createReview(token, reviewData);
      setPendingBookings((prev) => prev.filter((b) => b.id !== reviewTarget.id));
      setReviewTarget(null);
      setComment('');
      setLikedTags([]);
      setEmojiRating(3);
      // Refresh reviews
      const updatedReviews = await CustomerService.getReviews(token);
      setReviews(updatedReviews.reviews);

      // Show success for a moment
      console.log('Review submitted successfully!');
    } catch (err: any) {
      console.error('Review submission error:', err);
      const errorMessage = err?.response?.data?.error ||
                          err?.response?.data?.message ||
                          err?.message ||
                          'Failed to submit review. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) =>
    setLikedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const formatDate = (d: string) => d?.slice(0, 10).replace(/-/g, '/') ?? '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-5">{t('reviews.title', 'Сэтгэгдлүүд')}</h1>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 dark:border-gray-700">
          {([
            ['my', t('reviews.myReviews', 'Your Reviews')],
            ['pending', t('reviews.pendingReviews', 'Pending Reviews')]
          ] as const).map(
            ([val, label]) => (
              <button
                key={val}
                onClick={() => setActiveTab(val)}
                className={`px-5 py-2.5 text-sm transition border-b-2 -mb-px ${
                  activeTab === val
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="p-6">
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── My Reviews ── */}
        {!isLoading && activeTab === 'my' && (
          reviews.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">{t('reviews.noReviews', 'No reviews yet.')}</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/60">
                  {/* Reviewer header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-900 dark:bg-gray-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user?.first_name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('common.you', 'You')}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('reviews.yourRating', 'Your rating:')}</span>
                      <div className="flex gap-0.5 ml-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200 fill-gray-200'
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                  )}

                  {/* Hotel card */}
                  {(() => {
                    const hotel = hotels.get(review.hotel);
                    return (
                      <div className="mt-3 border border-gray-100 dark:border-gray-700 rounded-lg p-3 flex gap-3 items-center bg-gray-50 dark:bg-gray-700/50">
                        {hotel?.profile_image ? (
                          <img
                            src={HotelService.getHotelImageUrl(hotel.profile_image) || ''}
                            alt={hotel.PropertyName}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {hotel?.PropertyName || `Hotel #${review.hotel}`}
                          </p>
                          {hotel?.location && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{hotel.location}</p>
                          )}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-white bg-green-500 px-1.5 py-0.5 rounded font-medium">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Pending Reviews ── */}
        {!isLoading && activeTab === 'pending' && (
          pendingBookings.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">{t('reviews.noPendingReviews', 'No reviews pending.')}</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden dark:bg-gray-800">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400">
                    <span>{t('reviews.bookingNumber', 'Booking Number:')} <span className="text-gray-800 dark:text-gray-200 font-medium">{booking.booking_code}</span></span>
                    <span>{t('reviews.date', 'Date:')} {formatDate(booking.created_at?.slice(0, 10))}</span>
                    <span className="text-gray-500 dark:text-gray-400">{t('reviews.completed', 'Completed')}</span>
                  </div>
                  <div className="flex items-start gap-4 p-4">
                    {(() => {
                      const hotel = hotels.get(booking.hotel);
                      return hotel?.profile_image ? (
                        <img
                          src={HotelService.getHotelImageUrl(hotel.profile_image) || ''}
                          alt={hotel.PropertyName}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                          loading="lazy"
                        />
                      ) : (
                          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-600 rounded-lg shrink-0 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{booking.hotel_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{booking.room_type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {booking.total_price.toLocaleString('mn-MN')} ₮
                      </span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          {t('reviews.delete', 'Delete')}
                        </button>
                        <button
                          onClick={() => { setReviewTarget(booking); setSubmitError(''); }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition"
                        >
                          {t('reviews.writeReview', 'Write Review')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Write Review Modal ── */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-end sm:justify-end z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 w-full max-w-xs shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('reviews.rateExperience', 'Please rate your experience')}</h2>
              <button onClick={() => setReviewTarget(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              {/* Emoji rating */}
              <div className="flex justify-between mb-4">
                {EMOJI_RATINGS.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setEmojiRating(i + 1)}
                    className={`text-2xl w-10 h-10 rounded-full transition flex items-center justify-center ${
                      emojiRating === i + 1
                        ? 'bg-yellow-100 ring-2 ring-yellow-400 scale-110'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Like tags */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('reviews.whatDidYouLike', 'What did you like?')}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {LIKE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs border transition ${
                      likedTags.includes(tag)
                        ? 'bg-blue-50 border-blue-400 text-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-400'
                    }`}
                  >
                    {t(`reviews.${tag}`, tag)}
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('reviews.commentPlaceholder', 'Write a comment')}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-3"
              />

              {submitError && (
                <p className="text-xs text-red-500 mb-2">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? t('reviews.submitting', 'Submitting...') : t('reviews.submit', 'Submit')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}