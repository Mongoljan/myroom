"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  finished: 'text-gray-500',
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
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-5">Захиалгын түүх</h1>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition font-medium ${
                activeTab === tab.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          <div key={booking.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Booking card header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Захиалгын дугаар: <span className="text-gray-800 font-medium">{booking.booking_code}</span></span>
                <span>Огноо: {formatDate(booking.created_at?.slice(0, 10))}</span>
              </div>
              <span className={`text-sm font-medium ${STATUS_STYLES[booking.status] ?? 'text-gray-500'}`}>
                {STATUS_LABELS[booking.status] ?? booking.status_label}
              </span>
            </div>

            {/* Booking card body */}
            <div className="flex items-start gap-4 p-4">
              {/* Hotel image placeholder */}
              <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0 overflow-hidden relative">
                <div className="w-full h-full bg-gray-200" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{booking.hotel_name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{booking.room_type}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <div>
                    <span className="text-blue-600 font-medium">{formatDate(booking.check_in)}</span>
                    <span className="mx-1.5">-</span>
                    <span className="text-blue-600 font-medium">{formatDate(booking.check_out)}</span>
                  </div>
                </div>
                {booking.status === 'canceled' && (
                  <p className="text-xs text-green-600 mt-1">
                    Буцаан олгох дүн: {formatPrice(Math.round(booking.total_price * 0.5))} (орсон)
                  </p>
                )}
              </div>

              {/* Price + actions */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base font-semibold text-gray-900">{formatPrice(booking.total_price)}</div>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'confirmed' && (
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">
                      Дэлгэрэнгүй
                    </button>
                  )}
                  {booking.status === 'pending' && (
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">
                      Төлбөр төлөх
                    </button>
                  )}
                  {(booking.status === 'finished' || booking.status === 'canceled') && (
                    <>
                      <button
                        onClick={() => { setCancelTarget(booking); setPinCode(''); setCancelError(''); }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition"
                      >
                        Устгах
                      </button>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition">
                        Дахин захиалах
                      </button>
                    </>
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Захиалга цуцлах</h2>
            <p className="text-sm text-gray-500 mb-4">
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
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition mb-4 tracking-widest text-center"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
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
