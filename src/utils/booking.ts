export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const calculateRoomTotal = (
  pricePerNight: number,
  nights: number,
  roomCount: number
): number => {
  return pricePerNight * nights * roomCount;
};

export const calculateBookingTotal = (
  rooms: Array<{ price_per_night: number; room_count: number }>,
  nights: number
): number => {
  return rooms.reduce((total, room) => {
    return total + calculateRoomTotal(room.price_per_night, nights, room.room_count);
  }, 0);
};

type BreakfastPriceKey = 'without_breakfast' | 'with_breakfast';

export interface BookingRoomPricingFields {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
  max_adults?: number;
  max_children?: number;
  include_breakfast?: boolean;
}

export function getCreateBookingPriceKey(includeBreakfast?: boolean): BreakfastPriceKey {
  return includeBreakfast ? 'with_breakfast' : 'without_breakfast';
}

export function getCreateBookingTotal(result: {
  pricing?: Array<{ pricing?: { total?: Partial<Record<BreakfastPriceKey, number>> } }>;
  include_breakfast?: boolean;
}): number {
  if (!result.pricing?.length) return 0;
  const priceKey = getCreateBookingPriceKey(result.include_breakfast);
  return result.pricing.reduce((sum, line) => sum + (line.pricing?.total?.[priceKey] ?? 0), 0);
}

export function getCreateBookingPerNight(result: {
  pricing?: Array<{ pricing?: { per_night?: Partial<Record<BreakfastPriceKey, { selling_price?: number }>> } }>;
  include_breakfast?: boolean;
}): number {
  const line = result.pricing?.[0];
  if (!line) return 0;
  const priceKey = getCreateBookingPriceKey(result.include_breakfast);
  return line.pricing?.per_night?.[priceKey]?.selling_price ?? 0;
}

export function syncRoomsFromCreateResponse<T extends BookingRoomPricingFields>(
  rooms: T[],
  result: { pricing?: unknown[]; include_breakfast?: boolean; nights?: number }
): T[] {
  const apiTotal = getCreateBookingTotal(result);
  const perNight = getCreateBookingPerNight(result);
  if (apiTotal <= 0 || perNight <= 0 || !rooms.length) return rooms;

  const nights = result.nights ?? 1;
  return rooms.map((room) => ({
    ...room,
    include_breakfast: result.include_breakfast ?? room.include_breakfast,
    price_per_night: perNight,
    total_price: perNight * room.room_count * nights,
  }));
}
