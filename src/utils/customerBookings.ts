import { CustomerBooking } from '@/types/customer';

/** Rooms added later usually have created_at well after the original booking rows. */
const ADDED_ROOM_TIME_GAP_MS = 5_000;

function inferHasAddedRooms(rows: CustomerBooking[]): boolean {
  if (rows.length <= 1) return false;
  const times = rows
    .map((row) => new Date(row.created_at).getTime())
    .filter((time) => !Number.isNaN(time))
    .sort((a, b) => a - b);
  if (times.length <= 1) return false;
  return times[times.length - 1] - times[0] > ADDED_ROOM_TIME_GAP_MS;
}

/** One booking_code can map to multiple room rows from the API. */
export function dedupeCustomerBookings(bookings: CustomerBooking[]): CustomerBooking[] {
  const groups = new Map<string, CustomerBooking[]>();
  const seenIds = new Set<number>();

  for (const booking of bookings) {
    if (seenIds.has(booking.id)) continue;
    seenIds.add(booking.id);

    const group = groups.get(booking.booking_code) ?? [];
    group.push(booking);
    groups.set(booking.booking_code, group);
  }

  const merged: CustomerBooking[] = [];

  for (const group of groups.values()) {
    const sorted = [...group].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const primary = sorted[sorted.length - 1];
    const bookingIds = sorted.map((row) => row.id);
    const roomTypes = new Set(sorted.map((row) => row.room_type).filter(Boolean));

    merged.push({
      ...primary,
      total_price: sorted.reduce((sum, row) => sum + row.total_price, 0),
      room_type: [...roomTypes].join(', '),
      has_review: sorted.some((row) => row.has_review),
      booking_ids: bookingIds,
      room_count: bookingIds.length,
      has_added_rooms: inferHasAddedRooms(sorted),
    });
  }

  return merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
