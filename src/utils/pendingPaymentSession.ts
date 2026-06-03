import {
  getStoredQPayInvoiceStatusDate,
  isQPaySessionActive,
  clearQPaySession,
} from './qpaySession';

export interface BookingPaymentRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
  max_adults?: number;
  max_children?: number;
}

export interface BookingPaymentContext {
  hotelId: number;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  nights: number;
  adults: number;
  children: number;
  searchedRooms: number;
  rooms: BookingPaymentRoom[];
  customerName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerEmail?: string;
  bookingCode: string;
}

const CONTEXT_KEY = 'booking_payment_context';
const STEP_KEY = 'booking_step';
const RESULT_KEY = 'booking_result';

export function saveBookingPaymentContext(context: BookingPaymentContext): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
}

export function getBookingPaymentContext(): BookingPaymentContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CONTEXT_KEY);
    return raw ? (JSON.parse(raw) as BookingPaymentContext) : null;
  } catch {
    return null;
  }
}

export function isPaymentSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  const invoiceStatusDate = getStoredQPayInvoiceStatusDate();
  if (invoiceStatusDate) {
    return isQPaySessionActive(invoiceStatusDate);
  }
  return false;
}

export function getStoredBookingCode(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = sessionStorage.getItem(RESULT_KEY);
    if (!saved) return null;
    const result = JSON.parse(saved) as { booking_code?: string };
    return result.booking_code ?? null;
  } catch {
    return null;
  }
}

export function canResumePaymentForBooking(bookingCode: string): boolean {
  if (!isPaymentSessionActive()) return false;
  if (sessionStorage.getItem(STEP_KEY) !== '3') return false;
  return getStoredBookingCode() === bookingCode;
}

export function getActivePaymentSession(): {
  context: BookingPaymentContext;
  bookingCode: string;
} | null {
  if (!isPaymentSessionActive()) return null;
  if (sessionStorage.getItem(STEP_KEY) !== '3') return null;
  const context = getBookingPaymentContext();
  const bookingCode = getStoredBookingCode();
  if (!context || !bookingCode) return null;
  return { context, bookingCode };
}

export function buildBookingPaymentUrl(context: BookingPaymentContext): string {
  const params = new URLSearchParams({
    hotelId: String(context.hotelId),
    hotelName: context.hotelName,
    checkIn: context.checkIn,
    checkOut: context.checkOut,
    rooms: JSON.stringify(context.rooms),
    totalPrice: String(context.totalPrice),
    nights: String(context.nights),
    adults: String(context.adults),
    children: String(context.children),
    searchedRooms: String(context.searchedRooms),
  });
  return `/booking?${params.toString()}`;
}

export function clearPaymentSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STEP_KEY);
  sessionStorage.removeItem(RESULT_KEY);
  sessionStorage.removeItem(CONTEXT_KEY);
  clearQPaySession();
}
