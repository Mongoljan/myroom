import type { PropertyPolicy } from '@/types/api';
import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';

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

export function getRoomExtraDescription(
  room: BookingConfirmationRoom,
  bookingIncludeBreakfast?: boolean
): string {
  const withBreakfast = room.include_breakfast ?? bookingIncludeBreakfast;
  return withBreakfast ? 'Өглөөний цайтай' : 'Өглөөний цайгүй';
}

/** Policy-based free info tags for "Нэмэлт мэдээлэл" (Figma-style chips) */
export function getAdditionalInfoTags(hotelPolicy: PropertyPolicy | null): string[] {
  if (!hotelPolicy) return [];

  const tags: string[] = [];

  const childPolicy = hotelPolicy.child_policy;
  if (childPolicy?.allow_children && childPolicy.max_child_age != null) {
    tags.push(`${childPolicy.max_child_age}-с дээш насны хүүхдийг том хүнээр тооцно`);
  }

  const parking = hotelPolicy.parking_policy;
  if (parking) {
    const hasFreeOutdoor = parking.outdoor_parking === 'free';
    const hasFreeIndoor = parking.indoor_parking === 'free';
    if (hasFreeOutdoor && hasFreeIndoor) tags.push('Үнэгүй гадна, дотор зогсоол');
    else if (hasFreeOutdoor) tags.push('Үнэгүй зогсоол');
    else if (hasFreeIndoor) tags.push('Үнэгүй дотор зогсоол');
  }

  if (hotelPolicy.pet_policy) {
    tags.push('Тэжээвэр амьтан зөвшөөрнө');
  }

  return tags;
}
