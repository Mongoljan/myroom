import {
  CreateBookingRequest,
  CreateBookingResponse,
  CheckBookingResponse,
  BookingActionRequest,
  ChangeDateRequest,
  BookingActionResponse,
  AvailabilityResponse
} from '@/types/api';

export class BookingService {
  private static baseURL = 'https://dev.kacc.mn/api';

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
      const data = await response.json();

      if (!response.ok) {
        // Extract error message from API response
        const errorMessage = data.error || data.message || data.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  static async checkAvailability(
    hotelId: number,
    roomCategoryId: number,
    roomTypeId: number,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
      hotel_id: hotelId.toString(),
      room_category_id: roomCategoryId.toString(),
      room_type_id: roomTypeId.toString(),
      check_in: checkIn,
      check_out: checkOut
    });

    return this.request<AvailabilityResponse>(`/availability/?${params.toString()}`);
  }

  static async createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    return this.request<CreateBookingResponse>('/bookings/create/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async checkBooking(
    bookingCode: string,
    pinCode: string
  ): Promise<CheckBookingResponse> {
    const params = new URLSearchParams({
      booking_code: bookingCode,
      pin_code: pinCode
    });

    return this.request<CheckBookingResponse>(`/bookings/check/?${params.toString()}`);
  }

  static async cancelBooking(data: BookingActionRequest): Promise<BookingActionResponse> {
    return this.request<BookingActionResponse>('/bookings/cancel/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async changeDates(data: ChangeDateRequest): Promise<BookingActionResponse> {
    return this.request<BookingActionResponse>('/bookings/change-dates/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async confirmBooking(data: BookingActionRequest): Promise<BookingActionResponse> {
    return this.request<BookingActionResponse>('/bookings/confirm/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Mock booking functionality for development
  static async createBookingMock(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    console.log('Creating mock booking:', data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock booking code and PIN
    const bookingCode = `BK${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const pinCode = Math.random().toString().substr(2, 4);

    return {
      message: 'Захиалга амжилттай үүслээ!',
      booking_code: bookingCode,
      pin_code: pinCode,
      booking_ids: [Math.floor(Math.random() * 10000)]
    };
  }

  static async checkAvailabilityMock(
    hotelId: number,
    roomCategoryId: number,
    roomTypeId: number,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResponse> {
    console.log('Checking mock availability:', { hotelId, roomCategoryId, roomTypeId, checkIn, checkOut });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock availability
    return {
      available_rooms: Math.floor(Math.random() * 5) + 1
    };
  }
}