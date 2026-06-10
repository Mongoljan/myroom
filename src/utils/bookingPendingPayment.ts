import { CustomerBooking } from '@/types/customer';
import { calculateNights } from '@/utils/booking';
import { buildRoomsFromCustomer } from '@/utils/bookingConfirmationLoader';
import { getBookingPin } from '@/utils/bookingPinStorage';
import {
  buildBookingPaymentUrl,
  canResumePaymentForBooking,
  getActivePaymentSession,
  saveBookingPaymentContext,
  type BookingPaymentContext,
} from '@/utils/pendingPaymentSession';

export const PENDING_PAYMENT_WINDOW_MS = 10 * 60 * 1000;
export const PENDING_PAYMENT_WINDOW_SECONDS = PENDING_PAYMENT_WINDOW_MS / 1000;

export function getPendingPaymentRemainingSeconds(createdAt: string): number {
  const createdMs = new Date(createdAt).getTime();
  if (!Number.isFinite(createdMs)) return 0;
  const expiryMs = createdMs + PENDING_PAYMENT_WINDOW_MS;
  const remaining = Math.floor((expiryMs - Date.now()) / 1000);
  return Math.max(0, Math.min(PENDING_PAYMENT_WINDOW_SECONDS, remaining));
}

export function formatPendingPaymentCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Display booking created date in Mongolia local time (UTC + 8). */
export function formatBookingCreatedAtMongolia(createdAt: string): string {
  const d = new Date(createdAt);
  if (!Number.isFinite(d.getTime())) return '';
  d.setUTCHours(d.getUTCHours() + 8);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export interface ResumePaymentParams {
  booking: CustomerBooking;
  hotelId: number;
  customerName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export function getPaymentResumeUrl(params: ResumePaymentParams): string | null {
  const { booking, hotelId } = params;

  if (canResumePaymentForBooking(booking.booking_code)) {
    const session = getActivePaymentSession();
    if (session) return buildBookingPaymentUrl(session.context);
  }

  const pin = getBookingPin(booking.booking_code);
  if (!pin || !hotelId) return null;

  const nights = calculateNights(new Date(booking.check_in), new Date(booking.check_out)) || 1;
  const rooms = buildRoomsFromCustomer(booking);

  const context: BookingPaymentContext = {
    hotelId,
    hotelName: booking.hotel_name,
    checkIn: booking.check_in,
    checkOut: booking.check_out,
    totalPrice: booking.total_price,
    nights,
    adults: 2,
    children: 0,
    searchedRooms: 1,
    rooms,
    customerName: params.customerName,
    customerLastName: params.customerLastName,
    customerPhone: params.customerPhone,
    customerEmail: params.customerEmail,
    bookingCode: booking.booking_code,
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('booking_step', '3');
    sessionStorage.setItem(
      'booking_result',
      JSON.stringify({
        message: '',
        booking_code: booking.booking_code,
        pin_code: pin,
        booking_ids: [booking.id],
        nights,
        total_rooms: 1,
      })
    );
    saveBookingPaymentContext(context);
  }

  return buildBookingPaymentUrl(context);
}
