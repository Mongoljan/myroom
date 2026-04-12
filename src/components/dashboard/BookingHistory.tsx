'use client';

// Inline SVG icons — no Lucide dependency
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { CustomerService } from '@/services/customerApi';
import { CustomerBooking } from '@/types/customer';

export default function BookingHistory() {
  const { token, isLoading: authLoading } = useAuth();
  const { t } = useHydratedTranslation();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'finished' | 'canceled'>('all');
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authLoadingRef = useRef(authLoading);
  authLoadingRef.current = authLoading;

  useEffect(() => {
    const fetchBookings = async () => {
      if (authLoadingRef.current || !token) return;
      try {
        setIsLoading(true);
        const response = await CustomerService.getBookings(
          token,
          filter === 'all' ? undefined : filter
        );
        setBookings(response.bookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [token, filter]);

  const filters = [
    { key: 'all' as const, label: t('dashboard.all', 'All') },
    { key: 'confirmed' as const, label: t('dashboard.confirmed', 'Confirmed') },
    { key: 'finished' as const, label: t('dashboard.finished', 'Finished') },
    { key: 'canceled' as const, label: t('dashboard.canceled', 'Canceled') },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('dashboard.bookingHistory', 'Booking History')}</h2>

        {/* Filter tabs */}
        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter === f.key
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.loadingBookings', 'Loading bookings...')}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <CalendarIcon className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.noBookings', 'No bookings found')}</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{booking.hotel_name}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{booking.room_type}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>
                    {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' → '}
                    {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {booking.has_review && (
                    <>
                      <span className="text-gray-300">•</span>
                      <StarIcon className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{t('dashboard.reviewed', 'Reviewed')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-2 ml-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : booking.status === 'finished'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : booking.status === 'canceled'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {booking.status_label}
                </span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₮{booking.total_price.toLocaleString()}</p>
                <p className="text-xs text-gray-400 flex items-center gap-0.5">
                  {booking.booking_code}
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All */}
      {bookings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
            {t('dashboard.viewAllBookings', 'View All Bookings')}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
