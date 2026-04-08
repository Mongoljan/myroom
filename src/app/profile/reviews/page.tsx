"use client";

import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { CustomerBooking, Review } from '@/types/customer';

type ReviewTab = 'my' | 'pending';

const EMOJI_RATINGS = ['😢', '😕', '😐', '😊', '😄'];

const LIKE_TAGS = ['Цэвэрлэгээ', 'Байршил', 'Хоол', 'Үйлчилгээ', 'Үнэ цэнэ'];

export default function ReviewsPage() {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<ReviewTab>('my');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingBookings, setPendingBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    Promise.all([
      CustomerService.getReviews(token),
      CustomerService.getBookings(token, 'finished'),
    ])
      .then(([revRes, bookRes]) => {
        setReviews(revRes.reviews);
        // DEBUG: log raw booking fields to find hotel ID key
        if (bookRes.bookings.length > 0) {
          console.log('[DEBUG] Raw booking fields:', JSON.stringify(bookRes.bookings[0]));
        }
        // pending = finished bookings without a review
        setPendingBookings(bookRes.bookings.filter((b) => !b.has_review));
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget || !token) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await CustomerService.createReview(token, {
        hotel: reviewTarget.hotel,
        booking: reviewTarget.id,
        rating: emojiRating,
        comment,
      });
      setPendingBookings((prev) => prev.filter((b) => b.id !== reviewTarget.id));
      setReviewTarget(null);
      setComment('');
      setLikedTags([]);
      setEmojiRating(3);
      // Refresh reviews
      CustomerService.getReviews(token).then((res) => setReviews(res.reviews));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
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
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-5">Сэтгэгдлүүд</h1>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100">
          {([['my', 'Таны үлдээсэн сэтгэгдэл'], ['pending', 'Хүлээгдэж буй']] as const).map(
            ([val, label]) => (
              <button
                key={val}
                onClick={() => setActiveTab(val)}
                className={`px-5 py-2.5 text-sm transition border-b-2 -mb-px ${
                  activeTab === val
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
            <p className="text-sm text-gray-400 text-center py-10">Үлдээсэн сэтгэгдэл байхгүй байна.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                  {/* Reviewer header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-medium">
                        Z
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Та</p>
                        <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Таны өгсөн үнэлгээ:</span>
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
                    <p className="mt-3 text-sm text-gray-600">{review.comment}</p>
                  )}

                  {/* Hotel card */}
                  <div className="mt-3 border border-gray-100 rounded-lg p-3 flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Буудал #{review.hotel}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white bg-green-500 px-1.5 py-0.5 rounded font-medium">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Pending Reviews ── */}
        {!isLoading && activeTab === 'pending' && (
          pendingBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Үнэлгээг хүлээж буй захиалга байхгүй байна.</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                    <span>Захиалгын дугаар: <span className="text-gray-800 font-medium">{booking.booking_code}</span></span>
                    <span>Огноо: {formatDate(booking.created_at?.slice(0, 10))}</span>
                    <span className="text-gray-500">Биелсэн</span>
                  </div>
                  <div className="flex items-start gap-4 p-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{booking.hotel_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{booking.room_type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-sm font-semibold text-gray-900">
                        {booking.total_price.toLocaleString('mn-MN')} ₮
                      </span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">
                          Устгах
                        </button>
                        <button
                          onClick={() => { setReviewTarget(booking); setSubmitError(''); }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition"
                        >
                          Үнэлгээ өгөх
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
          <div className="bg-white rounded-xl border border-gray-200 p-5 w-full max-w-xs shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Та үнэлгээ өгнө үү.</h2>
              <button onClick={() => setReviewTarget(null)} className="text-gray-400 hover:text-gray-600">
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
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Like tags */}
              <p className="text-xs text-gray-500 mb-2">Танд юу нь хамгийн их таалагдсан бэ?</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {LIKE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs border transition ${
                      likedTags.includes(tag)
                        ? 'bg-blue-50 border-blue-400 text-blue-600'
                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Сэтгэгдэл бичих"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-3"
              />

              {submitError && (
                <p className="text-xs text-red-500 mb-2">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Илгээж байна...' : 'Илгээх'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
