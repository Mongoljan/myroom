"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { CustomerService } from '@/services/customerApi';
import { ApiService } from '@/services/api';
import { CustomerBooking } from '@/types/customer';
import {
  buildBookingPaymentUrl,
  canResumePaymentForBooking,
  getActivePaymentSession,
} from '@/utils/pendingPaymentSession';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'canceled' | 'finished';

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-blue-600',
  confirmed: 'text-green-600',
  finished: 'text-gray-500 dark:text-gray-400',
  canceled: 'text-red-500',
};

export default function BookingsPage() {
  const { t } = useHydratedTranslation();
  const { token } = useAuth();

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

  // hotelMeta: keyed by hotel_name → { imageUrl, id }
  const [hotelMeta, setHotelMeta] = useState<Record<string, { imageUrl: string; id: number }>>({});

  const [cancelTarget, setCancelTarget] = useState<CustomerBooking | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const fetchBookings = async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await CustomerService.getBookings(
        token,
        activeTab === 'all' ? undefined : activeTab
      );
      setBookings(res.bookings);

      // Bookings API has no hotel ID — search by hotel name to get ID + cover image
      const uniqueNames = [...new Set(res.bookings.map((b) => b.hotel_name).filter(Boolean))];
      const today = new Date();
      const ci = new Date(today); ci.setDate(ci.getDate() + 30);
      const co = new Date(today); co.setDate(co.getDate() + 31);
      const fmt = (d: Date) => d.toISOString().split('T')[0];

      const metaEntries = await Promise.all(
        uniqueNames.map(async (name) => {
          try {
            const result = await ApiService.searchHotels({
              name,
              check_in: fmt(ci),
              check_out: fmt(co),
              adults: 2, children: 0, rooms: 1, acc_type: 'hotel',
            });
            const hotel = result.results?.[0];
            if (!hotel) return null;
            const cover = hotel.images?.cover;
            const rawUrl = typeof cover === 'string' ? cover : (cover as { url?: string })?.url ?? '';
            const imageUrl = rawUrl
              ? (rawUrl.startsWith('/') ? `https://dev.kacc.mn${rawUrl}` : rawUrl)
              : '';
            return [name, { imageUrl, id: hotel.hotel_id }] as [string, { imageUrl: string; id: number }];
          } catch {
            return null;
          }
        })
      );
      setHotelMeta(Object.fromEntries(metaEntries.filter(Boolean) as [string, { imageUrl: string; id: number }][]));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profileBookings.error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [activeTab, token]);

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
      setCancelError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (d: string) => d?.replace(/-/g, '/') ?? '';
  const formatPrice = (p: number) => p.toLocaleString('mn-MN') + ' ₮';

  const getDetailsHref = (booking: CustomerBooking) => {
    const hotelId = hotelMeta[booking.hotel_name]?.id ?? booking.hotel;
    if (booking.status === 'pending' && canResumePaymentForBooking(booking.booking_code)) {
      const session = getActivePaymentSession();
      if (session) return buildBookingPaymentUrl(session.context);
    }
    return `/hotel/${hotelId}`;
  };

  const handleTabChange = (value: StatusFilter) => {
    setActiveTab(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-h2 font-semibold text-gray-900 dark:text-white mb-5">{t('profileBookings.title')}</h1>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition font-medium ${
                activeTab === tab.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label}
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
          const nights = booking.check_in && booking.check_out
            ? Math.round((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))
            : 0;

          return (
          <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* Booking card header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{t('profileBookings.bookingNumber')} <span className="text-gray-800 dark:text-gray-200 font-medium">{booking.booking_code}</span></span>
                <span>{t('profileBookings.date')} {formatDate(booking.created_at?.slice(0, 10))}</span>
              </div>
              <span className={`text-sm font-medium ${STATUS_STYLES[booking.status] ?? 'text-gray-500 dark:text-gray-400'}`}>
                {STATUS_LABELS[booking.status] ?? booking.status_label}
              </span>
            </div>

            {/* Booking card body */}
            <div className="flex items-center gap-4 p-4">
              {/* Hotel image */}
              <div className="w-24 h-20 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 overflow-hidden relative">
                {hotelMeta[booking.hotel_name]?.imageUrl && (
                  <img
                    src={hotelMeta[booking.hotel_name].imageUrl}
                    alt={booking.hotel_name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{booking.hotel_name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{booking.room_type}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-blue-600 font-medium">{formatDate(booking.check_in)}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-blue-600 font-medium">{formatDate(booking.check_out)}</span>
                </div>
              </div>

              {/* Price + actions */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base font-bold text-gray-900 dark:text-white">{formatPrice(booking.total_price)}</div>
                  {nights > 0 && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('profileBookings.nights', { count: nights })}</p>}
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  <Link
                    href={getDetailsHref(booking)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {t('profileBookings.details')}
                  </Link>
                  {booking.status === 'finished' && !booking.has_review && (
                    <Link
                      href="/profile/reviews"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition"
                    >
                      {t('profileBookings.leaveReview')}
                    </Link>
                  )}
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
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

      {/* Cancel modal */}
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
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {t('profileBookings.cancelBtn')}
              </button>
              <button
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
    </div>
  );
}
