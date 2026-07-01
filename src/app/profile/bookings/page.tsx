"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useToast } from '@/components/common/ToastContainer';
import { CustomerService } from '@/services/customerApi';
import { ApiService } from '@/services/api';
import { HotelService } from '@/services/hotelApi';
import { CustomerBooking } from '@/types/customer';
import { PropertyPolicy } from '@/types/api';
import { formatHotelLocation } from '@/utils/formatHotelLocation';
import { getCheckInSingleTimeDisplay, getCheckOutSingleTimeDisplay } from '@/utils/policyFormatters';
import {
  formatBookingCreatedAtMongolia,
  formatPendingPaymentCountdown,
  getPaymentResumeUrl,
  getPendingPaymentRemainingSeconds,
} from '@/utils/bookingPendingPayment';
import { dedupeCustomerBookings } from '@/utils/customerBookings';
import React from 'react';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'canceled' | 'finished';

interface BookingHotelMeta {
  id: number;
  imageUrl: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
}

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: 'text-blue-600',
  confirmed: 'text-green-600',
  finished: 'text-gray-500 dark:text-gray-400',
  canceled: 'text-red-500',
};

const EMOJI_RATINGS = ['😢', '😕', '😐', '😊', '😄'];
const LIKE_TAGS = ['cleanliness', 'location', 'food', 'service', 'value'];

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dev.kacc.mn';

function resolveImageUrl(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw.startsWith('/') ? `${BACKEND_ORIGIN}${raw}` : raw;
}

function getHotelMetaKey(booking: CustomerBooking): string {
  return booking.hotel ? String(booking.hotel) : booking.hotel_name;
}

