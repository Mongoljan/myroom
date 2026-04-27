import type { HotelFacility } from '@/types/api';

/**
 * The API returns hotel facilities sometimes as plain strings and other times
 * as objects with `name_en` / `name_mn`. Use this helper anywhere a facility
 * is rendered as a React child to avoid "Objects are not valid as a React
 * child" errors and to support both response shapes.
 */
export function getFacilityName(facility: HotelFacility, locale: 'en' | 'mn' = 'mn'): string {
  if (facility == null) return '';
  if (typeof facility === 'string') return facility;
  if (typeof facility === 'object') {
    if (locale === 'en') {
      return facility.name_en || facility.name_mn || '';
    }
    return facility.name_mn || facility.name_en || '';
  }
  return '';
}

export function getFacilityKey(facility: HotelFacility, index: number): string | number {
  if (typeof facility === 'object' && facility && typeof facility.id === 'number') {
    return facility.id;
  }
  if (typeof facility === 'string') return `${facility}-${index}`;
  return index;
}
