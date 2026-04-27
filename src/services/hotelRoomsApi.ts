// Service for handling complex hotel room data APIs

export interface RoomFacility {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface BathroomItem {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface FreeToiletries {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface FoodAndDrink {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface OutdoorAndView {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface RoomType {
  id: number;
  name: string;
  is_custom: boolean;
}

export interface BedType {
  id: number;
  name: string;
  is_custom: boolean;
}

export interface RoomCategory {
  id: number;
  name: string;
  is_custom: boolean;
}

export interface RoomImage {
  id: number;
  image: string;
  description: string;
}

// Price breakdown structure from the API
export interface PriceBreakdown {
  price_after_price_setting: number;
  hotel_discount_amount: number;
  platform_markup_amount: number;
  final_customer_price: number;
}

export interface HotelRoom {
  id: number;
  hotel: number;
  room_number?: number;
  room_type: number;
  room_category: number;
  room_size: string;
  bed_type?: number;
  bed_details?: Array<{ id?: number; bed_type?: number; name?: string; quantity: number }>;
  is_Bathroom: boolean;
  room_Facilities: Array<number | RoomFacility>;
  bathroom_Items: Array<number | BathroomItem>;
  free_Toiletries: Array<number | FreeToiletries>;
  food_And_Drink: Array<number | FoodAndDrink>;
  adultQty: number;
  childQty: number;
  outdoor_And_View: Array<number | OutdoorAndView>;
  number_of_rooms: number;
  number_of_rooms_to_sell: number;
  room_Description: string;
  smoking_allowed: boolean;
  images: RoomImage[];
  total_count: number;
  // New pricing fields from API
  base_price: number | null;
  single_person_price: number | null;
  half_day_price: number | null;
  breakfast_include_price: number | null;
  final_price: number | null;
  price_breakdown: PriceBreakdown;
}

export interface AllRoomData {
  room_facilities: RoomFacility[];
  bathroom_items: BathroomItem[];
  free_toiletries: FreeToiletries[];
  food_and_drink: FoodAndDrink[];
  outdoor_and_view: OutdoorAndView[];
  room_types: RoomType[];
  bed_types: BedType[];
  room_category: RoomCategory[];
}

export interface EnrichedHotelRoom extends HotelRoom {
  roomTypeName: string;
  bedTypeName: string;
  roomCategoryName: string;
  facilitiesDetails: RoomFacility[];
  bathroomItemsDetails: BathroomItem[];
  freeToiletriesDetails: FreeToiletries[];
  foodAndDrinkDetails: FoodAndDrink[];
  outdoorAndViewDetails: OutdoorAndView[];
  // Helper flag to check if room has valid pricing
  hasValidPricing: boolean;
}

class HotelRoomsService {
  private allRoomDataCache: AllRoomData | null = null;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async getAllRoomData(): Promise<AllRoomData> {
    const now = Date.now();
    
    if (this.allRoomDataCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.allRoomDataCache;
    }

    // Try multiple API endpoints in case the URL is different
    const possibleEndpoints = [
      'https://dev.kacc.mn/api/all-data/',
      'https://dev.kacc.mn/api/all-room-data/',
      'https://dev.kacc.mn/api/room-data/'
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Details:', {
            endpoint,
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText
          });
          continue; // Try next endpoint
        }
        
        this.allRoomDataCache = await response.json();
        this.cacheTimestamp = now;
        
        return this.allRoomDataCache!;
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        continue; // Try next endpoint
      }
    }

    console.error('All API endpoints failed, returning empty data structure');
    // Return empty data structure if all APIs fail
    return {
      room_facilities: [],
      bathroom_items: [],
      free_toiletries: [],
      food_and_drink: [],
      outdoor_and_view: [],
      room_types: [],
      bed_types: [],
      room_category: []
    };
  }

