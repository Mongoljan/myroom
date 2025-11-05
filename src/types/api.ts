// API Types for Hotel Booking System

// Property Basic Info API Response
export interface PropertyBasicInfo {
  id: number;
  property_name_mn: string;
  property_name_en: string;
  start_date: string;
  part_of_group: boolean;
  group_name: string | null;
  total_hotel_rooms: number;
  available_rooms: number;
  sales_room_limitation: boolean;
  property: number;
  star_rating: number;
  languages: number[];
}

// Confirm Address API Response
export interface ConfirmAddress {
  id: number;
  district: string;
  zipCode: string;
  total_floor_number: number;
  property: number;
  province_city: number;
  soum: number;
}

// Property Images API Response
export interface PropertyImage {
  id: number;
  property: number;
  image: string;
  description: string;
}

// Additional Info API Response
export interface AdditionalInfo {
  id: number;
  About: string;
  YoutubeUrl: string;
  property: number;
}

// Property Details API Response
export interface PropertyDetails {
  id: number;
  propertyBasicInfo: number;
  confirmAddress: number;
  propertyPolicies: number | null;
  Additional_Information: number | null;
  property_photos: PropertyImage[];
  google_map: string;
  property: number;
  general_facilities: number[];
}

export interface RoomImage {
  id: number;
  image: string;
  description: string;
}

export interface Room {
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

export interface AvailabilityResponse {
  available_rooms: number;
}

export interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
}

export interface CreateBookingRequest {
  hotel_id: number;
  check_in: string;
  check_out: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  rooms: BookingRoom[];
}

export interface CreateBookingResponse {
  message: string;
  booking_code: string;
  pin_code: string;
  booking_ids: number[];
}

export interface BookingUser {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface BookingDetails {
  id: number;
  user: BookingUser;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  hotel: number;
  room: number;
  room_price: number;
  check_in: string;
  check_out: string;
  status: string;
  coupon: string | null;
  total_price: number;
  created_at: string;
}

export interface CheckBookingResponse {
  bookings: BookingDetails[];
  total_sum: number;
  status: string;
}

export interface BookingActionRequest {
  booking_code: string;
  pin_code: string;
}

export interface ChangeDateRequest extends BookingActionRequest {
  check_in: string;
  check_out: string;
}

export interface BookingActionResponse {
  message?: string;
  error?: string;
}

// Room data interfaces
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

export interface BedSize {
  id: number;
  size: string;
  is_custom: boolean;
}

export interface BreakfastOption {
  id: number;
  option: string;
  children_price: string;
  price: string;
}

export interface RoomRate {
  id: number;
  name: string;
  is_custom: boolean;
}

export interface ExtraBed {
  id: number;
  has_extra_bed: boolean;
  extra_bed_price: string;
}

export interface AllRoomData {
  room_types: RoomType[];
  bed_types: BedType[];
  bed_sizes: BedSize[];
  breakfast_options: BreakfastOption[];
  room_rates: RoomRate[];
  extra_beds: ExtraBed[];
}

// Combined data interfaces
export interface Facility {
  id: number;
  name_en: string;
  name_mn: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface Soum {
  id: number;
  name: string;
  code: number;
}

export interface CombinedData {
  facilities: Facility[];
  province: Province[];
  soum: Soum[];
  property_types: Array<{
    id: number;
    name_en: string;
    name_mn: string;
  }>;
  ratings: Array<{
    id: number;
    rating: string;
  }>;
  accessibility_features: Array<{
    id: number;
    name_en: string;
    name_mn: string;
  }>;
  languages: Array<{
    id: number;
    name_en: string;
    name_mn: string;
  }>;
}

// Hotel search types
export interface HotelLocation {
  province_city: string | null;
  soum: string | null;
  district: string | null;
}

export interface PriceSetting {
  value: number;
  value_type: 'PERCENT' | 'FIXED';
  adjustment_type: 'ADD' | 'SUB';
}

export interface CheapestRoom {
  room_type_id: number;
  room_category_id: number;
  room_type_label: string;
  room_category_label: string;
  price_per_night_raw?: number; // Original price before adjustment
  price_per_night_adjusted?: number; // Price after adjustment
  price_per_night: number; // Keep for backwards compatibility
  nights: number;
  estimated_total_raw?: number;
  estimated_total_adjusted?: number;
  available_in_this_type: number;
  capacity_per_room_adults: number;
  capacity_per_room_children: number;
  capacity_per_room_total: number;
  estimated_total_for_requested_rooms: number;
  pricesetting?: PriceSetting | null;
}

export interface HotelImage {
  url: string;
  description: string;
}

export interface HotelImages {
  cover: string | HotelImage; // Can be direct string URL or object
  gallery: Array<HotelImage>; // Direct array of HotelImage objects
}

export interface RatingStars {
  id: number;
  label: string;
  value: string;
}

export interface SearchHotelResult {
  hotel_id: number;
  property_name: string;
  location: HotelLocation;
  nights: number;
  rooms_possible: number;
  cheapest_room: CheapestRoom | null;
  min_estimated_total: number;
  images: HotelImages;
  rating_stars: RatingStars;
  google_map: string;
  general_facilities: string[];
  property_type?: string; // Optional: property type (hotel, apartment, guesthouse)
}

export interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SearchHotelResult[];
}

// Room pricing types
export interface RoomPrice {
  id: number;
  base_price: number;
  base_price_raw?: number; // Original price before discount
  single_person_price: number | null;
  half_day_price: number | null;
  hotel: number;
  room_type: number;
  room_category: number;
  pricesetting?: {
    adjustment_type: 'ADD' | 'SUB';
    value_type: 'PERCENT' | 'FIXED';
    value: number;
  };
}

export interface FinalPrice {
  room_price_id: number;
  final_price: number;
}

// Room facilities and amenities
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

export interface FreeToiletry {
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

export interface RoomCategory {
  id: number;
  name: string;
  is_custom: boolean;
}

export interface AllData {
  room_types: RoomType[];
  bed_types: BedType[];
  room_facilities: RoomFacility[];
  bathroom_items: BathroomItem[];
  free_toiletries: FreeToiletry[];
  food_and_drink: FoodAndDrink[];
  outdoor_and_view: OutdoorAndView[];
  room_category: RoomCategory[];
}

// Room features
export interface RoomFeature {
  pk: number;
  name: string;
  feature_type: 'text' | 'boolean' | 'choice';
  choices: string | null;
}

// Property policies
export interface CancellationFee {
  id: number;
  cancel_time: string;
  before_fee: string;
  after_fee: string;
  beforeManyRoom_fee: string;
  afterManyRoom_fee: string;
  subsequent_days_percentage: string;
  special_condition_percentage: string;
  created_at: string;
  updated_at: string;
  property: number;
}

export interface PropertyPolicy {
  id: number;
  cancellation_fee: CancellationFee;
  check_in_from: string;
  check_in_until: string;
  check_out_from: string;
  check_out_until: string;
  breakfast_policy: string;
  parking_situation: string;
  allow_children: boolean;
  allow_pets: boolean;
  property: number;
}