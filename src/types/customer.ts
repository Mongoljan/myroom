// Customer API Types

// Auth & Registration
export interface CustomerRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: string; // YYYY-MM-DD
  password: string;
  confirm_password: string;
}

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface CustomerShort {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_verified: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  customer: CustomerShort;
}

// Profile
export interface CustomerProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: string;
  is_verified: boolean;
  created_at: string;
}

export interface CustomerProfileUpdate {
  first_name?: string;
  last_name?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// Booking
export interface RoomRequest {
  room_type_id: number;
  room_category_id: number;
  room_count?: number;
}

export interface CreateCustomerBookingRequest {
  hotel_id: number;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  customer_name?: string; // Required if not logged in
  customer_phone?: string; // Required if not logged in
  customer_email?: string;
  rooms: RoomRequest[];
  coupon_code?: string;
}

export interface CreateCustomerBookingResponse {
  message: string;
  booking_code: string;
  pin_code: string;
  booking_ids: number[];
  nights?: number;
  total_rooms?: number;
}

export interface CustomerBooking {
  id: number;
  hotel: number;
  hotel_name: string;
  room_type: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'finished';
  status_label: string;
  total_price: number;
  has_review: boolean;
  booking_code: string;
  created_at: string;
}

export interface CustomerBookingsResponse {
  count: number;
  bookings: CustomerBooking[];
}

export interface CancelBookingRequest {
  booking_code: string;
  pin_code: string;
}

export interface CancelBookingResponse {
  message: string;
  booking_code: string;
}

// OTP
export interface SendOTPRequest {
  phone: string;
  first_name?: string;
  last_name?: string;
}

export interface SendOTPResponse {
  message: string;
  expires_in_seconds: number;
  is_new_customer?: boolean;
  otp_code?: string; // Only in development
}

export interface VerifyOTPRequest {
  phone: string;
  otp_code: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp_code: string;
}

export interface SendEmailOTPResponse {
  message: string;
  expires_in_seconds: number;
  otp_code?: string; // Only in development
}

// Reviews
export interface CreateReviewRequest {
  hotel: number;
  booking?: number;
  rating: number; // 1-5
  comment?: string;
}

export interface Review {
  id: number;
  hotel: number;
  booking?: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CreateReviewResponse {
  message: string;
  review: Review;
}

export interface CustomerReviewsResponse {
  count: number;
  reviews: Review[];
}

// Coupons
export interface Coupon {
  id: number;
  code: string;
  discount_percentage: number;
  is_active: boolean;
}

export interface CustomerCouponsResponse {
  count: number;
  coupons: Coupon[];
}

// Wishlist
export interface HotelDetail {
  id: number;
  PropertyName: string;
  CompanyName: string;
  location: {
    province_city: string;
    soum: string;
    district: string | null;
  };
  star_rating: number | null;
  avg_rating: number | null;
  review_count: number;
  min_price: number | null;
  profile_image: string | null;
  property_type: string | null;
}

export interface WishlistItem {
  id: number;
  hotel: HotelDetail;
  created_at: string;
}

export interface WishlistCreateRequest {
  hotel_id: number;
}

export interface WishlistCreateResponse {
  message: string;
  wishlist_id: number;
}

export interface WishlistListResponse {
  wishlists: WishlistItem[];
}

// Customer Settings
export type Currency = 'MNT' | 'USD' | 'EUR' | 'CNY';
export type Language = 'mn' | 'en' | 'zh';

export interface CustomerSettingsResponse {
  currency: Currency;
  language: Language;
  email_booking_confirmed: boolean;
  email_unsubscribe: boolean;
  notification_enabled: boolean;
}

export interface CustomerSettingsUpdateRequest {
  currency?: Currency;
  language?: Language;
  email_booking_confirmed?: boolean;
  email_unsubscribe?: boolean;
  notification_enabled?: boolean;
}

// Generic responses
export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
  [key: string]: unknown;
}
