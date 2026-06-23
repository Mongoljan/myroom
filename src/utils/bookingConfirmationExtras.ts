import type { BreakfastPolicy, PropertyPolicy } from '@/types/api';
import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';
import type { EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { formatPolicyTimeRange } from '@/utils/policyFormatters';
import { getLocalizedFullRoomName } from '@/utils/roomNames';

export function formatHotelPhoneDisplay(phone?: string | null): string | undefined {
  if (!phone?.trim()) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('976') && digits.length >= 11) {
    const local = digits.slice(3);
    return `+976 ${local.slice(0, 4)} ${local.slice(4)}`.trim();
  }
  if (digits.length === 8) {
    return `+976 ${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  return phone.trim();
}

export function inferIncludeBreakfastFromHotelRoom(
  bookedPricePerNight: number,
  hotelRoom: EnrichedHotelRoom
): boolean | undefined {
  const options: { include: boolean; price: number }[] = [];

  const without =
    hotelRoom.pricing?.per_night?.without_breakfast?.selling_price ??
    hotelRoom.price_breakdown?.final_customer_price ??
    hotelRoom.base_price;
  const withBreakfast =
    hotelRoom.pricing?.per_night?.with_breakfast?.selling_price ?? hotelRoom.price_with_breakfast;

  if (without && without > 0) options.push({ include: false, price: without });
  if (withBreakfast && withBreakfast > 0) options.push({ include: true, price: withBreakfast });

  if (options.length === 0) return undefined;
  if (options.length === 1) return options[0].include;

  let closest = options[0];
  let closestDist = Math.abs(bookedPricePerNight - options[0].price);

  for (const option of options.slice(1)) {
    const dist = Math.abs(bookedPricePerNight - option.price);
    if (dist < closestDist) {
      closest = option;
      closestDist = dist;
    }
  }

  return closest.include;
}

export function findEnrichedHotelRoomForBookingLine(
  room: BookingConfirmationRoom,
  hotelRooms: EnrichedHotelRoom[]
): EnrichedHotelRoom | undefined {
  if (room.hotel_room_id) {
    const byId = hotelRooms.find((r) => r.id === room.hotel_room_id);
    if (byId) return byId;
  }

  let best: EnrichedHotelRoom | undefined;
  let bestDist = Infinity;

  for (const hotelRoom of hotelRooms) {
    const prices = [
      hotelRoom.pricing?.per_night?.without_breakfast?.selling_price,
      hotelRoom.pricing?.per_night?.with_breakfast?.selling_price,
      hotelRoom.price_breakdown?.final_customer_price,
      hotelRoom.price_breakdown?.base_price,
      hotelRoom.price_breakdown?.price_with_breakfast,
      hotelRoom.base_price,
      hotelRoom.final_price,
      hotelRoom.single_person_price,
      hotelRoom.half_day_price,
      hotelRoom.price_with_breakfast,
      hotelRoom.breakfast_include_price,
    ].filter((price): price is number => typeof price === 'number' && price > 0);

    for (const price of prices) {
      const dist = Math.abs(price - room.price_per_night);
      if (dist < bestDist) {
        bestDist = dist;
        best = hotelRoom;
      }
    }
  }

  const tolerance = Math.max(2, room.price_per_night * 0.2);
  if (bestDist <= tolerance) return best;

  // `booking.room` (e.g. 711) is a booked inventory id — often not listed in `/roomsInHotels/`.
  if (room.hotel_room_id && best && hotelRooms.length > 0) return best;

  return undefined;
}

export function resolveRoomIncludeBreakfast(
  room: BookingConfirmationRoom,
  hotelRooms: EnrichedHotelRoom[],
  bookingIncludeBreakfast?: boolean
): boolean {
  if (room.include_breakfast !== undefined) return room.include_breakfast;

  const matched = findEnrichedHotelRoomForBookingLine(room, hotelRooms);
  if (matched) {
    const inferred = inferIncludeBreakfastFromHotelRoom(room.price_per_night, matched);
    if (inferred !== undefined) return inferred;
  }

  if (room.room_name) {
    const byName = hotelRooms.find((r) => {
      const en = getLocalizedFullRoomName(r, 'en');
      const mn = getLocalizedFullRoomName(r, 'mn');
      return en === room.room_name || mn === room.room_name || r.roomTypeNameEn === room.room_name;
    });
    if (byName) {
      const inferred = inferIncludeBreakfastFromHotelRoom(room.price_per_night, byName);
      if (inferred !== undefined) return inferred;
    }
  }

  return bookingIncludeBreakfast ?? false;
}

export function getRoomExtraDescription(
  room: BookingConfirmationRoom,
  bookingIncludeBreakfast?: boolean
): string {
  const withBreakfast = room.include_breakfast ?? bookingIncludeBreakfast ?? false;
  return withBreakfast ? 'Өглөөний цайтай' : 'Өглөөний цайгүй';
}

function parseBreakfastPolicy(
  hotelPolicy: PropertyPolicy
): BreakfastPolicy | null {
  const bp = hotelPolicy.breakfast_policy;
  if (!bp || typeof bp === 'string') return null;
  return bp;
}

export function formatBreakfastType(type: string | number): string {
  const typeMap: Record<string, string> = {
    buffet: 'Буффет',
    continental: 'Континентал',
    american: 'Америк хэв маяг',
    full: 'Бүрэн өглөөний цай',
    english: 'Англи хэв маяг',
    asian: 'Азийн хэв маяг',
    box: 'Хайрцагт өглөөний цай',
    room_service: 'Өрөөний үйлчилгээ',
    room: 'Өрөөний үйлчилгээ',
  };
  const key = String(type).toLowerCase();
  return typeMap[key] || String(type);
}

/** Policy-based info tags for "Нэмэлт мэдээлэл" (Figma-style chips) */
export function getAdditionalInfoTags(hotelPolicy: PropertyPolicy | null): string[] {
  if (!hotelPolicy) return [];

  const tags: string[] = [];

  const childPolicy = hotelPolicy.child_policy;
  if (childPolicy?.allow_children) {
    tags.push('Хүүхэд үйлчлүүлэх боломжтой');
    if (childPolicy.max_child_age != null) {
      tags.push(`${childPolicy.max_child_age}+ наснаас дээш том хүнээр тооцогдоно`);
    }
  }

  const parking = hotelPolicy.parking_policy;
  if (parking) {
    const hasFreeOutdoor = parking.outdoor_parking === 'free';
    const hasFreeIndoor = parking.indoor_parking === 'free';
    if (hasFreeOutdoor && hasFreeIndoor) tags.push('Үнэгүй гадна, дотор зогсоол');
    else if (hasFreeOutdoor) tags.push('Үнэгүй зогсоол');
    else if (hasFreeIndoor) tags.push('Үнэгүй дотор зогсоол');
  }

  const breakfastPolicy = parseBreakfastPolicy(hotelPolicy);
  if (breakfastPolicy) {
    const status = String(breakfastPolicy.status).toLowerCase();
    if (status !== 'no' && status !== 'false') {
      if (breakfastPolicy.breakfast_type) {
        tags.push(`Өглөөний цай: ${formatBreakfastType(breakfastPolicy.breakfast_type)}`);
      }
      const breakfastTime = formatPolicyTimeRange(
        breakfastPolicy.start_time,
        breakfastPolicy.end_time,
        ' – '
      );
      if (breakfastTime) {
        tags.push(`Өглөөний цайны цаг: ${breakfastTime}`);
      }
    }
  }

  if (hotelPolicy.min_guest_age != null && hotelPolicy.min_guest_age > 0) {
    tags.push(
      `Бүртгэл хийлгэхэд ${hotelPolicy.min_guest_age}+ наснаас дээш насны шаардлага хангасан байх`
    );
  }

  if (hotelPolicy.pet_policy === true) {
    tags.push('Тэжээвэр амьтан зөвшөөрнө');
  } else if (hotelPolicy.pet_policy === false) {
    tags.push('Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй');
  }

  return tags;
}
