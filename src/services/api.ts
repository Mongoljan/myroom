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
  SearchHotelResult,
  RoomPrice,
  FinalPrice,
  AllRoomData,
  CombinedData,
  AllData,
  RoomFeature
} from '@/types/api';

const BASE_URL = 'https://dev.kacc.mn/api';

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
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const fullUrl = `${BASE_URL}${endpoint}`;
      console.log('Making API request to:', fullUrl);
      
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
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response success:', { 
        url: fullUrl, 
        status: response.status,
        dataKeys: Object.keys(data),
        count: data.count || data.length || 'unknown'
      });
      
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
    console.log('Enhanced search params:', params);
    
    const searchParams = new URLSearchParams();
    
    // Handle different search modes
    if (params.name_id) {
      // Exact hotel ID search - only send name_id
      searchParams.append('name_id', params.name_id.toString());
    } else if (params.name) {
      // Text search for hotel names
      searchParams.append('name', params.name);
    } else if (params.province_id || params.soum_id) {
      // Location-based search with IDs
      if (params.province_id) searchParams.append('province_id', params.province_id.toString());
      if (params.soum_id) searchParams.append('soum_id', params.soum_id.toString());
      if (params.district) searchParams.append('district', params.district);
    } else if (params.location) {
      // Legacy location string search (fallback)
      searchParams.append('location', params.location);
    }
    
    // Always append booking parameters
    searchParams.append('check_in', params.check_in);
    searchParams.append('check_out', params.check_out);
    searchParams.append('adults', params.adults.toString());
    searchParams.append('children', params.children.toString());
    searchParams.append('rooms', params.rooms.toString());
    searchParams.append('acc_type', params.acc_type);

    console.log('Search URL params:', searchParams.toString());
    return this.request<SearchResponse>(`/search?${searchParams.toString()}`);
  }

  // Get hotel search results with mock fallback
  static async searchHotelsMock(_params: {
    location?: string;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    rooms: number;
    acc_type: string;
  }): Promise<SearchHotelResult[]> {
    // Return mock hotel data for testing
    console.log('Using mock data for search parameters:', _params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            hotel_id: 1,
            property_name: 'Grand Hotel Ulaanbaatar',
            location: {
              province_city: 'Ulaanbaatar',
              soum: 'Chingeltei',
              district: 'District 1'
            },
            nights: 2,
            rooms_possible: 5,
            cheapest_room: {
              room_type_id: 1,
              room_category_id: 1,
              room_type_label: 'Standard Room',
              room_category_label: 'Single',
              price_per_night: 150000,
              nights: 2,
              available_in_this_type: 3,
              capacity_per_room_adults: 2,
              capacity_per_room_children: 1,
              capacity_per_room_total: 3,
              estimated_total_for_requested_rooms: 300000
            },
            min_estimated_total: 300000,
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
                }
              ]
            },
            rating_stars: {
              id: 1,
              label: '4 Star Hotel',
              value: '4'
            },
            google_map: '',
            general_facilities: ['Free WiFi', 'Restaurant', 'Room Service', 'Parking', 'Fitness Center']
          },
          {
            hotel_id: 2,
            property_name: 'Blue Sky Hotel',
            location: {
              province_city: 'Ulaanbaatar',
              soum: 'Sukhbaatar',
              district: 'District 2'
            },
            nights: 2,
            rooms_possible: 3,
            cheapest_room: {
              room_type_id: 2,
              room_category_id: 2,
              room_type_label: 'Deluxe Room',
              room_category_label: 'Double',
              price_per_night: 200000,
              nights: 2,
              available_in_this_type: 2,
              capacity_per_room_adults: 2,
              capacity_per_room_children: 1,
              capacity_per_room_total: 3,
              estimated_total_for_requested_rooms: 400000
            },
            min_estimated_total: 400000,
            images: {
              cover: {
                url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
                description: 'Hotel exterior'
              },
              gallery: [
                {
                  url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
                  description: 'Hotel exterior'
                },
                {
                  url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                  description: 'Hotel room'
                }
              ]
            },
            rating_stars: {
              id: 2,
              label: '5 Star Hotel',
              value: '5'
            },
            google_map: '',
            general_facilities: ['Free WiFi', 'Restaurant', 'Spa', 'Pool', 'Concierge']
          }
        ]);
      }, 1000);
    });
  }

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
    return this.request<Room[]>(`/roomsInHotels/?hotel=${hotelId}`);
  }

  // Get all room data (types, bed types, categories, etc.)
  static async getAllRoomData(): Promise<AllRoomData> {
    return this.request<AllRoomData>(`/all-room-data/`);
  }

  // Get combined data (includes facilities, provinces, etc.)
  static async getCombinedData(): Promise<CombinedData> {
    return this.request<CombinedData>(`/combined-data/`);
  }

  // Get room prices for a hotel
  static async getRoomPrices(hotelId: number): Promise<RoomPrice[]> {
    return this.request<RoomPrice[]>(`/room-prices/?hotel=${hotelId}`);
  }

  // Get final price for a room
  static async getFinalPrice(roomPriceId: number): Promise<FinalPrice> {
    return this.request<FinalPrice>(`/final-price/${roomPriceId}/`);
  }

  // Get all room-related data (facilities, amenities, etc.)
  static async getAllData(): Promise<AllData> {
    return this.request<AllData>('/all-data/');
  }

  // Get room features
  static async getFeatures(): Promise<RoomFeature[]> {
    return this.request<RoomFeature[]>('/features/');
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