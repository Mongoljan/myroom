import type { SearchHotelResult, HotelFacility } from '@/types/api';

export const STATIC_PROPERTY_TYPES = [
  { id: 1,  name_en: 'Hotel',          name_mn: 'Зочид буудал' },
  { id: 2,  name_en: 'Apartment Hotel', name_mn: 'Апартмент буудал' },
  { id: 3,  name_en: 'Guesthouse',      name_mn: 'Гестхаус' },
  { id: 4,  name_en: 'Hostel',          name_mn: 'Хостел' },
  { id: 5,  name_en: 'Lodge',           name_mn: 'Лодж' },
  { id: 6,  name_en: 'Villa',           name_mn: 'Тансаг зэрэглэлийн сууц' },
  { id: 7,  name_en: 'Tourist camp',    name_mn: 'Жуулчны бааз' },
  { id: 8,  name_en: 'Resort',          name_mn: 'Амралтын газар' },
  { id: 9,  name_en: 'Business Hotel',  name_mn: 'Бизнес зэрэглэлийн буудал' },
  { id: 10, name_en: 'Homestay',        name_mn: 'Гэр байр' },
  { id: 11, name_en: 'Motel',           name_mn: 'Жижгэвтэр дэн буудал' },
  { id: 12, name_en: 'Bed&Breakfast',   name_mn: 'Ор болон өглөө цайтай' },
  { id: 13, name_en: 'Glamping/Tent',   name_mn: 'Майхан сууц' },
  { id: 14, name_en: 'Capsule Hotel',   name_mn: 'Капсул зочид буудал' },
] as const;

interface PropertyType { id: number; name_en: string; name_mn: string }
interface Facility { id: number; name_en: string; name_mn: string }
interface Rating { id: number; rating: string }
interface Province { id: number; name: string }
interface AccessibilityFeature { id: number; name_en: string; name_mn: string }

export interface CombinedApiData {
  property_types: PropertyType[];
  facilities: Facility[];
  additionalFacilities: Facility[];
  activities: Facility[];
  ratings: Rating[];
  province: Province[];
  accessibility_features: AccessibilityFeature[];
}

export interface DerivedFacets {
  /** Combined-data narrowed to ONLY options that appear in current results */
  narrowedApiData: CombinedApiData;
  /** counts keyed as `facility_${id}`, `rating_${stars}`, `propertyType_${id}`, `accessibility_${id}`, `discounted` */
  filterCounts: Record<string, number>;
  /** Min/Max price across results' cheapest_room */
  priceMin: number;
  priceMax: number;
  /** Number of hotels with a discounted cheapest room */
  discountedCount: number;
}

const facilityIdOf = (f: HotelFacility): number | null => {
  if (typeof f === 'object' && f && typeof f.id === 'number') return f.id;
  return null;
};
const facilityNameOf = (f: HotelFacility, locale: 'en' | 'mn'): string => {
  if (typeof f === 'string') return f;
  if (typeof f === 'object' && f) return (locale === 'en' ? f.name_en : f.name_mn) || f.name_en || f.name_mn || '';
  return '';
};

const getRoomPrice = (hotel: SearchHotelResult): number => {
  const r = hotel.cheapest_room;
  if (!r) return 0;
  return r.price_per_night || r.price_per_night_adjusted || r.price_per_night_raw || 0;
};

/**
 * Derive available filter options + per-option hotel counts from the current
 * search results. The full reference data (combined-data API) is narrowed so
 * the SearchFilters component only renders options that actually exist among
 * the returned hotels.
 */
