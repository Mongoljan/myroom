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

interface DateChangeModalProps {
  booking: BookingDetails;
  bookingCode: string;
  pinCode: string;
  onClose: () => void;
  onUpdate: () => void;
}

function DateChangeModal({ booking, bookingCode, pinCode, onClose, onUpdate }: DateChangeModalProps) {
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
      onUpdate();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to change dates');
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
          <h3 className="text-xl font-bold text-gray-900">Change Dates</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Check-in Date
            </label>
            <input
              type="date"
              value={newCheckIn}
              onChange={(e) => setNewCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Check-out Date
            </label>
            <input
              type="date"
              value={newCheckOut}
              onChange={(e) => setNewCheckOut(e.target.value)}
              min={newCheckIn}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Dates'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ManageBookingContent() {
  const searchParams = useSearchParams();
  const [bookingCode, setBookingCode] = useState(searchParams.get('code') || '');
  const [pinCode, setPinCode] = useState(searchParams.get('pin') || '');
  const [bookingData, setBookingData] = useState<CheckBookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDateModal, setShowDateModal] = useState<BookingDetails | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!bookingCode || !pinCode) return;

    setLoading(true);
    setError('');

    try {
      const data = await ApiService.checkBooking(bookingCode, pinCode);
      setBookingData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to find booking');
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  }, [bookingCode, pinCode]);

  const handleAction = async (action: 'confirm' | 'cancel') => {
    setActionLoading(action);
    try {
      if (action === 'confirm') {
        await ApiService.confirmBooking({ booking_code: bookingCode, pin_code: pinCode });
      } else {
        await ApiService.cancelBooking({ booking_code: bookingCode, pin_code: pinCode });
      }
      await fetchBooking(); // Refresh data
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${action} booking`);
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
        return 'text-gray-700 bg-gray-100';
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

  useEffect(() => {
    if (searchParams.get('code') && searchParams.get('pin')) {
      fetchBooking();
    }
  }, [searchParams, fetchBooking]);

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
              Manage Your Booking
            </h1>
            <p className="text-gray-600">
              Enter your booking code and PIN to view and manage your reservation
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={(e) => { e.preventDefault(); fetchBooking(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Code
                  </label>
                  <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    placeholder="Enter booking code"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter PIN code"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !bookingCode || !pinCode}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Find Booking'}
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
                  <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingData.status)}`}>
                    {getStatusIcon(bookingData.status)}
                    {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Booking Info</h3>
                    <div className="space-y-1 text-gray-600">
                      <p><span className="font-medium">Code:</span> {bookingCode}</p>
                      <p><span className="font-medium">PIN:</span> {pinCode}</p>
                      <p><span className="font-medium">Total:</span> {formatCurrency(bookingData.total_sum)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Guest Information</h3>
                    <div className="space-y-1 text-gray-600">
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
                    <h3 className="font-medium text-gray-900">Actions</h3>
                    <div className="space-y-2">
                      {bookingData.status === 'pending' && (
                        <button
                          onClick={() => handleAction('confirm')}
                          disabled={actionLoading === 'confirm'}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {actionLoading === 'confirm' ? 'Confirming...' : 'Confirm'}
                        </button>
                      )}
                      {bookingData.status !== 'cancelled' && bookingData.status !== 'finished' && (
                        <button
                          onClick={() => handleAction('cancel')}
                          disabled={actionLoading === 'cancel'}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Bookings */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Room Reservations</h2>
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
                          <span className="text-sm text-gray-600">Room {booking.room}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Check-in: {formatDate(booking.check_in)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Check-out: {formatDate(booking.check_out)}</span>
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
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 text-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                            Change Dates
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