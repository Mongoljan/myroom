/**
 * Wishlist utility functions
 */

import { CustomerService } from '@/services/customerApi';
import { WishlistItem, HotelDetail } from '@/types/customer';

// Cache for wishlist data to avoid unnecessary API calls
let wishlistCache: WishlistItem[] | null = null;
let cacheExpiry: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Clear the wishlist cache
 */
export const clearWishlistCache = (): void => {
  wishlistCache = null;
  cacheExpiry = null;
};

/**
 * Check if a hotel is in the user's wishlist
 */
export const isHotelInWishlist = async (hotelId: number, token?: string): Promise<boolean> => {
  if (!token) return false;

  try {
    const wishlist = await getWishlist(token);
    return wishlist.some(item => item.hotel.id === hotelId);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
};

/**
 * Get the user's wishlist with caching
 */
export const getWishlist = async (token: string): Promise<WishlistItem[]> => {
  // Check cache first
  if (wishlistCache && cacheExpiry && Date.now() < cacheExpiry) {
    return wishlistCache;
  }

  try {
    const response = await CustomerService.getWishlist(token);
    wishlistCache = response.wishlists;
    cacheExpiry = Date.now() + CACHE_DURATION;
    return wishlistCache;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    // Return cached data if available, even if expired
    return wishlistCache || [];
  }
};

/**
 * Add a hotel to the wishlist
 */
export const addToWishlist = async (hotelId: number, token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await CustomerService.addToWishlist(token, { hotel_id: hotelId });
    
    // Clear cache to force refresh
    clearWishlistCache();
    
    return {
      success: true,
      message: response.message
    };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to add to wishlist';
    
    // Handle specific error cases
    if (errorMessage.includes('хадгалсан байна') || errorMessage.includes('already exists')) {
      return {
        success: false,
        message: 'This hotel is already in your wishlist'
      };
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Remove a hotel from the wishlist
 */
export const removeFromWishlist = async (hotelId: number, token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await CustomerService.removeFromWishlist(token, hotelId);
    
    // Clear cache to force refresh
    clearWishlistCache();
    
    return {
      success: true,
      message: response.message
    };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove from wishlist';
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Toggle wishlist status for a hotel
 */
export const toggleWishlist = async (hotelId: number, token: string): Promise<{ 
  success: boolean; 
  message: string; 
  isInWishlist: boolean;
}> => {
  try {
    const isCurrentlyInWishlist = await isHotelInWishlist(hotelId, token);
    
    if (isCurrentlyInWishlist) {
      const result = await removeFromWishlist(hotelId, token);
      return {
        ...result,
        isInWishlist: false
      };
    } else {
      const result = await addToWishlist(hotelId, token);
      return {
        ...result,
        isInWishlist: true
      };
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update wishlist',
      isInWishlist: false
    };
  }
};

/**
 * Get wishlist count
 */
export const getWishlistCount = async (token: string): Promise<number> => {
  try {
    const wishlist = await getWishlist(token);
    return wishlist.length;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
};

// Define generic hotel input type for wishlist formatting
interface GenericHotelInput {
  id?: number;
  pk?: number;
  PropertyName?: string;
  name?: string;
  CompanyName?: string;
  company_name?: string;
  location?: {
    province_city?: string;
    soum?: string;
    district?: string | null;
  } | string;
  star_rating?: string | null;
  avg_rating?: number | null;
  rating?: number;
  review_count?: number;
  reviews_count?: number;
  min_price?: number | null;
  price?: number;
  profile_image?: string | null;
  image?: string;
  images?: Array<{ image?: string }> | { 0?: { image?: string } };
  property_type?: string | null;
  type?: string;
  [key: string]: unknown;
}

/**
 * Convert HotelDetail from search results to wishlist format
 * This helps when adding hotels from search results to wishlist
 */
export const formatHotelForWishlist = (hotel: GenericHotelInput): HotelDetail => {
  return {
    id: hotel.id || hotel.pk || 0,
    PropertyName: hotel.PropertyName || hotel.name || 'Unknown Hotel',
    CompanyName: hotel.CompanyName || hotel.company_name || '',
    location: {
      province_city: typeof hotel.location === 'object' 
        ? hotel.location?.province_city || '' 
        : (hotel.location || ''),
      soum: typeof hotel.location === 'object' 
        ? hotel.location?.soum || '' 
        : '',
      district: typeof hotel.location === 'object' 
        ? hotel.location?.district || null 
        : null
    },
    star_rating: hotel.star_rating ? Number(hotel.star_rating) : null,
    avg_rating: hotel.avg_rating || hotel.rating || null,
    review_count: hotel.review_count || hotel.reviews_count || 0,
    min_price: hotel.min_price || hotel.price || null,
    profile_image: hotel.profile_image || hotel.image || hotel.images?.[0]?.image || null,
    property_type: hotel.property_type || hotel.type || null
  };
};

/**
 * Local storage keys for wishlist functionality
 */
export const WISHLIST_STORAGE_KEYS = {
  CACHE: 'wishlist_cache',
  CACHE_EXPIRY: 'wishlist_cache_expiry',
  TEMP_ITEMS: 'wishlist_temp_items' // For offline functionality
} as const;

/**
 * Save wishlist to localStorage as backup
 */
export const saveWishlistToStorage = (wishlist: WishlistItem[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEYS.CACHE, JSON.stringify(wishlist));
      localStorage.setItem(WISHLIST_STORAGE_KEYS.CACHE_EXPIRY, Date.now().toString());
    } catch (error) {
      console.warn('Failed to save wishlist to localStorage:', error);
    }
  }
};

/**
 * Load wishlist from localStorage
 */
export const loadWishlistFromStorage = (): WishlistItem[] | null => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(WISHLIST_STORAGE_KEYS.CACHE);
      const expiry = localStorage.getItem(WISHLIST_STORAGE_KEYS.CACHE_EXPIRY);
      
      if (cached && expiry && Date.now() - parseInt(expiry) < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Failed to load wishlist from localStorage:', error);
    }
  }
  return null;
};