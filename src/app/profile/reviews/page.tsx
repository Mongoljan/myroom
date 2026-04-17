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
          (window as unknown as Record<string, unknown>).__hotelByNameMap = hotelByNameMap;
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
      const hotelByNameMap = (window as unknown as Record<string, unknown>).__hotelByNameMap as Map<string, HotelInfo> | undefined;

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
      const reviewData: { hotel: number; booking: number; rating: number; comment?: string } = {
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
    } catch (err: unknown) {
      console.error('Review submission error:', err);
      const e = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      const errorMessage = e?.response?.data?.error ||
                          e?.response?.data?.message ||
                          e?.message ||
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
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('reviews.noReviewsTitle', 'No reviews yet')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('reviews.noReviews', 'Complete a booking to write your first review!')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Review header */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user?.first_name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">
                          {t('reviews.yourRating', 'Your rating:')}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600'
                              }
                            />
                          ))}
                        </div>
                        <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Review comment */}
                    {review.comment && (
                      <blockquote className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-l-4 border-blue-500">
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </blockquote>
                    )}

                    {/* Hotel card */}
                    {(() => {
                      const hotel = hotels.get(review.hotel);
                      return (
                        <div className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                          {hotel?.profile_image ? (
                            <img
                              src={HotelService.getHotelImageUrl(hotel.profile_image) || ''}
                              alt={hotel.PropertyName}
                              className="w-16 h-16 rounded-xl object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                              <MapPin className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {hotel?.PropertyName || `Hotel #${review.hotel}`}
                            </h4>
                            {hotel?.location && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                {hotel.location}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                {t('reviews.reviewed', 'Reviewed')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Pending Reviews ── */}
        {!isLoading && activeTab === 'pending' && (
          pendingBookings.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('reviews.noPendingTitle', 'All caught up!')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('reviews.noPendingReviews', 'No reviews pending. Complete more bookings to share your experiences!')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Header with booking info */}
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {t('reviews.bookingNumber', 'Booking:')}
                          </span>
                          <span className="font-mono font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                            {booking.booking_code}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {t('reviews.completedOn', 'Completed:')}
                          </span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {new Date(booking.created_at?.slice(0, 10)).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                        {t('reviews.completed', 'Completed')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Hotel image */}
                      {(() => {
                        const hotel = hotels.get(booking.hotel);
                        return hotel?.profile_image ? (
                          <img
                            src={HotelService.getHotelImageUrl(hotel.profile_image) || ''}
                            alt={hotel.PropertyName}
                            className="w-20 h-20 rounded-xl object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-xl flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        );
                      })()}

                      {/* Hotel and booking details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {booking.hotel_name}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Room:</span>
                            <span>{booking.room_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Stay:</span>
                            <span>{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and actions */}
                      <div className="text-right">
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {booking.total_price.toLocaleString('mn-MN')} ₮
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('reviews.totalPaid', 'Total paid')}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => { setReviewTarget(booking); setSubmitError(''); }}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            {t('reviews.writeReview', 'Write Review')}
                          </button>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors">
                            {t('reviews.skip', 'Skip')}
                          </button>
                        </div>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('reviews.rateExperience', 'Rate Your Experience')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {reviewTarget.hotel_name}
                </p>
              </div>
              <button 
                onClick={() => setReviewTarget(null)} 
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitReview} className="p-6">
              {/* Emoji rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('reviews.overallRating', 'Overall Rating')}
                </label>
                <div className="flex justify-center gap-2">
                  {EMOJI_RATINGS.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEmojiRating(i + 1)}
                      className={`text-3xl w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center ${
                        emojiRating === i + 1
                          ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 scale-110 shadow-lg'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {emojiRating}/5 {t('reviews.stars', 'stars')}
                  </span>
                </div>
              </div>

              {/* Like tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('reviews.whatDidYouLike', 'What did you like?')} 
                  <span className="text-gray-500 dark:text-gray-400 font-normal">
                    {t('reviews.optional', '(Optional)')}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {LIKE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${
                        likedTags.includes(tag)
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {t(`reviews.${tag}`, tag)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('reviews.additionalComments', 'Additional Comments')}
                  <span className="text-gray-500 dark:text-gray-400 font-normal">
                    {t('reviews.optional', '(Optional)')}
                  </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('reviews.commentPlaceholder', 'Share your experience...')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('reviews.submitting', 'Submitting...')}
                    </>
                  ) : (
                    t('reviews.submit', 'Submit Review')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}