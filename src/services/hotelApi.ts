// Hotel API Service

export interface HotelInfo {
  pk: number;
  register: string;
  CompanyName: string;
  PropertyName: string;
  location: string;
  property_type: number;
  phone: string;
  mail: string;
  is_approved: boolean;
  created_at: string;
  owner?: {
    id: number;
    name: string;
    position: string;
    contact_number: string;
    email: string;
    approved: boolean;
  } | null;
  profile_image?: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dev.kacc.mn';

// Cache for hotel data
let hotelCache: {
  data: HotelInfo[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class HotelService {
  static async getApprovedHotels(): Promise<HotelInfo[]> {
    // Check cache
    const now = Date.now();
    if (hotelCache.data && (now - hotelCache.timestamp) < CACHE_DURATION) {
      return hotelCache.data;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/approved/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hotels: ${response.status}`);
      }

      const data = await response.json();

      // Update cache
      hotelCache = {
        data,
        timestamp: now,
      };

      return data;
    } catch (error) {
      console.error('Error fetching approved hotels:', error);
      throw error;
    }
  }

  static async getHotelById(hotelId: number): Promise<HotelInfo | undefined> {
    try {
      const hotels = await this.getApprovedHotels();
      return hotels.find(hotel => hotel.pk === hotelId);
    } catch (error) {
      console.error(`Error finding hotel with id ${hotelId}:`, error);
      return undefined;
    }
  }

  static async getHotelsByIds(hotelIds: number[]): Promise<Map<number, HotelInfo>> {
    try {
      const hotels = await this.getApprovedHotels();
      const hotelMap = new Map<number, HotelInfo>();

      hotels.forEach(hotel => {
        if (hotelIds.includes(hotel.pk)) {
          hotelMap.set(hotel.pk, hotel);
        }
      });

      return hotelMap;
    } catch (error) {
      console.error('Error fetching hotels by ids:', error);
      return new Map();
    }
  }

  static async getHotelByName(hotelName: string): Promise<HotelInfo | undefined> {
    try {
      const hotels = await this.getApprovedHotels();
      // Try exact match first
      let hotel = hotels.find(h => h.PropertyName === hotelName);

      // If no exact match, try case-insensitive
      if (!hotel) {
        hotel = hotels.find(h =>
          h.PropertyName.toLowerCase() === hotelName.toLowerCase()
        );
      }

      // If still no match, try partial match
      if (!hotel) {
        hotel = hotels.find(h =>
          h.PropertyName.toLowerCase().includes(hotelName.toLowerCase()) ||
          hotelName.toLowerCase().includes(h.PropertyName.toLowerCase())
        );
      }

      return hotel;
    } catch (error) {
      console.error(`Error finding hotel by name ${hotelName}:`, error);
      return undefined;
    }
  }

  static async getAllHotelsMap(): Promise<Map<string, HotelInfo>> {
    try {
      const hotels = await this.getApprovedHotels();
      const hotelMap = new Map<string, HotelInfo>();

      hotels.forEach(hotel => {
        // Map by both ID and name for easy lookup
        hotelMap.set(hotel.PropertyName, hotel);
        hotelMap.set(hotel.pk.toString(), hotel);
      });

      return hotelMap;
    } catch (error) {
      console.error('Error creating hotels map:', error);
      return new Map();
    }
  }

  static getHotelImageUrl(imagePath?: string | null): string | null {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it starts with /media/, append to API base URL
    if (imagePath.startsWith('/media/')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    // Otherwise, assume it's a relative path that needs /media/ prefix
    return `${API_BASE_URL}/media/${imagePath}`;
  }
}