export default function BookingsPage() {
  const { t } = useHydratedTranslation();
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const TABS: { label: string; value: StatusFilter }[] = useMemo(() => [
    { label: t('profileBookings.filters.all'), value: 'all' },
    { label: t('profileBookings.filters.pending'), value: 'pending' },
    { label: t('profileBookings.filters.confirmed'), value: 'confirmed' },
    { label: t('profileBookings.filters.completed'), value: 'finished' },
    { label: t('profileBookings.filters.cancelled'), value: 'canceled' },
  ], [t]);

  const STATUS_LABELS: Record<string, string> = useMemo(() => ({
    pending: t('profileBookings.filters.pending'),
    confirmed: t('profileBookings.filters.confirmed'),
    finished: t('profileBookings.filters.completed'),
    canceled: t('profileBookings.filters.cancelled'),
  }), [t]);

  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hotelMeta, setHotelMeta] = useState<Record<string, BookingHotelMeta>>({});
  const [, setTimerTick] = useState(0);

  const [cancelTarget, setCancelTarget] = useState<CustomerBooking | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<CustomerBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [reviewTarget, setReviewTarget] = useState<CustomerBooking | null>(null);
  const [emojiRating, setEmojiRating] = useState(3);
  const [likedTags, setLikedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const loadHotelMeta = useCallback(async (items: CustomerBooking[]) => {
    const groups = new Map<string, { hotelId?: number; hotelName: string; checkIn: string; checkOut: string; hotelImage?: string | null }>();

    items.forEach((booking) => {
      const key = getHotelMetaKey(booking);
      if (!groups.has(key)) {
        groups.set(key, {
          hotelId: booking.hotel || undefined,
          hotelName: booking.hotel_name,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          hotelImage: booking.hotel_image,
        });
      }
    });

    const entries = await Promise.all(
      [...groups.entries()].map(async ([key, info]) => {
        try {
          let hotelId = info.hotelId;

          if (!hotelId) {
            const byName = await HotelService.getHotelByName(info.hotelName);
            hotelId = byName?.pk;
          }

          if (!hotelId) {
            const today = new Date();
            const ci = new Date(today);
            ci.setDate(ci.getDate() + 30);
            const co = new Date(today);
            co.setDate(co.getDate() + 31);
            const fmt = (d: Date) => d.toISOString().split('T')[0];
            const search = await ApiService.searchHotels({
              name: info.hotelName,
              check_in: fmt(ci),
              check_out: fmt(co),
              adults: 2,
              children: 0,
              rooms: 1,
              acc_type: 'hotel',
            });
            hotelId = search.results?.[0]?.hotel_id;
          }

          if (!hotelId) return null;

          const [details, policies, approvedHotel] = await Promise.all([
            ApiService.getHotelDetails(hotelId, info.checkIn, info.checkOut).catch(() => null),
            ApiService.getPropertyPolicies(hotelId).catch(() => [] as PropertyPolicy[]),
            HotelService.getHotelById(hotelId),
          ]);

          const policy = policies[0];
          const cover = details?.images?.cover;
          const coverUrl = typeof cover === 'string' ? cover : (cover as { url?: string })?.url ?? '';
          const imageUrl =
            resolveImageUrl(info.hotelImage ?? undefined) ||
            resolveImageUrl(coverUrl) ||
            resolveImageUrl(approvedHotel?.profile_image ?? undefined);

          const address =
            formatHotelLocation(details?.location) ||
            approvedHotel?.location ||
            '';

          const checkInTime = getCheckInSingleTimeDisplay(policy);
          const checkOutTime = getCheckOutSingleTimeDisplay(policy);

          return [
            key,
            {
              id: hotelId,
              imageUrl,
              address,
              checkInTime,
              checkOutTime,
            },
          ] as [string, BookingHotelMeta];
        } catch {
          return null;
        }
      })
    );

    setHotelMeta(Object.fromEntries(entries.filter(Boolean) as [string, BookingHotelMeta][]));
  }, []);

  const fetchBookings = async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await CustomerService.getBookings(
        token,
        activeTab === 'all' ? undefined : activeTab
      );
      const uniqueBookings = dedupeCustomerBookings(res.bookings);
      setBookings(uniqueBookings);
      await loadHotelMeta(uniqueBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profileBookings.error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, token]);

  useEffect(() => {
    const hasPending = bookings.some((b) => b.status === 'pending');
    if (!hasPending) return;
    const id = setInterval(() => setTimerTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [bookings]);

  const handleCancel = async () => {
    if (!cancelTarget || !token) return;
    setIsCanceling(true);
    setCancelError('');
    try {
      await CustomerService.cancelBooking(token, {
        booking_code: cancelTarget.booking_code,
        pin_code: pinCode,
      });
      setCancelTarget(null);
      setPinCode('');
      fetchBookings();
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : t('profileBookings.error'));
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const idsToDelete = deleteTarget.booking_ids?.length
        ? deleteTarget.booking_ids
        : [deleteTarget.id];
      await Promise.all(idsToDelete.map((id) => CustomerService.deleteBooking(token, id)));
      setBookings((prev) => prev.filter((b) => b.booking_code !== deleteTarget.booking_code));
      setDeleteTarget(null);
      addToast({ type: 'success', title: t('profileBookings.deleteSuccess') });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t('profileBookings.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const getMetaForBooking = (booking: CustomerBooking): BookingHotelMeta | undefined =>
    hotelMeta[getHotelMetaKey(booking)];

  const getHotelId = (booking: CustomerBooking): number | undefined => {
    if (booking.hotel) return booking.hotel;
    return getMetaForBooking(booking)?.id;
  };

  const getHotelHref = (booking: CustomerBooking): string | null => {
    const hotelId = getHotelId(booking);
    return hotelId ? `/hotel/${hotelId}` : null;
  };

  const getConfirmationHref = (booking: CustomerBooking) => {
    const hotelId = getHotelId(booking);
    const params = new URLSearchParams({ code: booking.booking_code });
    if (hotelId) params.set('hotelId', String(hotelId));
    if (booking.hotel_name) params.set('hotelName', booking.hotel_name);
    if (booking.room_type) params.set('roomType', booking.room_type);
    return `/booking/confirmation?${params.toString()}`;
  };

  const handlePayNow = (booking: CustomerBooking) => {
    const hotelId = getHotelId(booking);
    if (!hotelId) return;

    const url = getPaymentResumeUrl({
      booking,
      hotelId,
      customerName: user?.first_name,
      customerLastName: user?.last_name,
      customerPhone: user?.phone,
      customerEmail: user?.email,
    });

    if (url) {
      router.push(url);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget || !token) return;

    const hotelId = getHotelId(reviewTarget);
    if (!hotelId) {
      setReviewError(t('profileBookings.error'));
      return;
    }

    setReviewError('');
    setIsSubmittingReview(true);
    try {
      const reviewData: { hotel: number; booking: number; rating: number; comment?: string } = {
        hotel: hotelId,
        booking: reviewTarget.id,
        rating: emojiRating,
      };
      if (comment.trim()) {
        reviewData.comment = comment.trim();
      }

      await CustomerService.createReview(token, reviewData);
      setReviewTarget(null);
      setComment('');
      setLikedTags([]);
      setEmojiRating(3);
      fetchBookings();
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : t('profileBookings.error'));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const toggleTag = (tag: string) =>
    setLikedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const formatDate = (d: string) => d?.replace(/-/g, '/') ?? '';
  const formatPrice = (p: number) => p.toLocaleString('mn-MN') + ' ₮';

  const formatStayLine = (date: string, time: string) => {
    const formatted = formatDate(date);
    return time ? `${formatted}, ${time}` : formatted;
  };
  const tabCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: bookings.length };
    
    bookings.forEach((booking) => {
      if (booking.status) {
        counts[booking.status] = (counts[booking.status] || 0) + 1;
      }
    });
    
    return counts;
  }, [bookings]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-h2 font-semibold text-gray-900 dark:text-white mb-5">{t('profileBookings.title')}</h1>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition font-medium ${activeTab === tab.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {tab.label} ({tabCounts[tab.value] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && error && (
          <div className="py-8 text-center text-sm text-red-500">{error}</div>
        )}

        {!isLoading && !error && bookings.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            {t('profileBookings.empty')}
          </div>
        )}

        {!isLoading && bookings.map((booking) => {
          const meta = getMetaForBooking(booking);
          const nights = booking.check_in && booking.check_out
            ? Math.round((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))
            : 0;
          const pendingSeconds = booking.status === 'pending'
            ? getPendingPaymentRemainingSeconds(booking.created_at)
            : 0;
          const hotelId = getHotelId(booking);
          const hotelHref = getHotelHref(booking);
          const canPay = booking.status === 'pending' && pendingSeconds > 0 && !!hotelId;

          return (
            <div key={booking.booking_code} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {t('profileBookings.bookingNumber')}{' '}
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{booking.booking_code}</span>
                  </span>
                  <span>
                    {t('profileBookings.date')}{' '}
                    {formatBookingCreatedAtMongolia(booking.created_at)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-medium ${STATUS_BADGE_STYLES[booking.status] ?? 'text-gray-500 dark:text-gray-400'}`}>
                    {STATUS_LABELS[booking.status] ?? booking.status_label}
                  </span>
                  {booking.has_added_rooms && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {t('profileBookings.roomAdded')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                {hotelHref ? (
                  <Link
                    href={hotelHref}
                    className="w-full md:w-24 h-36 md:h-20 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 overflow-hidden relative block hover:opacity-90 transition-opacity"
                  >
                    {meta?.imageUrl && (
                      <img
                        src={meta.imageUrl}
                        alt={booking.hotel_name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </Link>
                ) : (
                  <div className="w-full md:w-24 h-36 md:h-20 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 overflow-hidden relative">
                    {meta?.imageUrl && (
                      <img
                        src={meta.imageUrl}
                        alt={booking.hotel_name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {hotelHref ? (
                    <Link href={hotelHref} className="group block min-w-0">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-primary group-hover:underline">
                        {booking.hotel_name}
                      </span>
                      {meta?.address && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate block group-hover:text-primary group-hover:underline">
                          {meta.address}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{booking.hotel_name}</h3>
                      {meta?.address && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{meta.address}</p>
                      )}
                    </>
                  )}
                  {booking.room_type && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                      {booking.room_type}
                      {(booking.room_count ?? 1) > 1 && (
                        <span className="ml-1">
                          ({t('profileBookings.roomsCount', { count: booking.room_count })})
                        </span>
                      )}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                    <span className="text-blue-600 font-medium">
                      {formatStayLine(booking.check_in, meta?.checkInTime ?? '')}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-blue-600 font-medium">
                      {formatStayLine(booking.check_out, meta?.checkOutTime ?? '')}
                    </span>
                  </div>
                  {booking.status === 'pending' && pendingSeconds > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">
                      {t('profileBookings.paymentTimeLeft', {
                        time: formatPendingPaymentCountdown(pendingSeconds),
                      })}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-base font-bold text-gray-900 dark:text-white">{formatPrice(booking.total_price)}</div>
                    {nights > 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {t('profileBookings.nights', { count: nights })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap md:justify-end">
                    {booking.status === 'pending' && canPay && (
                      <button
                        type="button"
                        onClick={() => handlePayNow(booking)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition"
                      >
                        {t('profileBookings.payNow')}
                      </button>
                    )}

                    {booking.status === 'confirmed' && (
                      <Link
                        href={getConfirmationHref(booking)}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        {t('profileBookings.details')}
                      </Link>
                    )}

                    {booking.status === 'finished' && !booking.has_review && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewTarget(booking);
                          setReviewError('');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition"
                      >
                        {t('profileBookings.leaveReview')}
                      </button>
                    )}

                    {(booking.status === 'finished' || booking.status === 'canceled') && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(booking);
                          setDeleteError('');
                        }}
                        className="px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        {t('profileBookings.delete')}
                      </button>
                    )}

                    {booking.status === 'canceled' && hotelId && (
                      <Link
                        href={`/hotel/${hotelId}`}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        {t('profileBookings.reorder')}
                      </Link>
                    )}

                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(booking)}
                        className="px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        {t('profileBookings.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('profileBookings.cancelTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('profileBookings.cancelPinHint', { code: cancelTarget.booking_code })}
            </p>
            {cancelError && (
              <p className="text-sm text-red-500 mb-3">{cancelError}</p>
            )}
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder={t('profileBookings.pinCode')}
              maxLength={4}
              className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition mb-4 tracking-widest text-center"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {t('profileBookings.cancelBtn')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCanceling || pinCode.length < 4}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition disabled:opacity-50"
              >
                {isCanceling ? t('profileBookings.cancelling') : t('profileBookings.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('profileBookings.deleteTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('profileBookings.deleteHint', { code: deleteTarget.booking_code })}
            </p>
            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {t('profileBookings.cancelBtn')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition disabled:opacity-50"
              >
                {isDeleting ? t('profileBookings.deleting') : t('profileBookings.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-md mx-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-h3 font-semibold text-gray-900 dark:text-white">
                  {t('reviews.rateExperience', 'Rate Your Experience')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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

            <form onSubmit={handleSubmitReview} className="p-6">
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
                      className={`px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${likedTags.includes(tag)
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {t(`reviews.${tag}`, tag)}
                    </button>
                  ))}
                </div>
              </div>

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

              {reviewError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{reviewError}</p>
                </div>
              )}

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
                  disabled={isSubmittingReview}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmittingReview ? (
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
