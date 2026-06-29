"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, X, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { CustomerBooking, Review, HotelReviewsResponse } from '@/types/customer';
import { HotelService, HotelInfo } from '@/services/hotelApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ReviewDrawer } from '@/components/hotels/ReviewDrawer';

type ReviewTab = 'my' | 'pending';

const EMOJI_RATINGS = ['😢', '😕', '😐', '😊', '😄'];

const LIKE_TAGS = [
  'cleanliness',
  'location',
  'food',
  'service',
  'value',
  'wifi',
  'comfort',
];

function resolveHotelImageUrl(raw?: string | null): string {
  return HotelService.getHotelImageUrl(raw ?? null) ?? '';
}

const formatName = (firstName?: string, lastName?: string) => {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || 'Хэрэглэгч';
};

export default function ReviewsPage() {
  const { token, user } = useAuth();
  const { t } = useHydratedTranslation();

  const [activeTab, setActiveTab] = useState<ReviewTab>('my');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allBookings, setAllBookings] = useState<CustomerBooking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<Map<number, HotelInfo>>(new Map());
  const [hotelRatingsMap, setHotelRatingsMap] = useState<Map<number, HotelReviewsResponse>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  // Write review modal
  const [reviewTarget, setReviewTarget] = useState<CustomerBooking | null>(null);
  const [emojiRating, setEmojiRating] = useState(3);
  const [likedTags, setLikedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Review Drawer state
  const [selectedReviewHotelId, setSelectedReviewHotelId] = useState<number | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  const handleViewReviews = async (hotelId: number) => {
    setSelectedReviewHotelId(hotelId);
    setIsReviewDrawerOpen(true);

    if (!hotelRatingsMap.has(hotelId)) {
      try {
        const data = await CustomerService.getHotelReviews(hotelId);
        setHotelRatingsMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(hotelId, data);
          return newMap;
        });
      } catch (err) {
        console.error('Алдаа гарлаа:', err);
      }
    }
  };

  useEffect(() => {
    if (!token) return;
    
    Promise.resolve().then(() => {
      setIsLoading(true);
    });

    const fetchData = async () => {
      try {
        const [revRes, bookRes] = await Promise.all([
          CustomerService.getReviews(token),
          CustomerService.getBookings(token),
        ]);
 
        setReviews(revRes.reviews);
        setAllBookings(bookRes.bookings);

        const pendingList = bookRes.bookings.filter(
          (b) => b.status === 'finished' && !b.has_review
        );
        setPendingBookings(pendingList);

        // Fetch hotel info (for names, images, location)
        try {
          const allHotels = await HotelService.getApprovedHotels();
          const hotelMap = new Map<number, HotelInfo>();
          allHotels.forEach((hotel: HotelInfo) => {
            hotelMap.set(hotel.pk, hotel);
          });
          setHotels(hotelMap);
        } catch {
          // Continue without hotel info
        }

        // Fetch real avg_rating + review count for each hotel the user reviewed
        // Uses the same API the hotel page uses: GET /reviews/?hotel_id={id}
        const uniqueHotelIds = [...new Set(revRes.reviews.map((r) => r.hotel).filter(Boolean))];
        if (uniqueHotelIds.length > 0) {
          const ratingsEntries = await Promise.all(
            uniqueHotelIds.map(async (id) => {
              try {
                const data = await CustomerService.getHotelReviews(id);
                return [id, data] as [number, HotelReviewsResponse];
              } catch {
                return null;
              }
            })
          );
          const ratingsMap = new Map<number, HotelReviewsResponse>();
          ratingsEntries.forEach((entry) => {
            if (entry) ratingsMap.set(entry[0], entry[1]);
          });
          setHotelRatingsMap(ratingsMap);
        }
      } catch {
        // ignore fetch errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const findHotelByName = (name?: string): HotelInfo | undefined => {
    if (!name) return undefined;
    const nameLower = name.toLowerCase();
    return Array.from(hotels.values()).find(
      (h) =>
        h.PropertyName.toLowerCase() === nameLower ||
        h.PropertyName.toLowerCase().includes(nameLower) ||
        nameLower.includes(h.PropertyName.toLowerCase())
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget || !token) return;

    let hotelId = reviewTarget.hotel;

    if (!hotelId || hotelId === 0) {
      const found = findHotelByName(reviewTarget.hotel_name);
      if (found) hotelId = found.pk;
    }

    if (!hotelId || hotelId === 0) {
      setSubmitError(
        `Cannot find hotel "${reviewTarget.hotel_name}" in the system. Please contact support.`
      );
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const reviewData: { hotel: number; booking: number; rating: number; comment?: string } = {
        hotel: hotelId,
        booking: reviewTarget.id,
        rating: emojiRating,
      };

      if (comment && comment.trim().length > 0) {
        reviewData.comment = comment.trim();
      }

      await CustomerService.createReview(token, reviewData);
      setPendingBookings((prev) => prev.filter((b) => b.id !== reviewTarget.id));
      setReviewTarget(null);
      setComment('');
      setLikedTags([]);
      setEmojiRating(3);

      const [updatedReviews, updatedBookings] = await Promise.all([
        CustomerService.getReviews(token),
        CustomerService.getBookings(token),
      ]);
      setReviews(updatedReviews.reviews);
      setAllBookings(updatedBookings.bookings);
      setPendingBookings(
        updatedBookings.bookings.filter((b) => b.status === 'finished' && !b.has_review)
      );
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setSubmitError(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          'Failed to submit review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) =>
    setLikedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const formatDateSlash = (d: string) => d?.slice(0, 10).replace(/-/g, '/') ?? '';

  const CATEGORIES = [
    { id: 1, name: t('reviews.propertyTypes.hotel', 'Зочид буудал') },
    { id: 8, name: t('reviews.propertyTypes.resort', 'Амралтын газар') },
    { id: 7, name: t('reviews.propertyTypes.camp', 'Жуулчны бааз') },
  ];

  const getHotelForReview = (review: Review): HotelInfo | undefined =>
    hotels.get(review.hotel);

  const getHotelForPending = (booking: CustomerBooking): HotelInfo | undefined =>
    hotels.get(booking.hotel) || findHotelByName(booking.hotel_name);

  const filteredReviews = reviews.filter((review) => {
    if (selectedCategory === 'all') return true;
    return getHotelForReview(review)?.property_type === selectedCategory;
  });

  const filteredPendingBookings = pendingBookings.filter((booking) => {
    if (selectedCategory === 'all') return true;
    return getHotelForPending(booking)?.property_type === selectedCategory;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
          {t('reviews.title', 'Сэтгэгдлүүд')}
        </h1>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 dark:border-gray-700">
          {(
            [
              ['my', t('reviews.myReviews', 'Your Reviews')],
              ['pending', t('reviews.pendingReviews', 'Pending Reviews')],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => {
                setActiveTab(val);
                setSelectedCategory('all');
              }}
              className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
                activeTab === val
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent'
              }`}
            >
              {label}
              {val === 'pending' && pendingBookings.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-600 text-white leading-none">
                  {pendingBookings.length > 99 ? '99+' : pendingBookings.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-5 mb-5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('reviews.categoryAll', 'Бүгд')} (
            {activeTab === 'my' ? reviews.length : pendingBookings.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count =
              activeTab === 'my'
                ? reviews.filter((r) => getHotelForReview(r)?.property_type === cat.id).length
                : pendingBookings.filter(
                    (b) => getHotelForPending(b)?.property_type === cat.id
                  ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="px-6 pb-6 space-y-4 ">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── My Reviews ── */}
        {!isLoading && activeTab === 'my' && (
          filteredReviews.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('reviews.noReviewsTitle', 'No reviews yet')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('reviews.noReviews', 'Complete a booking to write your first review!')}
              </p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700/60">
              {filteredReviews.map((review) => {
                const booking = allBookings.find((b) => b.id === review.booking);
                const hotel = getHotelForReview(review);
                const imageSrc = resolveHotelImageUrl(
                  hotel?.profile_image || booking?.hotel_image
                );

                return (
                  <div
                    key={review.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-6 last:mb-0"
                  >
                    {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[14px] font-semibold text-gray-600 dark:text-gray-300">
                          {user?.first_name?.charAt(0)?.toUpperCase() || 'Х'}
                        </span>
                      </div>
                      <div>
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white leading-tight">
                          {formatName(user?.first_name, user?.last_name)}
                        </div>
                        <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                          <span>{formatDateSlash(review.created_at?.slice(0, 10))}</span>
                        </div>
                      </div>
                    </div>

                 
                    <div className="flex flex-col items-start sm:items-end justify-start gap-1.5 shrink-0 sm:text-right">
                      <div className="flex items-center gap-1.5">
                        <span className="pt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {t('reviews.yourRating', 'Таны өгсөн үнэлгээ:')}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {booking && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center sm:justify-end gap-1.5 mt-0.5">
                          <span>
                            {formatDateSlash(booking.check_in)} - {formatDateSlash(booking.check_out)}
                          </span>
                          
                          {booking.room_type && (
                            <>
                              <span>/</span>
                              <span className="truncate">
                                {booking.room_type}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                    {/* Comment */}
                    {review.comment && (
                      <p className="px-4 pb-2 text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                    <hr className="w-auto mx-4 border-gray-200 dark:border-gray-700 mt-2" />

                    {/* Hotel Card */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                      {/* Image */}
                      <div className="w-full md:w-24 h-24 md:h-20 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 overflow-hidden relative">
                        {imageSrc ? (
                          hotel ? (
                            <Link href={`/hotel/${hotel.pk}`} className="block w-full h-full">
                              <Image
                                src={imageSrc}
                                alt={hotel.PropertyName}
                                fill
                                className="object-cover"
                              />
                            </Link>
                          ) : (
                            <Image
                              src={imageSrc}
                              alt={booking?.hotel_name ?? ''}
                              fill
                              className="object-cover"
                            />
                          )
                        ) : null}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        {hotel ? (
                          <Link href={`/hotel/${hotel.pk}`}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug hover:text-blue-600 transition-colors">
                              {hotel.PropertyName}
                            </h3>
                          </Link>
                        ) : (
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                            {booking?.hotel_name ?? '—'}
                          </h3>
                        )}

                        {hotel?.location && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {hotel.location}
                          </p>
                        )}

                        {(() => {
                          const rd = hotelRatingsMap.get(review.hotel);
                          const avg = rd?.avg_rating ?? 0;
                          const total = rd?.total ?? 0;
                          return (
                            <div className="flex items-center gap-5 mt-4">
                              <span className="bg-green-600 text-white text-xs font-medium px-1.5  rounded leading-none inline-flex items-center gap-1">
                                <span className="text-sm font-bold">{avg.toFixed(1)}</span>
                                <span>/5</span>
                              </span>
                              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                {total} {t('reviews.comment', 'сэтгэгдэл')}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {hotel && (
                        <div className="mt-12 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleViewReviews(hotel.pk)}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-block cursor-pointer"
                          >
                            {t('reviews.viewAllReviews', 'Бүх сэтгэгдэл үзэх')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Pending Reviews ── */}
        {!isLoading && activeTab === 'pending' && (
          filteredPendingBookings.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('reviews.noPendingTitle', 'All caught up!')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(
                  'reviews.noPendingReviews',
                  'No reviews pending. Complete more bookings to share your experiences!'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPendingBookings.map((booking) => {
                const hotel = getHotelForPending(booking);
                const hotelId = hotel?.pk || booking.hotel;
                const hasLink = hotelId && hotelId > 0;
                const nights =
                  booking.check_in && booking.check_out
                    ? Math.round(
                        (new Date(booking.check_out).getTime() -
                          new Date(booking.check_in).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0;

                const resolvedSrc = resolveHotelImageUrl(
                  hotel?.profile_image || booking.hotel_image
                );

                return (
                  <div
                    key={booking.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          {t('reviews.bookingNumber', 'Booking:')}{' '}
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {booking.booking_code}
                          </span>
                        </span>
                        <span>
                          {formatDateSlash(booking.check_in)} –{' '}
                          {formatDateSlash(booking.check_out)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('reviews.completed', 'Completed')}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                      {/* Image */}
                      <div className="w-full md:w-24 h-36 md:h-20 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 overflow-hidden relative">
                        {resolvedSrc ? (
                          hasLink ? (
                            <Link
                              href={`/hotel/${hotelId}`}
                              className="block w-full h-full"
                            >
                              <Image
                                src={resolvedSrc}
                                alt={hotel?.PropertyName || booking.hotel_name}
                                fill
                                className="object-cover"
                              />
                            </Link>
                          ) : (
                            <Image
                              src={resolvedSrc}
                              alt={booking.hotel_name}
                              fill
                              className="object-cover"
                            />
                          )
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                          {hasLink ? (
                            <Link
                              href={`/hotel/${hotelId}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {booking.hotel_name}
                            </Link>
                          ) : (
                            booking.hotel_name
                          )}
                        </h3>

                        {hotel?.location && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {hotel.location}
                          </p>
                        )}

                        {booking.room_type && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {booking.room_type}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="text-blue-600 font-medium">
                            {formatDateSlash(booking.check_in)}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-600 font-medium">
                            {formatDateSlash(booking.check_out)}
                          </span>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                        <div className="text-left md:text-right">
                          <div className="text-base font-bold text-gray-900 dark:text-white">
                            {booking.total_price.toLocaleString('mn-MN')} ₮
                          </div>
                          {nights > 0 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              {t('bookingFlow.nights', { count: nights })}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setReviewTarget(booking);
                            setSubmitError('');
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition font-medium"
                        >
                          {t('reviews.writeReview', 'Write Review')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ── Write Review Modal ── */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-[500px] mx-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('reviews.rateExperience', 'Rate Your Experience')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {reviewTarget.hotel_name}
                </p>
              </div>
              <button
                type="button"
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
                <div className="flex justify-center gap-10">
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
                  {t('reviews.whatDidYouLike', 'What did you like?')}{' '}
                  <span className="text-gray-400 font-normal">
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
                  {t('reviews.additionalComments', 'Additional Comments')}{' '}
                  <span className="text-gray-400 font-normal">
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

      <ReviewDrawer
        open={isReviewDrawerOpen}
        onOpenChange={setIsReviewDrawerOpen}
        reviewsData={selectedReviewHotelId ? hotelRatingsMap.get(selectedReviewHotelId) || null : null}
      />
    </div>
  );
}