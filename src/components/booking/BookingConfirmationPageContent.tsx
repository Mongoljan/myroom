'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingConfirmationView from '@/components/booking/BookingConfirmationView';
import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';
import { BookingService } from '@/services/bookingApi';
import { ApiService } from '@/services/api';
import { CustomerService } from '@/services/customerApi';
import { useAuth } from '@/contexts/AuthContext';
import { calculateNights } from '@/utils/booking';
import {
  buildBookingResultFromCheck,
  buildBookingResultFromCustomer,
  buildCheckedBookingFromCustomer,
  buildRoomsFromCheck,
  buildRoomsFromCustomer,
  splitCustomerName,
} from '@/utils/bookingConfirmationLoader';
import { getBookingPin, saveBookingPin } from '@/utils/bookingPinStorage';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import type { CheckBookingResponse, CreateBookingResponse, PropertyPolicy } from '@/types/api';

export default function BookingConfirmationPageContent() {
  const { t } = useHydratedTranslation();
  const { token, user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const bookingCode = searchParams.get('code') || '';
  const urlPin = searchParams.get('pin') || '';
  const hotelIdParam = parseInt(searchParams.get('hotelId') || '0', 10);
  const hotelName = searchParams.get('hotelName') || '';
  const roomType = searchParams.get('roomType') || '';

  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsPin, setNeedsPin] = useState(false);
  const [ready, setReady] = useState(false);

  const [bookingResult, setBookingResult] = useState<CreateBookingResponse | null>(null);
  const [checkedBooking, setCheckedBooking] = useState<CheckBookingResponse | null>(null);
  const [rooms, setRooms] = useState<BookingConfirmationRoom[]>([]);
  const [hotelId, setHotelId] = useState(hotelIdParam);
  const [hotelDetails, setHotelDetails] = useState<any | null>(null);
  const [hotelPolicy, setHotelPolicy] = useState<PropertyPolicy | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const applyConfirmationState = useCallback(
    async (params: {
      bookingResult: CreateBookingResponse;
      checked: CheckBookingResponse;
      resolvedHotelId: number;
      resolvedCheckIn: string;
      resolvedCheckOut: string;
      resolvedRooms: BookingConfirmationRoom[];
      customerFirstName: string;
      customerLastName: string;
      customerPhone: string;
      customerEmail: string;
      pinCode?: string;
    }) => {
      const [hotelData, policyData] = await Promise.all([
        ApiService.getHotelDetails(params.resolvedHotelId, params.resolvedCheckIn, params.resolvedCheckOut).catch(
          () => null
        ),
        ApiService.getPropertyPolicies(params.resolvedHotelId).catch(() => [] as PropertyPolicy[]),
      ]);

      const resolvedNights = calculateNights(
        new Date(params.resolvedCheckIn),
        new Date(params.resolvedCheckOut)
      );

      if (params.pinCode) {
        saveBookingPin(params.bookingResult.booking_code, params.pinCode);
      }

      setBookingResult(params.bookingResult);
      setCheckedBooking(params.checked);
      setRooms(params.resolvedRooms);
      setHotelId(params.resolvedHotelId);
      setHotelDetails(hotelData);
      setHotelPolicy(policyData[0] || null);
      setCheckIn(params.resolvedCheckIn);
      setCheckOut(params.resolvedCheckOut);
      setNights(resolvedNights);
      setTotalPrice(params.checked.total_sum);
      setCustomerName(params.customerFirstName);
      setCustomerLastName(params.customerLastName);
      setCustomerPhone(params.customerPhone);
      setCustomerEmail(params.customerEmail);
      setNeedsPin(false);
      setReady(true);
    },
    []
  );

  const loadFromPin = useCallback(
    async (code: string, pin: string) => {
      if (!code || !pin) return;

      setLoading(true);
      setError('');

      try {
        const checked = await BookingService.checkBooking(code, pin);
        const first = checked.bookings[0];
        if (!first) {
          throw new Error(t('booking.manage.errorFetch', 'Захиалга олдсонгүй'));
        }

        const { firstName, lastName } = splitCustomerName(first.customer_name);

        await applyConfirmationState({
          bookingResult: buildBookingResultFromCheck(code, pin, checked),
          checked,
          resolvedHotelId: hotelIdParam > 0 ? hotelIdParam : first.hotel,
          resolvedCheckIn: first.check_in,
          resolvedCheckOut: first.check_out,
          resolvedRooms: buildRoomsFromCheck(checked, roomType || undefined),
          customerFirstName: firstName,
          customerLastName: lastName,
          customerPhone: first.customer_phone,
          customerEmail: first.customer_email,
          pinCode: pin,
        });
      } catch (err) {
        setReady(false);
        setError(err instanceof Error ? err.message : t('booking.manage.errorFetch', 'Захиалга олдсонгүй'));
        if (!token) setNeedsPin(true);
      } finally {
        setLoading(false);
      }
    },
    [applyConfirmationState, hotelIdParam, roomType, t, token]
  );

  const loadFromAuthenticatedBooking = useCallback(async () => {
    if (!token || !bookingCode) return false;

    setLoading(true);
    setError('');

    try {
      const res = await CustomerService.getBookings(token);
      const booking = res.bookings.find((item) => item.booking_code === bookingCode);
      if (!booking) {
        return false;
      }

      const checked = buildCheckedBookingFromCustomer(booking, user);
      const resolvedHotelId = hotelIdParam > 0 ? hotelIdParam : booking.hotel;

      await applyConfirmationState({
        bookingResult: buildBookingResultFromCustomer(booking),
        checked,
        resolvedHotelId,
        resolvedCheckIn: booking.check_in,
        resolvedCheckOut: booking.check_out,
        resolvedRooms: buildRoomsFromCustomer(booking),
        customerFirstName: user?.first_name || '',
        customerLastName: user?.last_name || '',
        customerPhone: user?.phone || '',
        customerEmail: user?.email || '',
      });

      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [applyConfirmationState, bookingCode, hotelIdParam, token, user]);

  useEffect(() => {
    if (!bookingCode || authLoading) return;

    let cancelled = false;

    const init = async () => {
      if (token) {
        const loaded = await loadFromAuthenticatedBooking();
        if (cancelled) return;
        if (loaded) return;
      }

      const storedPin = getBookingPin(bookingCode);
      const resolvedPin = urlPin || storedPin || '';
      if (resolvedPin) {
        await loadFromPin(bookingCode, resolvedPin);
        return;
      }

      if (!token) {
        setNeedsPin(true);
      } else {
        setError(t('booking.manage.errorFetch', 'Захиалга олдсонгүй'));
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [authLoading, bookingCode, loadFromAuthenticatedBooking, loadFromPin, token, urlPin, t]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) return;
    loadFromPin(bookingCode, pinInput.trim());
  };

  if (!bookingCode) {
    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 flex items-center justify-center px-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('booking.manage.errorFetch', 'Захиалга олдсонгүй')}
        </p>
      </div>
    );
  }

  if ((authLoading || loading) && !ready) {
    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (needsPin && !ready && !token) {
    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('booking.manage.title', 'Захиалга шалгах')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t('bookingExtra.bookingConfirmation', 'Захиалгын хуудас')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t('booking.manage.code', 'Код')}: {bookingCode}
          </p>
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder={t('profileBookings.pinCode')}
              maxLength={6}
              className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none tracking-widest text-center"
            />
            <button
              type="submit"
              disabled={loading || pinInput.length < 4}
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {loading ? t('booking.manage.searching', 'Хайж байна...') : t('booking.manage.findBooking', 'Шалгах')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!ready || !bookingResult) {
    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 flex items-center justify-center px-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error || t('booking.manage.errorFetch', 'Захиалга олдсонгүй')}
        </p>
      </div>
    );
  }

  return (
    <BookingConfirmationView
      bookingResult={bookingResult}
      checkedBooking={checkedBooking}
      rooms={rooms}
      hotelId={hotelId}
      hotelName={hotelDetails?.property_name || hotelName}
      checkIn={checkIn}
      checkOut={checkOut}
      nights={nights}
      totalPrice={totalPrice}
      adultsCount={2}
      childrenCount={0}
      customerName={customerName}
      customerLastName={customerLastName}
      customerPhone={customerPhone}
      customerEmail={customerEmail}
      hotelDetails={hotelDetails}
      hotelPolicy={hotelPolicy}
    />
  );
}
