'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Search,
  AlertCircle
} from 'lucide-react';
import { CheckBookingResponse, BookingDetails } from '@/types/api';
import { ApiService, formatCurrency, formatDate } from '@/services/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface DateChangeModalProps {
  booking: BookingDetails;
  bookingCode: string;
  pinCode: string;
  onClose: () => void;
  onUpdate: () => void;
}

function DateChangeModal({ booking, bookingCode, pinCode, onClose, onUpdate }: DateChangeModalProps) {
  const { t } = useHydratedTranslation();
  const [newCheckIn, setNewCheckIn] = useState(booking.check_in);
  const [newCheckOut, setNewCheckOut] = useState(booking.check_out);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ApiService.changeDates({
        booking_code: bookingCode,
        pin_code: pinCode,
        check_in: newCheckIn,
        check_out: newCheckOut,
      });
      alert(t('booking.manage.dateChangeSuccess', 'Өдөр амжилттай солигдлоо!'));
      onUpdate();
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t('booking.manage.dateChangeFailed', 'Өдөр солиход алдаа гарлаа');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{t('booking.manage.changeDatesTitle', 'Өдөр солих')}</h3>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('booking.manage.newCheckIn', 'Шинэ орох өдөр')}
            </label>
            <input
              type="date"
              value={newCheckIn}
              onChange={(e) => setNewCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('booking.manage.newCheckOut', 'Шинэ гарах өдөр')}
            </label>
            <input
              type="date"
              value={newCheckOut}
              onChange={(e) => setNewCheckOut(e.target.value)}
              min={newCheckIn}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel', 'Цуцлах')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('booking.manage.updating', 'Шинэчилж байна...') : t('booking.manage.updateDates', 'Өдөр шинэчлэх')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ManageBookingContent() {
  const { t } = useHydratedTranslation();
  const searchParams = useSearchParams();
  const [bookingCode, setBookingCode] = useState(searchParams.get('code') || '');
  const [pinCode, setPinCode] = useState(searchParams.get('pin') || '');
  const [bookingData, setBookingData] = useState<CheckBookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDateModal, setShowDateModal] = useState<BookingDetails | null>(null);
  const [autoSearched, setAutoSearched] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!bookingCode || !pinCode) return;

    setLoading(true);
    setError('');

    try {
      const data = await ApiService.checkBooking(bookingCode, pinCode);
      setBookingData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('booking.manage.errorFetch', 'Захиалга олдсонгүй'));
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  }, [bookingCode, pinCode, t]);

  const handleAction = async (action: 'confirm' | 'cancel') => {
    if (!confirm(action === 'confirm' 
      ? t('booking.manage.confirmAction', 'Та захиалгаа баталгаажуулахдаа итгэлтэй байна уу?')
      : t('booking.manage.cancelAction', 'Та захиалгаа цуцлахдаа итгэлтэй байна уу?')
    )) {
      return;
    }

    setActionLoading(action);
    setError('');
    try {
      if (action === 'confirm') {
        await ApiService.confirmBooking({ booking_code: bookingCode, pin_code: pinCode });
      } else {
        await ApiService.cancelBooking({ booking_code: bookingCode, pin_code: pinCode });
      }
      await fetchBooking(); // Refresh data
      // Show success message
      alert(action === 'confirm' 
        ? t('booking.manage.confirmSuccess', 'Захиалга амжилттай баталгаажлаа!')
        : t('booking.manage.cancelSuccess', 'Захиалга амжилттай цуцлагдлаа!')
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} booking`;
      setError(errorMessage);
      alert(t('booking.manage.actionError', 'Алдаа гарлаа: ') + errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'finished':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-900 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'finished':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Auto-search when code and pin are provided in URL
  useEffect(() => {
    const urlCode = searchParams.get('code');
    const urlPin = searchParams.get('pin');
    
    if (urlCode && urlPin && !autoSearched && !loading) {
      setBookingCode(urlCode);
      setPinCode(urlPin);
      setAutoSearched(true);
    }
  }, [searchParams, autoSearched, loading]);

  // Fetch booking when codes are set from URL
  useEffect(() => {
    if (autoSearched && bookingCode && pinCode && !bookingData && !error && !loading) {
      fetchBooking();
    }
  }, [autoSearched, bookingCode, pinCode, bookingData, error, loading, fetchBooking]);

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('booking.manage.title', 'Захиалгаа удирдах')}
            </h1>
            <p className="text-gray-800">
              {t('booking.manage.subtitle', 'Захиалгын код болон PIN кодоо оруулж захиалгаа харах, удирдах')}
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Auto-filled notification */}
            {autoSearched && bookingCode && pinCode && !bookingData && !error && (
              <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-slate-900" />
                <p className="text-sm text-slate-800">
                  {t('booking.manage.autoFilled', 'Захиалгын мэдээлэл автоматаар бөглөгдлөө')}
                </p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); fetchBooking(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('booking.manage.bookingCode', 'Захиалгын код')}
                  </label>
                  <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    placeholder={t('booking.manage.enterBookingCode', 'Захиалгын код оруулна уу')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('booking.manage.pinCode', 'PIN код')}
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder={t('booking.manage.enterPinCode', 'PIN код оруулна уу')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !bookingCode || !pinCode}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-gray-400 disabled:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
                {loading ? t('booking.manage.searching', 'Хайж байна...') : t('booking.manage.findBooking', 'Захиалга хайх')}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Booking Details */}
          {bookingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{t('booking.manage.bookingSummary', 'Захиалгын тойм')}</h2>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingData.status)}`}>
                    {getStatusIcon(bookingData.status)}
                    {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">{t('booking.manage.bookingInfo', 'Захиалгын мэдээлэл')}</h3>
                    <div className="space-y-1 text-gray-800">
                      <p><span className="font-medium">{t('booking.manage.code', 'Код')}:</span> {bookingCode}</p>
                      <p><span className="font-medium">{t('booking.manage.pin', 'PIN')}:</span> {pinCode}</p>
                      <p><span className="font-medium">{t('booking.manage.total', 'Нийт')}:</span> {formatCurrency(bookingData.total_sum)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">{t('booking.manage.guestInfo', 'Зочны мэдээлэл')}</h3>
                    <div className="space-y-1 text-gray-800">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {bookingData.bookings[0]?.customer_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {bookingData.bookings[0]?.customer_phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {bookingData.bookings[0]?.customer_email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">{t('booking.manage.actions', 'Үйлдлүүд')}</h3>
                    <div className="space-y-2">
                      {bookingData.status === 'pending' && (
                        <button
                          onClick={() => handleAction('confirm')}
                          disabled={actionLoading !== null}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {actionLoading === 'confirm' ? t('booking.manage.confirming', 'Баталгаажуулж байна...') : t('booking.manage.confirmBtn', 'Баталгаажуулах')}
                        </button>
                      )}
                      {bookingData.status !== 'cancelled' && bookingData.status !== 'finished' && (
                        <button
                          onClick={() => handleAction('cancel')}
                          disabled={actionLoading !== null}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {actionLoading === 'cancel' ? t('booking.manage.cancelling', 'Цуцлаж байна...') : t('booking.manage.cancelBtn', 'Захиалга цуцлах')}
                        </button>
                      )}
                      {bookingData.status === 'confirmed' && (
                        <div className="text-xs text-gray-600 text-center p-2 bg-green-50 rounded-lg">
                          {t('booking.manage.alreadyConfirmed', 'Захиалга баталгаажсан байна')}
                        </div>
                      )}
                      {(bookingData.status === 'cancelled' || bookingData.status === 'finished') && (
                        <div className="text-xs text-gray-600 text-center p-2 bg-gray-50 rounded-lg">
                          {t('booking.manage.noActions', 'Үйлдэл хийх боломжгүй')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Bookings */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">{t('booking.manage.roomReservations', 'Өрөөний захиалга')}</h2>
                {bookingData.bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                          <span className="text-sm text-gray-800">{t('booking.manage.room', 'Өрөө')} {booking.room}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-800">
                            <Calendar className="w-4 h-4" />
                            <span>{t('booking.manage.checkIn', 'Орох')}: {formatDate(booking.check_in)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-800">
                            <Calendar className="w-4 h-4" />
                            <span>{t('booking.manage.checkOut', 'Гарах')}: {formatDate(booking.check_out)}</span>
                          </div>
                        </div>

                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(booking.total_price)}
                        </div>
                      </div>

                      {booking.status !== 'cancelled' && booking.status !== 'finished' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDateModal(booking)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-50 text-sm transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            {t('booking.manage.changeDates', 'Өдөр солих')}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Date Change Modal */}
      {showDateModal && (
        <DateChangeModal
          booking={showDateModal}
          bookingCode={bookingCode}
          pinCode={pinCode}
          onClose={() => setShowDateModal(null)}
          onUpdate={fetchBooking}
        />
      )}
    </div>
  );
}