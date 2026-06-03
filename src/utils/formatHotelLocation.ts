export interface HotelLocationInput {
  province_city?: string | null;
  soum?: string | null;
  district?: string | null;
}

const ULAANBAATAR_NAMES = new Set(['Улаанбаатар', 'Ulaanbaatar', 'ulaanbaatar']);

export function isUlaanbaatarProvince(provinceCity?: string | null): boolean {
  if (!provinceCity?.trim()) return false;
  return ULAANBAATAR_NAMES.has(provinceCity.trim());
}

/** district = хороо in UB, баг elsewhere (e.g. "1" → "1-р баг") */
export function formatDistrictLabel(
  provinceCity?: string | null,
  district?: string | null
): string {
  if (!district?.trim()) return '';
  const value = district.trim();
  if (/хороо|баг/i.test(value)) return value;

  const numMatch = value.match(/^(\d+)/);
  if (numMatch) {
    const num = numMatch[1];
    return isUlaanbaatarProvince(provinceCity) ? `${num}-р хороо` : `${num}-р баг`;
  }

  return value;
}

export function formatHotelLocationParts(location?: HotelLocationInput | null): string[] {
  if (!location) return [];
  return [
    location.province_city,
    location.soum,
    formatDistrictLabel(location.province_city, location.district),
  ].filter((part): part is string => Boolean(part));
}

export function formatHotelLocation(location?: HotelLocationInput | null): string {
  return formatHotelLocationParts(location).join(', ');
}
