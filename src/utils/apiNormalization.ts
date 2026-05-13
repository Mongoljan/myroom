/**
 * API Data Normalization Utilities
 * 
 * This utility handles the inconsistencies between different API endpoints:
 * - Search API: uses hotel_id, property_name
 * - Suggested Hotels API: uses hotel.pk, hotel.PropertyName  
 * - Wishlist API: uses hotel.id, hotel.PropertyName
 * 
 * All data is normalized to the Wishlist API structure (id, PropertyName) 
 * since it's the most consistent format.
 */

export interface NormalizedHotel {
  id: number;
  PropertyName: string;
  CompanyName?: string;
  location?: {
    province_city?: string;
    soum?: string;
    district?: string | null;
  };
  star_rating?: string | null;
  avg_rating?: number | null;
  review_count?: number;
  min_price?: number | null;
  profile_image?: string | null;
  property_type?: string | null;
  images?: {
    cover?: string;
    gallery?: Array<{
      url: string;
      description: string;
    }>;
  };
  rating_stars?: {
    id: number;
    label: string;
    value: string;
  };
  general_facilities?: string[];
  google_map?: string;
}

// Define types for room data
export interface RoomData {
  final_price?: number;
  final_price_after_commission?: number;
  base_price?: number;
  price_per_night_final?: number;
  images?: Array<{ url: string; description?: string }>;
  [key: string]: unknown;
}

export interface NormalizedSearchResult {
  hotel: NormalizedHotel;
  cheapest_room?: RoomData;
  nights?: number;
  rooms_possible?: number;
  min_estimated_total?: number;
}

// Define search API input types
interface SearchApiInput {
  hotel_id: number;
  property_name: string;
  location?: {
    province_city?: string;
    soum?: string;
    district?: string | null;
  };
  rating_stars?: { id: number; label: string; value: string };
  min_estimated_total?: number;
  images?: { cover?: string; gallery?: Array<{ url: string; description: string }> };
  general_facilities?: string[];
  google_map?: string;
  cheapest_room?: RoomData;
  nights?: number;
  rooms_possible?: number;
  [key: string]: unknown;
}

/**
 * Normalize hotel data from Search API format to standard format
 */
export function normalizeSearchHotel(searchResult: SearchApiInput): NormalizedSearchResult {
  const hotel: NormalizedHotel = {
    id: searchResult.hotel_id,
    PropertyName: searchResult.property_name,
    location: searchResult.location || {
      province_city: undefined,
      soum: undefined,
      district: undefined
    },
    star_rating: searchResult.rating_stars?.value || null,
    avg_rating: null, // Search API doesn't provide this
    review_count: 0, // Search API doesn't provide this
    min_price: searchResult.min_estimated_total,
    profile_image: searchResult.images?.cover || null,
    property_type: null, // Search API doesn't provide this consistently
    images: searchResult.images,
    rating_stars: searchResult.rating_stars,
    general_facilities: searchResult.general_facilities || [],
    google_map: searchResult.google_map || '',
  };

  return {
    hotel,
    cheapest_room: searchResult.cheapest_room,
    nights: searchResult.nights,
    rooms_possible: searchResult.rooms_possible,
    min_estimated_total: searchResult.min_estimated_total,
  };
}

// Define suggested API input types
interface SuggestedApiInput {
  hotel: {
    pk: number;
    PropertyName: string;
    CompanyName?: string;
    location?: string | {
      province_city?: string;
      soum?: string;
      district?: string | null;
    };
    property_type?: string | number;
    [key: string]: unknown;
  };
  cheapest_room?: RoomData;
  [key: string]: unknown;
}

/**
 * Normalize hotel data from Suggested Hotels API format to standard format
 */
