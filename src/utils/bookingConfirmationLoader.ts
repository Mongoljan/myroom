import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';
import type { CheckBookingResponse, CreateBookingResponse } from '@/types/api';
import type { CustomerBooking, CustomerProfile } from '@/types/customer';
import { calculateNights } from '@/utils/booking';

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

export function buildRoomsFromCheck(
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

export function buildCheckedBookingFromCustomer(
  booking: CustomerBooking,
  user: CustomerProfile | null
): CheckBookingResponse {
  const customerName = user
    ? [user.last_name, user.first_name].filter(Boolean).join(' ').trim()
    : '';

  return {
    bookings: [
      {
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
        room_price:
          calculateNights(new Date(booking.check_in), new Date(booking.check_out)) > 0
            ? Math.round(
                booking.total_price /
                  calculateNights(new Date(booking.check_in), new Date(booking.check_out))
              )
            : booking.total_price,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
        coupon: null,
        total_price: booking.total_price,
        created_at: booking.created_at,
      },
    ],
    total_sum: booking.total_price,
    status: booking.status,
  };
}

export function buildBookingResultFromCustomer(booking: CustomerBooking): CreateBookingResponse {
  const nights = calculateNights(new Date(booking.check_in), new Date(booking.check_out));

  return {
    message: '',
    booking_code: booking.booking_code,
    pin_code: '',
    booking_ids: [booking.id],
    nights,
    total_rooms: 1,
  };
}

export function buildRoomsFromCustomer(booking: CustomerBooking): BookingConfirmationRoom[] {
  const nights = calculateNights(new Date(booking.check_in), new Date(booking.check_out));
  const pricePerNight = nights > 0 ? Math.round(booking.total_price / nights) : booking.total_price;

  return [
    {
      room_category_id: 0,
      room_type_id: 0,
      room_count: 1,
      room_name: booking.room_type || 'Өрөө',
      price_per_night: pricePerNight,
      total_price: booking.total_price,
    },
  ];
}
