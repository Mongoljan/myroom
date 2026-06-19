import type { BookingPaymentContext, BookingPaymentRoom } from './pendingPaymentSession';
import {
  getBookingPaymentContext,
  doesUrlMatchPaymentContext,
  type BookingUrlParams,
} from './pendingPaymentSession';

export type BookingFlowStep = 1 | 2 | 3;

export function markBookingGuestStep(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('booking_step', '2');
}

export function markBookingPaymentStep(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('booking_step', '3');
}

export function buildHotelRoomStepUrl(params: {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  searchedRooms: number;
}): string {
  const search = new URLSearchParams({
    check_in: params.checkIn,
    check_out: params.checkOut,
    adults: String(params.adults),
    children: String(params.children),
    rooms: String(params.searchedRooms),
    acc_type: 'hotel',
  });
  return `/hotel/${params.hotelId}?${search.toString()}`;
}

export function roomsPayloadMatches(
  a: BookingPaymentRoom[],
  b: BookingPaymentRoom[]
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function doesContextMatchUrlParams(
  ctx: BookingPaymentContext,
  params: BookingUrlParams
): boolean {
  return (
    ctx.hotelId === params.hotelId &&
    ctx.checkIn === params.checkIn &&
    ctx.checkOut === params.checkOut &&
    Math.abs(ctx.totalPrice - params.totalPrice) < 0.01 &&
    roomsPayloadMatches(ctx.rooms, params.rooms)
  );
}

export interface GuestFormSnapshot {
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  cancellationAccepted: boolean;
  tosAccepted: boolean;
}

export function isGuestFormMatchingContext(
  form: GuestFormSnapshot,
  ctx: BookingPaymentContext
): boolean {
  return (
    form.customerName === (ctx.customerName ?? '') &&
    form.customerLastName === (ctx.customerLastName ?? '') &&
    form.customerPhone === (ctx.customerPhone ?? '') &&
    form.customerEmail === (ctx.customerEmail ?? '') &&
    form.cancellationAccepted &&
    form.tosAccepted
  );
}

export function canResumeGuestStep(urlParams: BookingUrlParams): boolean {
  const ctx = getBookingPaymentContext();
  if (!ctx) return false;
  if (typeof window === 'undefined') return false;
  if (!sessionStorage.getItem('booking_result')) return false;
  return doesContextMatchUrlParams(ctx, urlParams);
}

export function canResumePaymentStep(
  urlParams: BookingUrlParams,
  form: GuestFormSnapshot
): boolean {
  if (!canResumeGuestStep(urlParams)) return false;
  const ctx = getBookingPaymentContext();
  if (!ctx) return false;
  return (
    isGuestFormMatchingContext(form, ctx) &&
    doesUrlMatchPaymentContext(urlParams)
  );
}