export function deriveFacets(
  hotels: SearchHotelResult[],
  apiData: CombinedApiData | null
): DerivedFacets {
  const presentFacilityIds = new Set<number>();
  const presentFacilityNames = new Set<string>(); // fallback for string-shaped facilities
  const presentRatings = new Set<number>();
  const presentPropertyTypes = new Set<string>();
  const counts: Record<string, number> = {};
  let priceMin = Infinity;
  let priceMax = 0;
  let discountedCount = 0;

  for (const h of hotels) {
    // Facilities
    const seenForHotel = new Set<string>();
    for (const f of h.general_facilities || []) {
      const id = facilityIdOf(f);
      if (id != null) {
        presentFacilityIds.add(id);
        const k = `facility_${id}`;
        if (!seenForHotel.has(k)) {
          counts[k] = (counts[k] || 0) + 1;
          seenForHotel.add(k);
        }
      } else {
        const name = facilityNameOf(f, 'en').toLowerCase();
        if (name) presentFacilityNames.add(name);
      }
    }

    // Star rating
    const stars = parseInt(h.rating_stars?.value?.toString().match(/\d+/)?.[0] || '0', 10);
    if (stars > 0) {
      presentRatings.add(stars);
      const k = `rating_${stars}`;
      counts[k] = (counts[k] || 0) + 1;
    }

    // Property type
    if (h.property_type) {
      presentPropertyTypes.add(h.property_type.toLowerCase());
    }

    // Price range
    const p = getRoomPrice(h);
    if (p > 0) {
      if (p < priceMin) priceMin = p;
      if (p > priceMax) priceMax = p;
    }

    // Discount
    const r = h.cheapest_room;
    if (r) {
      const raw = r.price_per_night_raw || r.price_per_night || 0;
      const adj = r.price_per_night_adjusted || r.price_per_night || 0;
      if (raw > 0 && adj > 0 && raw > adj) {
        discountedCount++;
      }
    }
  }

  if (priceMin === Infinity) priceMin = 0;

  // Helper: a facility option is "present" if its ID is referenced by at least
  // one hotel, OR (fallback) its name matches a string-shaped facility name.
  const isFacilityPresent = (f: { id: number; name_en: string; name_mn: string }) => {
    if (presentFacilityIds.has(f.id)) return true;
    const en = (f.name_en || '').toLowerCase();
    const mn = (f.name_mn || '').toLowerCase();
    if (!en && !mn) return false;
    return Array.from(presentFacilityNames).some(name =>
      (en && (name.includes(en) || en.includes(name))) ||
      (mn && (name.includes(mn) || mn.includes(name)))
    );
  };

  // Canonical property-type list: prefer what the API returns, fall back to static 14
  const canonicalPropertyTypes: PropertyType[] =
    apiData?.property_types?.length ? apiData.property_types : [...STATIC_PROPERTY_TYPES];

  // Narrow combined-data — only show options that actually exist in current results
  const narrowedApiData: CombinedApiData = {
    // Always include all canonical property types; counts (computed below) gate UI visibility
    property_types: canonicalPropertyTypes,
    facilities: (apiData?.facilities || []).filter(isFacilityPresent),
    ratings: (apiData?.ratings || []).filter(r => {
      const n = parseInt(r.rating.match(/\d+/)?.[0] || '0', 10);
      return n > 0 && presentRatings.has(n);
    }),
    province: apiData?.province || [],
    accessibility_features: (apiData?.accessibility_features || []).filter(isFacilityPresent),
    additionalFacilities: (apiData?.additionalFacilities || []).filter(isFacilityPresent),
    activities: (apiData?.activities || []).filter(isFacilityPresent),
  };

  // Per-item counts for groups 2-4 (using same facility_${id} counts already collected)
  for (const f of narrowedApiData.accessibility_features) {
    if (counts[`facility_${f.id}`] !== undefined) counts[`accessibility_${f.id}`] = counts[`facility_${f.id}`];
  }

  // Property type counts — match by numeric ID first, then by English/Mongolian name
  const anyTypeData = hotels.some(h => !!(h.property_type || '').trim());
  for (const pt of canonicalPropertyTypes) {
    const en = pt.name_en?.toLowerCase() || '';
    const mn = pt.name_mn?.toLowerCase() || '';
    let c = 0;
    for (const h of hotels) {
      const raw = (h.property_type || '').trim();
      if (!raw) continue;
      const numericId = parseInt(raw, 10);
      if (!isNaN(numericId) && numericId === pt.id) {
        c++;
      } else {
        const t = raw.toLowerCase();
        if (t === en || t === mn || t.includes(en) || en.includes(t) || t.includes(mn) || mn.includes(t)) c++;
      }
    }
    if (c > 0) counts[`propertyType_${pt.id}`] = c;
  }

  // Always show all 14 canonical property types; counts shown next to each where available
  narrowedApiData.property_types = canonicalPropertyTypes;

  return {
    narrowedApiData,
    filterCounts: counts,
    priceMin: Math.floor(priceMin),
    priceMax: Math.ceil(priceMax) || 1000000,
    discountedCount,
  };
}
