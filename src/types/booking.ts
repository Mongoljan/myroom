export interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  price_per_night: number;
  nights: number;
  total_price: number;
}

export interface BookingRequest {
  hotel_id: number;
  check_in: string; // Format: YYYY-MM-DD
  check_out: string; // Format: YYYY-MM-DD
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  rooms: BookingRoom[];
  total_nights: number;
  total_amount: number;
}

export interface BookingFormData {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}
