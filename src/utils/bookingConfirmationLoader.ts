import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';
import type { BookingDetails, CheckBookingResponse, CreateBookingResponse } from '@/types/api';
import type { CustomerBooking, CustomerProfile } from '@/types/customer';
import { calculateNights } from '@/utils/booking';

/** Parent booking rows may include add-on rooms in `extra_rooms`. */
export function flattenBookingDetails(bookings: BookingDetails[]): BookingDetails[] {
  const result: BookingDetails[] = [];

  for (const booking of bookings) {
    result.push(booking);
    if (booking.extra_rooms?.length) {
      result.push(...booking.extra_rooms);
    }
  }

  return result;
}

export function splitCustomerName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { firstName: parts[0] || '', lastName: '' };
  }
  return { lastName: parts[0], firstName: parts.slice(1).join(' ') };
}

export function buildBookingResultFromCheck(
  bookingCode: string,
  pinCode: string,
  checked: CheckBookingResponse
): CreateBookingResponse {
  const allBookings = flattenBookingDetails(checked.bookings);
  const first = allBookings[0];
  const nights = first
    ? calculateNights(new Date(first.check_in), new Date(first.check_out))
    : 1;

  return {
    message: '',
    booking_code: bookingCode,
    pin_code: pinCode,
    booking_ids: allBookings.map((b) => b.id),
    nights,
    total_rooms: allBookings.length,
  };
}

function resolveBookingInventoryId(booking: BookingDetails): number | undefined {
  const raw = booking.room ?? (booking as { room_id?: number }).room_id;
  if (typeof raw === 'number' && raw > 0) return raw;
  return undefined;
}

function bookingDetailsToConfirmationRoom(
  booking: BookingDetails,
  isAdded = false
): BookingConfirmationRoom {
  return {
    room_category_id: 0,
    room_type_id: 0,
    hotel_room_id: resolveBookingInventoryId(booking),
    room_count: 1,
    room_name: '',
    price_per_night: booking.room_price,
    total_price: booking.total_price,
    include_breakfast: booking.include_breakfast,
    is_added_room: isAdded,
    booked_at: booking.created_at,
  };
}

export function buildRoomsFromCheck(
  checked: CheckBookingResponse,
  _fallbackRoomName?: string
): BookingConfirmationRoom[] {
  const rooms: BookingConfirmationRoom[] = [];
  const seenAddedIds = new Set<number>();

  for (const parent of checked.bookings) {
    if (parent.parent_booking != null) continue;

    rooms.push(bookingDetailsToConfirmationRoom(parent, false));

    for (const extra of parent.extra_rooms ?? []) {
      rooms.push(bookingDetailsToConfirmationRoom(extra, true));
      seenAddedIds.add(extra.id);
    }
  }

  for (const booking of checked.bookings) {
    if (booking.parent_booking == null || seenAddedIds.has(booking.id)) continue;
    rooms.push(bookingDetailsToConfirmationRoom(booking, true));
  }

  return rooms;
}

function customerBookingToDetails(
  booking: CustomerBooking,
  user: CustomerProfile | null
): BookingDetails {
  const customerName = user
    ? [user.last_name, user.first_name].filter(Boolean).join(' ').trim()
    : '';
  const nights = calculateNights(new Date(booking.check_in), new Date(booking.check_out));

  return {
    id: booking.id,
    user: {
      id: user?.id ?? 0,
      name: customerName,
      phone: user?.phone ?? '',
      email: user?.email ?? '',
    },
    customer_name: customerName,
    customer_phone: user?.phone ?? '',
    customer_email: user?.email ?? '',
    hotel: booking.hotel,
    room: booking.id,
    room_price: nights > 0 ? Math.round(booking.total_price / nights) : booking.total_price,
    check_in: booking.check_in,
    check_out: booking.check_out,
    status: booking.status,
    coupon: null,
    total_price: booking.total_price,
    created_at: booking.created_at,
  };
}

export function buildCheckedBookingFromCustomers(
  bookings: CustomerBooking[],
  user: CustomerProfile | null
): CheckBookingResponse {
  const primary = bookings[0];

  return {
    bookings: bookings.map((booking) => customerBookingToDetails(booking, user)),
    total_sum: bookings.reduce((sum, booking) => sum + booking.total_price, 0),
    status: primary.status,
  };
}

export function buildCheckedBookingFromCustomer(
  booking: CustomerBooking,
  user: CustomerProfile | null
): CheckBookingResponse {
  return buildCheckedBookingFromCustomers([booking], user);
}

export function buildBookingResultFromCustomers(bookings: CustomerBooking[]): CreateBookingResponse {
  const primary = bookings[0];
  const nights = calculateNights(new Date(primary.check_in), new Date(primary.check_out));

  return {
    message: '',
    booking_code: primary.booking_code,
    pin_code: '',
    booking_ids: bookings.map((b) => b.id),
    nights,
    total_rooms: bookings.length,
  };
}

export function buildBookingResultFromCustomer(booking: CustomerBooking): CreateBookingResponse {
  return buildBookingResultFromCustomers([booking]);
}

export function buildRoomsFromCustomers(bookings: CustomerBooking[]): BookingConfirmationRoom[] {
  const sorted = [...bookings].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return sorted.map((booking, index) => {
    const nights = calculateNights(new Date(booking.check_in), new Date(booking.check_out));
    const pricePerNight = nights > 0 ? Math.round(booking.total_price / nights) : booking.total_price;

    return {
      room_category_id: 0,
      room_type_id: 0,
      room_count: 1,
      room_name: booking.room_type || '',
      price_per_night: pricePerNight,
      total_price: booking.total_price,
      is_added_room: index > 0,
      booked_at: booking.created_at,
    };
  });
}

export function buildRoomsFromCustomer(booking: CustomerBooking): BookingConfirmationRoom[] {
  return buildRoomsFromCustomers([booking]);
}
