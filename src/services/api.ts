import { 
  Room, 
  AvailabilityResponse, 
  CreateBookingRequest, 
  CreateBookingResponse,
  CheckBookingResponse,
  BookingActionRequest,
  ChangeDateRequest,
  BookingActionResponse,
  SearchResponse,
  RoomPrice,
  FinalPrice,
  AllRoomData,
  CombinedData,
  AllData,
  RoomFeature,
  PropertyPolicy,
  PropertyBasicInfo,
  ConfirmAddress,
  PropertyImage,
  AdditionalInfo,
  PropertyDetails
} from '@/types/api';

// Allow overriding API base via env var; fallback to dev endpoint
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.kacc.mn/api';

// Lightweight in-memory cache & in-flight deduplication (per runtime instance)
interface CacheEntry<T> { data: T; timestamp: number }
class ApiCache {
  private static store: Map<string, CacheEntry<unknown>> = new Map();
  private static inFlight: Map<string, Promise<unknown>> = new Map();
  static TTL = {
    LONG: 30 * 60 * 1000, // reference data
    MED: 5 * 60 * 1000,
    SHORT: 60 * 1000
  } as const;
  static get<T>(key: string, ttl: number): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttl) { this.store.delete(key); return null; }
    return entry.data as T;
  }
  static set<T>(key: string, data: T) { this.store.set(key, { data, timestamp: Date.now() }); }
  static getInFlight<T>(key: string): Promise<T> | undefined { return this.inFlight.get(key) as Promise<T> | undefined; }
  static setInFlight<T>(key: string, p: Promise<T>): void { this.inFlight.set(key, p); }
  static clearInFlight(key: string) { this.inFlight.delete(key); }
}

export class ApiService {
  // Clean up invalid image URLs to prevent 404 errors
  private static sanitizeImageUrls(obj: Record<string, unknown>): void {
    if (!obj || typeof obj !== 'object') return;
    
    const processImageUrl = (url: string): string => {
      if (!url) return '';
      
      // Check for URLs that are likely to 404
      const problematicPatterns = [
        'closeup-shot-waving-flag-mongolia',
        'nonexistent',
        'placeholder'
      ];
      
      for (const pattern of problematicPatterns) {
        if (url.includes(pattern)) {
          return ''; // Return empty string to trigger fallback
        }
      }
      
      return url;
    };
    
    // Recursively process object properties
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key] as unknown;
        
