import { 
  Room, 
  AvailabilityResponse, 
  CreateBookingRequest, 
  CreateBookingResponse,
  CheckBookingResponse,
  BookingActionRequest,
  ChangeDateRequest,
  BookingActionResponse
} from '@/types/api';

const BASE_URL = 'https://dev.kacc.mn/api';

export class ApiService {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Search hotels - using mock data since endpoint doesn't exist yet
  static async searchHotels(_params: {
    location?: string;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    rooms: number;
    acc_type: string;
  }) {
    // Return mock hotel data for now
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
                  img: {
                    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    description: 'Hotel exterior'
                  }
                },
                {
                  img: {
                    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                    description: 'Hotel room'
                  }
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
                  img: {
                    url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
                    description: 'Hotel exterior'
                  }
                },
                {
                  img: {
                    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                    description: 'Hotel room'
                  }
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

  // Get hotel details - using mock data since endpoint doesn't exist yet
  static async getHotelDetails(hotelId: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
                img: {
                  url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                  description: 'Hotel exterior'
                }
              },
              {
                img: {
                  url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                  description: 'Hotel room'
                }
              },
              {
                img: {
                  url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
                  description: 'Hotel lobby'
                }
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
        });
      }, 800);
    });
  }

  // Get rooms for a specific hotel
  static async getRoomsInHotel(hotelId: number): Promise<Room[]> {
    return this.request<Room[]>(`/roomsInHotels/?hotel=${hotelId}`);
  }

  // Get all room data (types, bed types, categories, etc.)
  static async getAllRoomData() {
    return this.request(`/all-room-data/`);
  }

  // Get combined data (includes facilities, provinces, etc.)
  static async getCombinedData() {
    return this.request(`/combined-data/`);
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