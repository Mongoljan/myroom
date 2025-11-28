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
        'placeholder',
        'temp'
      ];
      
      for (const pattern of problematicPatterns) {
        if (url.includes(pattern)) {
          console.warn(`Removing problematic image URL: ${url}`);
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
      if (process.env.NODE_ENV !== 'production') console.log('[API] →', fullUrl);
      
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
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (cacheOpts && isGet) { ApiCache.set(cacheOpts.key, data); ApiCache.clearInFlight(cacheOpts.key); }
      if (process.env.NODE_ENV !== 'production') {
        console.log('[API] ←', {
          url: fullUrl,
          status: response.status,
          keys: typeof data === 'object' && data ? Object.keys(data).slice(0,6) : [],
          count: (typeof data === 'object' && data && 'count' in data)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (data as any).count
            : (Array.isArray(data) ? data.length : undefined)
        });
      }
      
      // Clean up any invalid image URLs
      if (data && typeof data === 'object') {
        this.sanitizeImageUrls(data);
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
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
          console.warn('[searchHotels] name_id present -> ignoring other location/name fields');
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
          console.warn('[searchHotels] name present -> ignoring province/soum/district/location');
        }
      }
      delete sanitized.province_id;
      delete sanitized.soum_id;
      delete sanitized.district;
      delete sanitized.location;
    } else if (sanitized.province_id || sanitized.soum_id || sanitized.district) {
      if (sanitized.location) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[searchHotels] province/soum/district present -> ignoring legacy location');
        }
        delete sanitized.location;
      }
    }

    console.log('Enhanced search params (sanitized):', sanitized);
    console.log('name_id value:', sanitized.name_id, 'type:', typeof sanitized.name_id);

    const searchParams = new URLSearchParams();

    // Handle different search modes
    if (sanitized.name_id) {
      // Exact hotel ID search - only send name_id
      searchParams.append('name_id', sanitized.name_id.toString());
      console.log('API Service - Added name_id to search params:', sanitized.name_id);
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

    console.log('Search URL params:', searchParams.toString());
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

  // Get hotel details - using search API with specific hotel ID
  static async getHotelDetails(hotelId: number) {
    try {
      // Use search API with name_id to get specific hotel details
      const searchResult = await this.searchHotels({
        name_id: hotelId,
        check_in: new Date().toISOString().split('T')[0], // Today
        check_out: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // Tomorrow
        adults: 2,
        children: 0,
        rooms: 1,
        acc_type: 'hotel'
      });
      
      if (searchResult.results && searchResult.results.length > 0) {
        return searchResult.results[0]; // Return the first (and likely only) result
      } else {
        throw new Error(`Hotel with ID ${hotelId} not found`);
      }
    } catch (error) {
      console.error('Failed to fetch hotel details:', error);
      // Fallback to mock data if API fails
      return this.getHotelDetailsMock(hotelId);
    }
  }
  
  // Fallback mock data method
  private static getHotelDetailsMock(hotelId: number) {
    return {
      hotel_id: hotelId,
      property_name: hotelId === 1 ? 'Grand Hotel Ulaanbaatar' : 'Blue Sky Hotel',
      location: {
        province_city: 'Ulaanbaatar',
        soum: hotelId === 1 ? 'Chingeltei' : 'Sukhbaatar',
        district: `District ${hotelId}`
      },
      images: {
        cover: {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          description: 'Hotel exterior'
        },
        gallery: [
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            description: 'Hotel exterior'
          },
          {
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
            description: 'Hotel room'
          },
          {
            url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
            description: 'Hotel lobby'
          }
        ]
      },
      rating_stars: {
        id: hotelId,
        label: hotelId === 1 ? '4 Star Hotel' : '5 Star Hotel',
        value: hotelId === 1 ? '4' : '5'
      },
      google_map: '',
      general_facilities: hotelId === 1 
        ? ['Free WiFi', 'Restaurant', 'Room Service', 'Parking', 'Fitness Center']
        : ['Free WiFi', 'Restaurant', 'Spa', 'Pool', 'Concierge'],
      description: `Experience luxury and comfort at ${hotelId === 1 ? 'Grand Hotel Ulaanbaatar' : 'Blue Sky Hotel'}. Located in the heart of Ulaanbaatar, we offer world-class amenities and exceptional service.`
    };
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
      console.error('Failed to fetch property policies:', error);
      throw error;
    }
  }

  // Get property basic info
  static async getPropertyBasicInfo(propertyId: number): Promise<PropertyBasicInfo[]> {
    try {
      return this.request<PropertyBasicInfo[]>(`/property-basic-info/?property=${propertyId}`);
    } catch (error) {
      console.error('Failed to fetch property basic info:', error);
      throw error;
    }
  }

  // Get confirm address
  static async getConfirmAddress(propertyId: number): Promise<ConfirmAddress[]> {
    try {
      return this.request<ConfirmAddress[]>(`/confirm-address?property=${propertyId}`);
    } catch (error) {
      console.error('Failed to fetch confirm address:', error);
      throw error;
    }
  }

  // Get property images
  static async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    try {
      return this.request<PropertyImage[]>(`/property-images/?property=${propertyId}`);
    } catch (error) {
      console.error('Failed to fetch property images:', error);
      throw error;
    }
  }

  // Get property details
  static async getPropertyDetails(propertyId: number): Promise<PropertyDetails[]> {
    try {
      return this.request<PropertyDetails[]>(`/property-details/?property=${propertyId}`);
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      throw error;
    }
  }

  // Get additional info
  static async getAdditionalInfo(infoId: number): Promise<AdditionalInfo> {
    try {
      return this.request<AdditionalInfo>(`/additionalInfo/${infoId}`);
    } catch (error) {
      console.error('Failed to fetch additional info:', error);
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