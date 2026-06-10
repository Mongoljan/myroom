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
  const [allBookings, setAllBookings] = useState<CustomerBooking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<Map<number, HotelInfo>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

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
          CustomerService.getBookings(token),
        ]);

        setReviews(revRes.reviews);
        setAllBookings(bookRes.bookings);

        // Debug: Log the actual booking data
        if (bookRes.bookings.length > 0) {
        }

        // Set pending bookings: finished bookings without review
        const pendingList = bookRes.bookings.filter((b) => b.status === 'finished' && !b.has_review);
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
          // Continue without hotel info - we can still match by name
        }
      } catch (error) {
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

      // Try different matching strategies
      const hotelNameLower = reviewTarget.hotel_name?.toLowerCase() || '';

      // First check our stored name map
      const hotelByNameMap = (window as unknown as Record<string, unknown>).__hotelByNameMap as Map<string, HotelInfo> | undefined;

      if (hotelByNameMap) {
        const hotelEntry = hotelByNameMap.get(hotelNameLower);
        if (hotelEntry) {
          hotelId = hotelEntry.pk;
        } else {
          // Try partial match
          const entries = Array.from(hotelByNameMap.entries());
          const partialMatch = entries.find(([name, hotel]) =>
            name.includes(hotelNameLower) || hotelNameLower.includes(name)
          );
          if (partialMatch) {
            hotelId = partialMatch[1].pk;
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
        }
      }
    }


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


      await CustomerService.createReview(token, reviewData);
      setPendingBookings((prev) => prev.filter((b) => b.id !== reviewTarget.id));
      setReviewTarget(null);
      setComment('');
      setLikedTags([]);
      setEmojiRating(3);
      // Refresh reviews and bookings
      const [updatedReviews, updatedBookings] = await Promise.all([
        CustomerService.getReviews(token),
        CustomerService.getBookings(token),
      ]);
      setReviews(updatedReviews.reviews);
      setAllBookings(updatedBookings.bookings);
      const pendingList = updatedBookings.bookings.filter((b) => b.status === 'finished' && !b.has_review);
      setPendingBookings(pendingList);

      // Show success for a moment
    } catch (err: unknown) {
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

  const formatDateHyphen = (d: string) => d?.slice(0, 10) ?? '';
  const formatDateSlash = (d: string) => d?.slice(0, 10).replace(/-/g, '/') ?? '';

  const CATEGORIES = [
    { id: 1, name: 'Зочид буудал' },
    { id: 8, name: 'Амралтын газар' },
    { id: 7, name: 'Жуулчны бааз' },
  ];

  const getReviewCountByPropertyType = (typeId: number) => {
    return reviews.filter(review => {
      const hotel = hotels.get(review.hotel);
      return hotel?.property_type === typeId;
    }).length;
  };

  const getPendingCountByPropertyType = (typeId: number) => {
    return pendingBookings.filter(booking => {
      const hotel = hotels.get(booking.hotel);
      return hotel?.property_type === typeId;
    }).length;
  };

  const filteredReviews = reviews.filter(review => {
    if (selectedCategory === 'all') return true;
    const hotel = hotels.get(review.hotel);
    return hotel?.property_type === selectedCategory;
  });

  const filteredPendingBookings = pendingBookings.filter(booking => {
    if (selectedCategory === 'all') return true;
    const hotel = hotels.get(booking.hotel);
    return hotel?.property_type === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('reviews.title', 'Сэтгэгдлүүд')}</h1>

      {/* Tabs and Filters Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 dark:border-gray-700">
          {([
            ['my', t('reviews.myReviews', 'Your Reviews')],
            ['pending', t('reviews.pendingReviews', 'Pending Reviews')]
          ] as const).map(
            ([val, label]) => (
              <button
                key={val}
                onClick={() => {
                  setActiveTab(val);
                  setSelectedCategory('all');
                }}
                className={`px-1 py-3 text-sm font-semibold transition border-b-2 -mb-px ${activeTab === val
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Бүгд({activeTab === 'my' ? reviews.length : pendingBookings.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = activeTab === 'my' ? getReviewCountByPropertyType(cat.id) : getPendingCountByPropertyType(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                {cat.name}({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* List Container */}
      <div>
        {isLoading && (
          <div className="flex justify-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-7 h-7 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── My Reviews ── */}
        {!isLoading && activeTab === 'my' && (
          filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('reviews.noReviewsTitle', 'No reviews yet')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('reviews.noReviews', 'Complete a booking to write your first review!')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => {
                const booking = allBookings.find((b) => b.id === review.booking);
                const hotel = hotels.get(review.hotel);
                return (
                  <div key={review.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    {/* Header: User avatar & details */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      {/* Left: User Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {user?.first_name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-none">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 leading-none">
                            {formatDateHyphen(review.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Right: Rating and booking detail */}
                      <div className="sm:text-right flex flex-col items-start sm:items-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Таны өгсөн үнэлгээ:
                          </span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-250 dark:text-gray-600 fill-gray-250 dark:fill-gray-600'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {booking ? (
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            {formatDateSlash(booking.check_in)} - {formatDateSlash(booking.check_out)} / {booking.room_type ? (booking.room_type.endsWith('өрөө') ? booking.room_type : `${booking.room_type} өрөө`) : ''}
                          </p>
                        ) : (
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            &nbsp;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Review comment */}
                    {review.comment && (
                      <div className="text-gray-800 dark:text-gray-200 text-sm mb-4 leading-relaxed">
                        {review.comment}
                      </div>
                    )}

                    {/* Hotel card */}
                    {hotel && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-150 dark:border-gray-700 rounded-lg p-3 bg-gray-50/30 dark:bg-gray-900/10 gap-3">
                        <div className="flex items-center gap-3">
                          {hotel.profile_image ? (
                            <img
                              src={HotelService.getHotelImageUrl(hotel.profile_image) || ''}
                              alt={hotel.PropertyName}
                              className="w-16 h-16 rounded object-cover bg-gray-200 dark:bg-gray-800 flex-shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded bg-gray-250 dark:bg-gray-700 flex-shrink-0" />
                          )}
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {hotel.PropertyName}
                            </h5>
                            {((hotel as any).avg_rating || (hotel as any).rating || (hotel as any).review_count || (hotel as any).reviews_count) ? (
                              <div className="flex items-center gap-2 mt-1">
                                {((hotel as any).avg_rating || (hotel as any).rating) ? (
                                  <span className="bg-[#3fb33f] text-white text-[11px] font-bold px-1.5 py-0.5 rounded leading-none">
                                    {((hotel as any).avg_rating || (hotel as any).rating)} / 5
                                  </span>
                                ) : null}
                                {((hotel as any).review_count || (hotel as any).reviews_count) ? (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {((hotel as any).review_count || (hotel as any).reviews_count)} сэтгэгдэл
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            window.location.href = `/hotel/${hotel.pk}`;
                          }}
                          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto font-medium"
                        >
                          Бүх сэтгэгдэл үзэх
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Pending Reviews ── */}
        {!isLoading && activeTab === 'pending' && (
          filteredPendingBookings.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('reviews.noPendingTitle', 'All caught up!')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('reviews.noPendingReviews', 'No reviews pending. Complete more bookings to share your experiences!')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPendingBookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Header with booking info */}
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                      <div className="flex flex-wrap items-center gap-4">
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
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full self-start sm:self-auto">
                        {t('reviews.completed', 'Completed')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      {/* Hotel image */}
                      {(() => {
                        const hotel = hotels.get(booking.hotel);
                        return hotel?.profile_image ? (
                          <img
                            src={HotelService.getHotelImageUrl(hotel.profile_image) || ''}
                            alt={hotel.PropertyName}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
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
                            <span>{formatDateSlash(booking.check_in)} – {formatDateSlash(booking.check_out)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and actions */}
                      <div className="text-left md:text-right w-full md:w-auto">
                        <div className="mb-4">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {booking.total_price.toLocaleString('mn-MN')} ₮
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('reviews.totalPaid', 'Total paid')}
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('reviews.rateExperience', 'Rate Your Experience')}
                </h2>
                <p className="text-sm text-gray-650 dark:text-gray-400 mt-1">
                  {reviewTarget.hotel_name}
                </p>
              </div>
              <button
                onClick={() => setReviewTarget(null)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-650 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitReview} className="p-6">
              {/* Emoji rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-705 dark:text-gray-300 mb-3">
                  {t('reviews.overallRating', 'Overall Rating')}
                </label>
                <div className="flex justify-center gap-2">
                  {EMOJI_RATINGS.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEmojiRating(i + 1)}
                      className={`text-3xl w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center ${emojiRating === i + 1
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
                <label className="block text-sm font-medium text-gray-705 dark:text-gray-300 mb-3">
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
                      className={`px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${likedTags.includes(tag)
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 text-gray-750 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {t(`reviews.${tag}`, tag)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-705 dark:text-gray-300 mb-3">
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
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-705 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
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