export function normalizeSuggestedHotel(suggestedResult: SuggestedApiInput): NormalizedSearchResult {
  const hotelData = suggestedResult.hotel;
  
  // Handle location data - suggested API might have string location or no location
  let location = {
    province_city: undefined as string | undefined,
    soum: undefined as string | undefined,
    district: undefined as string | undefined | null
  };
  
  if (hotelData.location) {
    if (typeof hotelData.location === 'string') {
      location.province_city = hotelData.location;
    } else if (typeof hotelData.location === 'object') {
      location = {
        province_city: hotelData.location.province_city || undefined,
        soum: hotelData.location.soum || undefined,
        district: hotelData.location.district || undefined,
      };
    }
  }
  
  const hotel: NormalizedHotel = {
    id: hotelData.pk,
    PropertyName: hotelData.PropertyName,
    CompanyName: hotelData.CompanyName,
    location,
    star_rating: null, // Not provided in suggested API
    avg_rating: null,
    review_count: 0,
    min_price: (suggestedResult.cheapest_room?.final_price_after_commission ?? suggestedResult.cheapest_room?.final_price) ?? null,
    // Prefer is_profile gallery image, then cover
    profile_image: (suggestedResult as Record<string, unknown> & { images?: { gallery?: Array<{ url: string; is_profile: boolean }>; cover?: string } }).images?.gallery?.find(g => g.is_profile)?.url
      || (suggestedResult as Record<string, unknown> & { images?: { cover?: string } }).images?.cover
      || null,
    property_type: hotelData.property_type?.toString() || null,
    rating_stars: {
      id: 0,
      label: 'No rating available',
      value: '0'
    },
    general_facilities: [],
    google_map: '',
  };

  return {
    hotel,
    cheapest_room: suggestedResult.cheapest_room,
  };
}

/**
 * Normalize hotel data from Wishlist API format (already in correct format)
 */
export function normalizeWishlistHotel(wishlistHotel: NormalizedHotel): NormalizedHotel {
  // Wishlist API already uses the correct format, just pass through
  return wishlistHotel;
}

// Define generic hotel data type for extraction functions
interface GenericHotelData {
  id?: number;
  hotel_id?: number;
  pk?: number;
  [key: string]: unknown;
}

/**
 * Extract hotel ID from various API response formats
 */
export function extractHotelId(hotelData: GenericHotelData): number {
  // Try different possible ID field names
  return hotelData.id || hotelData.hotel_id || hotelData.pk || 0;
}

interface HotelNameData {
  PropertyName?: string;
  property_name?: string;
  [key: string]: unknown;
}

/**
 * Extract hotel name from various API response formats
 */
export function extractHotelName(hotelData: HotelNameData): string {
  return hotelData.PropertyName || hotelData.property_name || 'Unknown Hotel';
}

interface HotelLocationData {
  location?: string | {
    province_city?: string;
    soum?: string;
    district?: string | null;
  };
  [key: string]: unknown;
}

/**
 * Extract hotel location from various API response formats
 */
export function extractHotelLocation(hotelData: HotelLocationData): string {
  if (hotelData.location) {
    if (typeof hotelData.location === 'string') {
      return hotelData.location;
    }
    if (typeof hotelData.location === 'object') {
      const parts = [
        hotelData.location.province_city,
        hotelData.location.soum,
        hotelData.location.district
      ].filter(Boolean);
      return parts.join(', ');
    }
  }
  return 'Location not specified';
}

interface HotelImageData {
  images?: {
    cover?: string;
    gallery?: Array<{ url: string; description?: string }>;
  };
  profile_image?: string;
  [key: string]: unknown;
}

/**
 * Extract hotel image URL from various API response formats
 */
export function extractHotelImage(hotelData: HotelImageData): string {
  // Try different possible image field structures
  if (hotelData.images?.cover) {
    return hotelData.images.cover;
  }
  if (hotelData.profile_image) {
    return hotelData.profile_image.startsWith('http') 
      ? hotelData.profile_image 
      : `https://dev.kacc.mn${hotelData.profile_image}`;
  }
  if (hotelData.images?.gallery?.[0]?.url) {
    return hotelData.images.gallery[0].url;
  }
  
  // Fallback images
  const fallbacks = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format',
  ];
  
  const hotelId = extractHotelId(hotelData);
  return fallbacks[hotelId % fallbacks.length];
}

interface HotelPriceData {
  min_price?: number;
  min_estimated_total?: number;
  cheapest_room?: {
    final_price?: number;
    price_per_night_final?: number;
  };
  [key: string]: unknown;
}

/**
 * Extract minimum price from various API response formats
 */
export function extractMinPrice(hotelData: HotelPriceData): number | null {
  return hotelData.min_price || 
         hotelData.min_estimated_total || 
         hotelData.cheapest_room?.final_price || 
         hotelData.cheapest_room?.price_per_night_final ||
         null;
}

/**
 * Batch normalize search results
 */
export function normalizeSearchResults(results: SearchApiInput[]): NormalizedSearchResult[] {
  return results.map(normalizeSearchHotel);
}

/**
 * Batch normalize suggested hotel results
 */
export function normalizeSuggestedResults(results: SuggestedApiInput[]): NormalizedSearchResult[] {
  return results.map(normalizeSuggestedHotel);
}