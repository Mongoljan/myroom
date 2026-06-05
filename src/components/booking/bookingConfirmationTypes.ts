import type { CheckBookingResponse, CreateBookingResponse, HotelFacility, PropertyPolicy } from '@/types/api';

export interface BookingConfirmationRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
  max_adults?: number;
  max_children?: number;
  include_breakfast?: boolean;
}

export interface BookingConfirmationHotelDetails {
  property_name?: string;
  contact_phone?: string;
  phone?: string;
  contact_email?: string;
  email?: string;
  mail?: string;
  website?: string;
  google_map?: string;
  location?: {
    province_city?: string;
    soum?: string;
    district?: string;
  };
  general_facilities?: HotelFacility[];
  additional_facilities?: HotelFacility[];
}

export interface BookingConfirmationViewProps {
  bookingResult: CreateBookingResponse;
  checkedBooking: CheckBookingResponse | null;
  rooms: BookingConfirmationRoom[];
  hotelId: number;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  adultsCount: number;
  childrenCount: number;
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  hotelDetails: BookingConfirmationHotelDetails | null;
  hotelPolicy: PropertyPolicy | null;
}
