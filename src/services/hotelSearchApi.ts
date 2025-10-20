import { SearchResponse, SearchHotelResult } from '@/types/api';

interface SearchParams {
  location?: string;
  name?: string;
  name_id?: number;
  province_id?: number;
  soum_id?: number;
  district?: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms: number;
  acc_type: string;
}

export class HotelSearchService {
  private static baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.kacc.mn/api';

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  static async searchHotels(params: SearchParams): Promise<SearchResponse> {
    // Enforce mutual exclusivity rules
    if (params.name_id && (params.name || params.province_id || params.soum_id || params.location)) {
      throw new Error('name_id cannot be used with other location parameters');
    }

    if (params.name && (params.province_id || params.soum_id || params.location)) {
      throw new Error('name cannot be used with province_id, soum_id, or location');
    }

    if ((params.province_id || params.soum_id) && params.location) {
      throw new Error('province_id/soum_id cannot be used with location');
    }

    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    console.log('Search parameters:', params);
    console.log('Query string:', queryParams.toString());

    return this.request<SearchResponse>(`/search/hotels/?${queryParams.toString()}`);
  }

  // Removed hardcoded mock hotel data - using real API only

  static async getHotelDetails(hotelId: number) {
    try {
      return await this.request(`/hotels/${hotelId}/`);
    } catch (error) {
      console.error('Hotel details API failed:', error);
      throw error; // Let the calling code handle the error instead of returning fake data
    }
  }
}