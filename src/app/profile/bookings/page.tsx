"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerService } from '@/services/customerApi';
import { CustomerBooking } from '@/types/customer';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'canceled' | 'finished';

const TABS: { label: string; value: StatusFilter }[] = [
  { label: 'Бүгд', value: 'all' },
  { label: 'Төлбөр хүлээгдэж буй', value: 'pending' },
  { label: 'Баталгаажсан', value: 'confirmed' },
  { label: 'Биелсэн', value: 'finished' },
  { label: 'Цуцлагдсан', value: 'canceled' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-blue-600',
  confirmed: 'text-green-600',
  finished: 'text-gray-500 dark:text-gray-400',
  canceled: 'text-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Төлбөр хүлээгдэж буй',
  confirmed: 'Баталгаажсан',
  finished: 'Биелсэн',
  canceled: 'Цуцлагдсан',
};

export default function BookingsPage() {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа.');
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Захиалгын түүх</h1>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
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
            Захиалга олдсонгүй.
          </div>
        )}

        {!isLoading && bookings.map((booking) => (
          <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* Booking card header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Захиалгын дугаар: <span className="text-gray-800 dark:text-gray-200 font-medium">{booking.booking_code}</span></span>
                <span>Огноо: {formatDate(booking.created_at?.slice(0, 10))}</span>
              </div>
              <span className={`text-sm font-medium ${STATUS_STYLES[booking.status] ?? 'text-gray-500 dark:text-gray-400'}`}>
                {STATUS_LABELS[booking.status] ?? booking.status_label}
              </span>
            </div>

            {/* Booking card body */}
            <div className="flex items-start gap-4 p-4">
              {/* Hotel image placeholder */}
              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0 overflow-hidden relative">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-600" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{booking.hotel_name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{booking.room_type}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="text-blue-600 font-medium">{formatDate(booking.check_in)}</span>
                    <span className="mx-1.5">-</span>
                    <span className="text-blue-600 font-medium">{formatDate(booking.check_out)}</span>
                  </div>
                </div>

              </div>

              {/* Price + actions */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">{formatPrice(booking.total_price)}</div>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  {/* Details link — always visible; manage page lets user enter pin */}
                  <Link
                    href={`/booking/manage?booking_code=${booking.booking_code}`}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Дэлгэрэнгүй
                  </Link>
                  {/* Write review — only for finished bookings without a review */}
                  {booking.status === 'finished' && !booking.has_review && (
                    <Link
                      href="/profile/reviews"
                      className="px-3 py-1.5 border border-blue-300 dark:border-blue-600 rounded-lg text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                    >
                      Үнэлгээ бичих
                    </Link>
                  )}
                  {/* Re-book — link to hotel page */}
                  {(booking.status === 'finished' || booking.status === 'canceled') && (
                    <Link
                      href={`/hotel/${booking.hotel}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition"
                    >
                      Дахин захиалах
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Захиалга цуцлах</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Захиалга <strong>{cancelTarget.booking_code}</strong>-г цуцлахын тулд pin кодоо оруулна уу.
            </p>
            {cancelError && (
              <p className="text-sm text-red-500 mb-3">{cancelError}</p>
            )}
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="PIN код"
              maxLength={4}
              className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition mb-4 tracking-widest text-center"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Болих
              </button>
              <button
                onClick={handleCancel}
                disabled={isCanceling || pinCode.length < 4}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition disabled:opacity-50"
              >
                {isCanceling ? 'Цуцалж байна...' : 'Цуцлах'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
