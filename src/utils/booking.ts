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

/** Total guest capacity from selected rooms (per-room max × room count). */
export function getSelectedRoomsGuestCapacity(
  rooms: Array<{ room_count: number; max_adults?: number; max_children?: number }>
): { adults: number; children: number } {
  return {
    adults: rooms.reduce((sum, room) => sum + (room.max_adults ?? 1) * room.room_count, 0),
    children: rooms.reduce((sum, room) => sum + (room.max_children ?? 0) * room.room_count, 0),
  };
}

export function getBookingItemsGuestCapacity(
  items: Array<{ room: { adultQty?: number; childQty?: number }; quantity: number }>
): { adults: number; children: number } {
  return {
    adults: items.reduce((sum, item) => sum + (item.room.adultQty ?? 1) * item.quantity, 0),
    children: items.reduce((sum, item) => sum + (item.room.childQty ?? 0) * item.quantity, 0),
  };
}

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

type CreateBookingPriceInput = {
  pricing?: Array<{
    pricing?: {
      total?: Partial<Record<BreakfastPriceKey, number>>;
      per_night?: Partial<Record<BreakfastPriceKey, { selling_price?: number }>>;
    };
  }>;
  include_breakfast?: boolean;
};

export function getCreateBookingTotal(result: CreateBookingPriceInput): number {
  if (!result.pricing?.length) return 0;
  const priceKey = getCreateBookingPriceKey(result.include_breakfast);
  return result.pricing.reduce((sum, line) => sum + (line.pricing?.total?.[priceKey] ?? 0), 0);
}

export function getCreateBookingPerNight(result: CreateBookingPriceInput): number {
  const line = result.pricing?.[0];
  if (!line) return 0;
  const priceKey = getCreateBookingPriceKey(result.include_breakfast);
  return line.pricing?.per_night?.[priceKey]?.selling_price ?? 0;
}

export function syncRoomsFromCreateResponse<T extends BookingRoomPricingFields>(
  rooms: T[],
  result: CreateBookingPriceInput & { nights?: number }
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
