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

export interface HotelRoom {
  id: number;
  hotel: number;
  room_number: number;
  room_type: number;
  room_category: number;
  room_size: string;
  bed_type: number;
  is_Bathroom: boolean;
  room_Facilities: number[];
  bathroom_Items: number[];
  free_Toiletries: number[];
  food_And_Drink: number[];
  adultQty: number;
  childQty: number;
  outdoor_And_View: number[];
  number_of_rooms: number;
  number_of_rooms_to_sell: number;
  room_Description: string;
  smoking_allowed: boolean;
  images: RoomImage[];
  total_count: number;
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
        console.log(`Trying endpoint: ${endpoint}`);
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
        console.log(`Successfully fetched data from: ${endpoint}`);
        
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
    const bedType = allData.bed_types.find(bt => bt.id === room.bed_type);
    const roomCategory = allData.room_category.find(rc => rc.id === room.room_category);

    const facilitiesDetails = room.room_Facilities
      .map(id => allData.room_facilities.find(rf => rf.id === id))
      .filter(Boolean) as RoomFacility[];

    const bathroomItemsDetails = room.bathroom_Items
      .map(id => allData.bathroom_items.find(bi => bi.id === id))
      .filter(Boolean) as BathroomItem[];

    const freeToiletriesDetails = room.free_Toiletries
      .map(id => allData.free_toiletries.find(ft => ft.id === id))
      .filter(Boolean) as FreeToiletries[];

    const foodAndDrinkDetails = room.food_And_Drink
      .map(id => allData.food_and_drink.find(fd => fd.id === id))
      .filter(Boolean) as FoodAndDrink[];

    const outdoorAndViewDetails = room.outdoor_And_View
      .map(id => allData.outdoor_and_view.find(ov => ov.id === id))
      .filter(Boolean) as OutdoorAndView[];

    return {
      ...room,
      roomTypeName: roomType?.name || 'Unknown',
      bedTypeName: bedType?.name || 'Unknown',
      roomCategoryName: roomCategory?.name || 'Unknown',
      facilitiesDetails,
      bathroomItemsDetails,
      freeToiletriesDetails,
      foodAndDrinkDetails,
      outdoorAndViewDetails
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