  async getHotelRooms(hotelId: number): Promise<HotelRoom[]> {
    try {
      const response = await fetch(`https://dev.kacc.mn/api/roomsInHotels/?hotel=${hotelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Hotel Rooms API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          hotelId: hotelId,
          errorBody: errorText
        });
        throw new Error(`Failed to fetch hotel rooms: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
      return [];
    }
  }

  async getEnrichedHotelRooms(hotelId: number): Promise<EnrichedHotelRoom[]> {
    try {
      const [rooms, allData] = await Promise.all([
        this.getHotelRooms(hotelId),
        this.getAllRoomData()
      ]);

      return rooms.map(room => this.enrichRoomData(room, allData));
    } catch (error) {
      console.error('Error fetching enriched hotel rooms:', error);
      return [];
    }
  }

  private enrichRoomData(room: HotelRoom, allData: AllRoomData): EnrichedHotelRoom {
    const roomType = allData.room_types.find(rt => rt.id === room.room_type);
    const roomCategory = allData.room_category.find(rc => rc.id === room.room_category);

    // bed_details from /roomsInHotels/ ships objects with { id, name, quantity }.
    // Older shape has { bed_type, quantity } and a top-level bed_type number.
    let bedTypeName = 'Unknown';
    let normalizedBedDetails = room.bed_details;
    if (room.bed_details && room.bed_details.length > 0) {
      normalizedBedDetails = room.bed_details.map(b => ({
        ...b,
        name: b.name || allData.bed_types.find(bt => bt.id === (b.bed_type ?? b.id))?.name || '',
      }));
      bedTypeName = normalizedBedDetails
        .map(b => (b.name ? (b.quantity > 1 ? `${b.quantity}× ${b.name}` : b.name) : null))
        .filter(Boolean)
        .join(', ') || 'Unknown';
    } else if (room.bed_type) {
      bedTypeName = allData.bed_types.find(bt => bt.id === room.bed_type)?.name || 'Unknown';
    }

    const resolve = <T extends { id: number; name_en: string; name_mn: string }>(
      list: Array<number | T> | undefined,
      lookup: T[]
    ): T[] => {
      if (!Array.isArray(list)) return [];
      return list
        .map(entry => {
          if (typeof entry === 'number') return lookup.find(x => x.id === entry);
          if (entry && typeof entry === 'object' && 'name_en' in entry) return entry as T;
          if (entry && typeof entry === 'object' && 'id' in entry) return lookup.find(x => x.id === (entry as { id: number }).id);
          return undefined;
        })
        .filter(Boolean) as T[];
    };

    const facilitiesDetails = resolve<RoomFacility>(room.room_Facilities, allData.room_facilities);
    const bathroomItemsDetails = resolve<BathroomItem>(room.bathroom_Items, allData.bathroom_items);
    const freeToiletriesDetails = resolve<FreeToiletries>(room.free_Toiletries, allData.free_toiletries);
    const foodAndDrinkDetails = resolve<FoodAndDrink>(room.food_And_Drink, allData.food_and_drink);
    const outdoorAndViewDetails = resolve<OutdoorAndView>(room.outdoor_And_View, allData.outdoor_and_view);

    // Check if room has valid pricing based on price_breakdown
    // A room is valid if it has a price_breakdown with final_customer_price > 0
    const hasValidPricing = Boolean(
      room.price_breakdown &&
      room.price_breakdown.final_customer_price > 0
    );

    return {
      ...room,
      bed_details: normalizedBedDetails,
      roomTypeName: roomType?.name || 'Unknown',
      bedTypeName,
      roomCategoryName: roomCategory?.name || 'Unknown',
      facilitiesDetails,
      bathroomItemsDetails,
      freeToiletriesDetails,
      foodAndDrinkDetails,
      outdoorAndViewDetails,
      hasValidPricing
    };
  }

  // Helper method to get room facilities by language
  getRoomFacilityName(facility: RoomFacility, language: 'mn' | 'en' = 'mn'): string {
    return language === 'mn' ? facility.name_mn : facility.name_en;
  }

  getBathroomItemName(item: BathroomItem, language: 'mn' | 'en' = 'mn'): string {
    return language === 'mn' ? item.name_mn : item.name_en;
  }

  getFreeToiletriesName(item: FreeToiletries, language: 'mn' | 'en' = 'mn'): string {
    return language === 'mn' ? item.name_mn : item.name_en;
  }

  getFoodAndDrinkName(item: FoodAndDrink, language: 'mn' | 'en' = 'mn'): string {
    return language === 'mn' ? item.name_mn : item.name_en;
  }

  getOutdoorAndViewName(item: OutdoorAndView, language: 'mn' | 'en' = 'mn'): string {
    return language === 'mn' ? item.name_mn : item.name_en;
  }
}

export const hotelRoomsService = new HotelRoomsService();