        if (typeof value === 'string' && (key.includes('url') || key.includes('image'))) {
          obj[key] = processImageUrl(value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              this.sanitizeImageUrls(item as Record<string, unknown>);
            } else if (typeof item === 'string' && (key.includes('url') || key.includes('image'))) {
              (value as string[])[index] = processImageUrl(item);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          this.sanitizeImageUrls(value as Record<string, unknown>);
        }
      }
    }
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheOpts?: { key: string; ttl: number }
  ): Promise<T> {
    try {
      const fullUrl = `${BASE_URL}${endpoint}`;
      const isGet = !options.method || options.method.toUpperCase() === 'GET';
      if (cacheOpts && isGet) {
        const cached = ApiCache.get<T>(cacheOpts.key, cacheOpts.ttl);
        if (cached) return cached;
        const inflight = ApiCache.getInFlight<T>(cacheOpts.key);
        if (inflight) return inflight;
      }
      // Build headers object  
      const headers: Record<string, string> = {};
      
      // Copy existing headers if they exist
      if (options.headers) {
        if (options.headers instanceof Headers) {
          options.headers.forEach((value, key) => {
            headers[key] = value;
          });
        } else if (Array.isArray(options.headers)) {
          options.headers.forEach(([key, value]) => {
            headers[key] = value;
          });
        } else {
          Object.assign(headers, options.headers);
        }
      }
      
      // Only add Content-Type for POST/PUT/PATCH requests
      if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
        headers['Content-Type'] = 'application/json';
      }
      
  const fetchPromise = fetch(fullUrl, { ...options, headers });
  if (cacheOpts && isGet) ApiCache.setInFlight(cacheOpts.key, fetchPromise as unknown as Promise<T>);
  const response = await fetchPromise;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (cacheOpts && isGet) { ApiCache.set(cacheOpts.key, data); ApiCache.clearInFlight(cacheOpts.key); }
      
      // Clean up any invalid image URLs
      if (data && typeof data === 'object') {
        this.sanitizeImageUrls(data);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Search hotels with enhanced parameters
  static async searchHotels(params: {
    // Location parameters (legacy)
    location?: string;
    
    // New search parameters
    name?: string;           // Text search for hotel names
    name_id?: number;        // Exact hotel ID search
    province_id?: number;    // Province ID for location-based search
    soum_id?: number;        // Soum ID for location-based search
    district?: string;       // District name for location-based search
    
    // Booking parameters
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    rooms: number;
    acc_type: string;
  }): Promise<SearchResponse> {
    // Enforce mutual exclusivity rules: only one of (name_id | name | province/soum/district | location)
    // If name_id provided, ignore all other location/name fields.
    // If name provided, ignore province/soum/location.
    // If province/soum provided, ignore legacy location.
    const sanitized = { ...params };
    if (sanitized.name_id) {
      if (sanitized.name || sanitized.province_id || sanitized.soum_id || sanitized.district || sanitized.location) {
        if (process.env.NODE_ENV !== 'production') {
        }
      }
      delete sanitized.name;
      delete sanitized.province_id;
      delete sanitized.soum_id;
      delete sanitized.district;
      delete sanitized.location;
    } else if (sanitized.name) {
      if (sanitized.province_id || sanitized.soum_id || sanitized.district || sanitized.location) {
        if (process.env.NODE_ENV !== 'production') {
        }
      }
      delete sanitized.province_id;
      delete sanitized.soum_id;
      delete sanitized.district;
      delete sanitized.location;
    } else if (sanitized.province_id || sanitized.soum_id || sanitized.district) {
      if (sanitized.location) {
        if (process.env.NODE_ENV !== 'production') {
        }
        delete sanitized.location;
      }
    }

    const searchParams = new URLSearchParams();

    // Handle different search modes
    if (sanitized.name_id) {
      // Exact hotel ID search - only send name_id
      searchParams.append('name_id', sanitized.name_id.toString());
    } else if (sanitized.name) {
      // Text search for hotel names
      searchParams.append('name', sanitized.name);
    } else if (sanitized.province_id || sanitized.soum_id) {
      // Location-based search with IDs
      if (sanitized.province_id) searchParams.append('province_id', sanitized.province_id.toString());
      if (sanitized.soum_id) searchParams.append('soum_id', sanitized.soum_id.toString());
      if (sanitized.district) searchParams.append('district', sanitized.district);
    } else if (sanitized.location) {
      // Legacy location string search (fallback)
      searchParams.append('location', sanitized.location);
    }
    
    // Always append booking parameters
    searchParams.append('check_in', sanitized.check_in);
    searchParams.append('check_out', sanitized.check_out);
    searchParams.append('adults', sanitized.adults.toString());
    searchParams.append('children', sanitized.children.toString());
    searchParams.append('rooms', sanitized.rooms.toString());
    searchParams.append('acc_type', sanitized.acc_type);

    return this.request<SearchResponse>(`/search/?${searchParams.toString()}`);
  }

  // Get suggested hotels by tab/category
  static async getSuggestedHotels(tab: 'popular' | 'discount' | 'top_rated' | 'cheapest' | 'new' = 'popular'): Promise<{
    count: number;
    results: Array<{
      hotel: {
        pk: number;
        PropertyName: string;
        location: string;
        property_type: number;
        created_at: string;
      };
      cheapest_room: {
        id: number;
        base_price: number;
        final_price: number;
        images: Array<{ id: number; image: string; description: string }>;
        adultQty: number;
        childQty: number;
      } | null;
    }>;
  }> {
    const cacheKey = `suggested_hotels_${tab}`;
    return this.request(
      `/suggestHotels/?tab=${tab}`,
      {},
      { key: cacheKey, ttl: ApiCache.TTL.MED }
    );
  }

  // Removed hardcoded mock hotel data - using real API only

  // Get hotel details - using search API with specific hotel ID.
  // Tries the given dates first, then falls back to future windows.
  // If the search API never returns the hotel (e.g. no availability configured),
  // falls back to building a minimal SearchHotelResult from property endpoints
  // so the hotel page can still render.
  static async getHotelDetails(hotelId: number, checkIn?: string, checkOut?: string) {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    // Build a list of date windows to try: requested dates first, then fallbacks
    const windows: Array<[string, string]> = [];
    if (checkIn && checkOut) windows.push([checkIn, checkOut]);
    for (const offset of [0, 29, 59, 89]) {
      const start = new Date(today);
      start.setDate(start.getDate() + offset);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      windows.push([fmt(start), fmt(end)]);
    }

    for (const [ci, co] of windows) {
      try {
        const result = await this.searchHotels({
          name_id: hotelId,
          check_in: ci,
          check_out: co,
          adults: 2,
          children: 0,
          rooms: 1,
          acc_type: 'hotel'
        });
        if (result.results && result.results.length > 0) {
          return result.results[0];
        }
      } catch {
        // try next window
      }
    }

    // Search API has no availability for this hotel across all windows.
    // Build a SearchHotelResult from the property-level endpoints instead.
    try {
      const [basicInfoArr, detailsArr, imagesArr] = await Promise.all([
        this.getPropertyBasicInfo(hotelId).catch(() => [] as PropertyBasicInfo[]),
        this.getPropertyDetails(hotelId).catch(() => [] as PropertyDetails[]),
        this.getPropertyImages(hotelId).catch(() => [] as PropertyImage[]),
      ]);

      const basicInfo = basicInfoArr[0];
      const details = detailsArr[0];
      if (!basicInfo) return null; // Hotel truly doesn't exist

      const coverImage = imagesArr.find(img => img.is_profile) ?? imagesArr[0];
      const gallery = imagesArr
        .filter(img => img !== coverImage)
        .map(img => ({ url: img.image, description: img.description }));

      const starValue = basicInfo.star_rating;
      const starLabel = `${starValue} star${starValue !== 1 ? 's' : ''}`;

      return {
        hotel_id: hotelId,
        property_name: basicInfo.property_name_mn || basicInfo.property_name_en,
        property_name_en: basicInfo.property_name_en,
        location: { province_city: null, soum: null, district: null },
        nights: 1,
        rooms_possible: basicInfo.available_rooms,
        cheapest_room: null,
        min_estimated_total: 0,
        images: {
          cover: coverImage ? coverImage.image : '',
          gallery,
        },
        rating_stars: { id: starValue, value: `${starValue} star`, label: starLabel },
        google_map: details?.google_map ?? '',
        general_facilities: details?.general_facilities ?? [],
        additional_facilities: details?.additional_facilities ?? [],
        has_active_commission: false,
      };
    } catch {
      return null;
    }
  }

  // Get rooms for a specific hotel
  static async getRoomsInHotel(hotelId: number): Promise<Room[]> {
    const endpoint = `/roomsInHotels/?hotel=${hotelId}`;
    return this.request<Room[]>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.SHORT });
  }

  // Get all room data (types, bed types, categories, etc.)
  static async getAllRoomData(): Promise<AllRoomData> {
    const endpoint = `/all-room-data/`;
    return this.request<AllRoomData>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.LONG });
  }

  // Get combined data (includes facilities, provinces, etc.)
  static async getCombinedData(): Promise<CombinedData> {
    const endpoint = `/combined-data/`;
    return this.request<CombinedData>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.LONG });
  }

  // Get room features
  // Removed duplicate getRoomFeatures (use getFeatures instead)

  // Get room prices for a hotel
  static async getRoomPrices(hotelId: number): Promise<RoomPrice[]> {
    const endpoint = `/room-prices/?hotel=${hotelId}`;
    return this.request<RoomPrice[]>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.SHORT });
  }

  // Get final price for a room
  static async getFinalPrice(roomPriceId: number): Promise<FinalPrice> {
    const endpoint = `/final-price/${roomPriceId}/`;
    return this.request<FinalPrice>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.SHORT });
  }

  // Get all room-related data (facilities, amenities, etc.)
  static async getAllData(): Promise<AllData> {
    const endpoint = '/all-data/';
    return this.request<AllData>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.LONG });
  }

  static async getFeatures(): Promise<RoomFeature[]> {
    const endpoint = '/features/';
    return this.request<RoomFeature[]>(endpoint, {}, { key: endpoint, ttl: ApiCache.TTL.LONG });
  }

  // Check room availability
  static async checkAvailability(
    hotelId: number,
    roomTypeId: number,
    roomCategoryId: number,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
      hotel_id: hotelId.toString(),
      room_type_id: roomTypeId.toString(),
      room_category_id: roomCategoryId.toString(),
      check_in: checkIn,
      check_out: checkOut,
    });
    
    return this.request<AvailabilityResponse>(
      `/bookings/available_rooms/?${params.toString()}`
    );
  }

  // Create a new booking
  static async createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    return this.request<CreateBookingResponse>('/bookings/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Check booking details
  static async checkBooking(
    bookingCode: string, 
    pinCode: string
  ): Promise<CheckBookingResponse> {
    const params = new URLSearchParams({
      booking_code: bookingCode,
      pin_code: pinCode,
    });
    
    return this.request<CheckBookingResponse>(
      `/bookings/check/?${params.toString()}`
    );
  }

  // Cancel booking
  static async cancelBooking(data: BookingActionRequest): Promise<BookingActionResponse> {
    return this.request<BookingActionResponse>('/bookings/cancel/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Change booking dates
  static async changeDates(data: ChangeDateRequest): Promise<BookingActionResponse> {
    return this.request<BookingActionResponse>('/bookings/changeDate/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Confirm booking
  static async confirmBooking(data: BookingActionRequest): Promise<BookingActionResponse> {
    return this.request<BookingActionResponse>('/bookings/confirm/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get property policies
  static async getPropertyPolicies(propertyId: number): Promise<PropertyPolicy[]> {
    try {
      return this.request<PropertyPolicy[]>(`/property-policies/?property=${propertyId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get property basic info
  static async getPropertyBasicInfo(propertyId: number): Promise<PropertyBasicInfo[]> {
    try {
      return this.request<PropertyBasicInfo[]>(`/property-basic-info/?property=${propertyId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get confirm address
  static async getConfirmAddress(propertyId: number): Promise<ConfirmAddress[]> {
    try {
      return this.request<ConfirmAddress[]>(`/confirm-address?property=${propertyId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get property images
  static async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    try {
      return this.request<PropertyImage[]>(`/property-images/?property=${propertyId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get property details
  static async getPropertyDetails(propertyId: number): Promise<PropertyDetails[]> {
    try {
      return this.request<PropertyDetails[]>(`/property-details/?property=${propertyId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get additional info
  static async getAdditionalInfo(infoId: number): Promise<AdditionalInfo> {
    try {
      return this.request<AdditionalInfo>(`/additionalInfo/${infoId}`);
    } catch (error) {
      throw error;
    }
  }
}

// Utility functions for formatting
export const formatCurrency = (amount: number, currency = 'MNT'): string => {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};