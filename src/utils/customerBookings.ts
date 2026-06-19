import { CustomerBooking } from '@/types/customer';

/** One booking_code can map to multiple room rows from the API. */
export function dedupeCustomerBookings(bookings: CustomerBooking[]): CustomerBooking[] {
  const byCode = new Map<string, CustomerBooking>();
  const seenIds = new Set<number>();

  for (const booking of bookings) {
    if (seenIds.has(booking.id)) continue;
    seenIds.add(booking.id);

    const existing = byCode.get(booking.booking_code);
    if (!existing) {
    byCode.set(booking.booking_code, {
      ...booking,
      booking_ids: [booking.id],
      room_count: 1,
      has_added_rooms: false,
    });
      continue;
    }

    const roomTypes = new Set(
      [existing.room_type, booking.room_type].filter(Boolean)
    );
    const bookingIds = [...(existing.booking_ids ?? [existing.id]), booking.id];

    byCode.set(booking.booking_code, {
      ...existing,
      total_price: existing.total_price + booking.total_price,
      room_type: [...roomTypes].join(', '),
      has_review: existing.has_review || booking.has_review,
      booking_ids: bookingIds,
      room_count: bookingIds.length,
      has_added_rooms: bookingIds.length > 1,
    });
  }

  return [...byCode.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
