import type { SearchHotelResult, HotelFacility } from '@/types/api';

interface PropertyType { id: number; name_en: string; name_mn: string }
interface Facility { id: number; name_en: string; name_mn: string }
interface Rating { id: number; rating: string }
interface Province { id: number; name: string }
interface AccessibilityFeature { id: number; name_en: string; name_mn: string }

export interface CombinedApiData {
  property_types: PropertyType[];
  facilities: Facility[];
  ratings: Rating[];
  province: Province[];
  accessibility_features: AccessibilityFeature[];
}

export interface DerivedFacets {
  /** Combined-data narrowed to ONLY options that appear in current results */
  narrowedApiData: CombinedApiData;
  /** counts keyed as `facility_${id}`, `rating_${stars}`, `propertyType_${id}` */
  filterCounts: Record<string, number>;
  /** Min/Max price across results' cheapest_room */
  priceMin: number;
  priceMax: number;
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
  }

  if (priceMin === Infinity) priceMin = 0;

  // Narrow combined-data
  const narrowedApiData: CombinedApiData = {
    property_types: (apiData?.property_types || []).filter(pt => {
      const en = pt.name_en?.toLowerCase() || '';
      const mn = pt.name_mn?.toLowerCase() || '';
      return presentPropertyTypes.size === 0
        ? true // if hotels don't expose property_type, keep all rather than hiding the section
        : Array.from(presentPropertyTypes).some(pt2 => pt2.includes(en) || pt2.includes(mn) || en.includes(pt2) || mn.includes(pt2));
    }),
    facilities: (apiData?.facilities || []).filter(f => {
      if (presentFacilityIds.has(f.id)) return true;
      // fallback: name match against string-shaped facilities
      const en = (f.name_en || '').toLowerCase();
      const mn = (f.name_mn || '').toLowerCase();
      return Array.from(presentFacilityNames).some(name => name.includes(en) || name.includes(mn) || en.includes(name) || mn.includes(name));
    }),
    ratings: (apiData?.ratings || []).filter(r => {
      const n = parseInt(r.rating.match(/\d+/)?.[0] || '0', 10);
      return n > 0 && presentRatings.has(n);
    }),
    province: apiData?.province || [],
    accessibility_features: apiData?.accessibility_features || [],
  };

  // Property type counts (best-effort, name match)
  for (const pt of narrowedApiData.property_types) {
    const en = pt.name_en?.toLowerCase() || '';
    const mn = pt.name_mn?.toLowerCase() || '';
    let c = 0;
    for (const h of hotels) {
      const t = (h.property_type || '').toLowerCase();
      if (!t) continue;
      if (t.includes(en) || t.includes(mn) || en.includes(t) || mn.includes(t)) c++;
    }
    if (c > 0) counts[`propertyType_${pt.id}`] = c;
  }

  return {
    narrowedApiData,
    filterCounts: counts,
    priceMin: Math.floor(priceMin),
    priceMax: Math.ceil(priceMax) || 1000000,
  };
}
