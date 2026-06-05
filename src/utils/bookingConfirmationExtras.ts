import type { BreakfastPolicy, PropertyPolicy } from '@/types/api';
import type { BookingConfirmationRoom } from '@/components/booking/bookingConfirmationTypes';
import { formatPolicyTimeRange } from '@/utils/policyFormatters';

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
