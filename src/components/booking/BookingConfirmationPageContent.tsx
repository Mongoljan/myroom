'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingConfirmationView from '@/components/booking/BookingConfirmationView';
import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';
import { BookingService } from '@/services/bookingApi';
import { ApiService } from '@/services/api';
import { calculateNights } from '@/utils/booking';
import { getBookingPin, saveBookingPin } from '@/utils/bookingPinStorage';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import type { CheckBookingResponse, CreateBookingResponse, PropertyPolicy } from '@/types/api';

function buildBookingResult(
  bookingCode: string,
  pinCode: string,
  checked: CheckBookingResponse
): CreateBookingResponse {
  const first = checked.bookings[0];
  const nights = first
    ? calculateNights(new Date(first.check_in), new Date(first.check_out))
    : 1;

  return {
    message: '',
    booking_code: bookingCode,
    pin_code: pinCode,
    booking_ids: checked.bookings.map((b) => b.id),
    nights,
    total_rooms: checked.bookings.length,
  };
}

function buildRoomsFromCheck(
  checked: CheckBookingResponse,
  fallbackRoomName?: string
): BookingConfirmationRoom[] {
  const multi = checked.bookings.length > 1;

  return checked.bookings.map((booking, index) => ({
    room_category_id: 0,
    room_type_id: booking.room,
    room_count: 1,
    room_name:
      !multi && fallbackRoomName
        ? fallbackRoomName
        : fallbackRoomName
          ? `${fallbackRoomName}${multi ? ` ${index + 1}` : ''}`
          : `Өрөө ${booking.room}`,
    price_per_night: booking.room_price,
    total_price: booking.total_price,
  }));
}

function splitCustomerName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { firstName: parts[0] || '', lastName: '' };
  }
  return { lastName: parts[0], firstName: parts.slice(1).join(' ') };
}

export default function BookingConfirmationPageContent() {
  const { t } = useHydratedTranslation();
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

  const loadConfirmation = useCallback(
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

        const resolvedHotelId = hotelIdParam > 0 ? hotelIdParam : first.hotel;
        const resolvedCheckIn = first.check_in;
        const resolvedCheckOut = first.check_out;
        const resolvedNights = calculateNights(
          new Date(resolvedCheckIn),
          new Date(resolvedCheckOut)
        );
        const { firstName, lastName } = splitCustomerName(first.customer_name);

        const [hotelData, policyData] = await Promise.all([
          ApiService.getHotelDetails(resolvedHotelId, resolvedCheckIn, resolvedCheckOut).catch(() => null),
          ApiService.getPropertyPolicies(resolvedHotelId).catch(() => [] as PropertyPolicy[]),
        ]);

        saveBookingPin(code, pin);

        setBookingResult(buildBookingResult(code, pin, checked));
        setCheckedBooking(checked);
        setRooms(buildRoomsFromCheck(checked, roomType || undefined));
        setHotelId(resolvedHotelId);
        setHotelDetails(hotelData);
        setHotelPolicy(policyData[0] || null);
        setCheckIn(resolvedCheckIn);
        setCheckOut(resolvedCheckOut);
        setNights(resolvedNights);
        setTotalPrice(checked.total_sum);
        setCustomerName(firstName);
        setCustomerLastName(lastName);
        setCustomerPhone(first.customer_phone);
        setCustomerEmail(first.customer_email);
        setNeedsPin(false);
        setReady(true);
      } catch (err) {
        setReady(false);
        setError(err instanceof Error ? err.message : t('booking.manage.errorFetch', 'Захиалга олдсонгүй'));
        setNeedsPin(true);
      } finally {
        setLoading(false);
      }
    },
    [hotelIdParam, roomType, t]
  );

  useEffect(() => {
    if (!bookingCode) return;

    const storedPin = getBookingPin(bookingCode);
    const resolvedPin = urlPin || storedPin || '';
    if (resolvedPin) {
      loadConfirmation(bookingCode, resolvedPin);
      return;
    }

    setNeedsPin(true);
  }, [bookingCode, urlPin, loadConfirmation]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) return;
    loadConfirmation(bookingCode, pinInput.trim());
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

  if (needsPin && !ready) {
    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('bookingExtra.bookingConfirmation', 'Захиалгын хуудас')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t('profileBookings.cancelPinHint', { code: bookingCode })}
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

  if (loading || !ready || !bookingResult) {
    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
