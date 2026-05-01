/**
 * React hooks for wishlist and customer settings functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  WishlistItem, 
  CustomerSettingsResponse, 
  CustomerSettingsUpdateRequest 
} from '@/types/customer';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isHotelInWishlist,
  getWishlistCount,
  clearWishlistCache
} from '@/utils/wishlist';
import {
  getCustomerSettings,
  updateCustomerSettings,
  toggleBooleanSetting,
  getDefaultSettings,
  clearSettingsCache
} from '@/utils/customerSettings';
import { CustomerService } from '@/services/customerApi';

/**
 * Hook for managing user's wishlist
 */
export function useWishlist(token?: string) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await getWishlist(token);
      setWishlist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addHotel = useCallback(async (hotelId: number) => {
    if (!token) return { success: false, message: 'Authentication required' };

    setLoading(true);
    try {
      const result = await addToWishlist(hotelId, token);
      if (result.success) {
        await fetchWishlist(); // Refresh the list
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to wishlist';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [token, fetchWishlist]);

  const removeHotel = useCallback(async (hotelId: number) => {
    if (!token) return { success: false, message: 'Authentication required' };

    setLoading(true);
    try {
      const result = await removeFromWishlist(hotelId, token);
      if (result.success) {
        await fetchWishlist(); // Refresh the list
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove from wishlist';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [token, fetchWishlist]);

  const toggleHotel = useCallback(async (hotelId: number) => {
    if (!token) return { success: false, message: 'Authentication required', isInWishlist: false };

    setLoading(true);
    try {
      const result = await toggleWishlist(hotelId, token);
      if (result.success) {
        await fetchWishlist(); // Refresh the list
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update wishlist';
      setError(message);
      return { success: false, message, isInWishlist: false };
    } finally {
      setLoading(false);
    }
  }, [token, fetchWishlist]);

  const checkIsInWishlist = useCallback(async (hotelId: number): Promise<boolean> => {
    if (!token) return false;
    
    try {
      return await isHotelInWishlist(hotelId, token);
    } catch (err) {
      return false;
    }
  }, [token]);

  const clearCache = useCallback(() => {
    clearWishlistCache();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlist,
    loading,
    error,
    count: wishlist.length,
    addHotel,
    removeHotel,
    toggleHotel,
    checkIsInWishlist,
    refresh: fetchWishlist,
    clearCache
  };
}

/**
 * Hook for managing customer settings
 */
export function useCustomerSettings(token?: string) {
  const [settings, setSettings] = useState<CustomerSettingsResponse>(getDefaultSettings());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await getCustomerSettings(token);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateSettings = useCallback(async (updates: CustomerSettingsUpdateRequest) => {
    if (!token) return { success: false, message: 'Authentication required' };

    setLoading(true);
    try {
      const result = await updateCustomerSettings(token, updates);
      if (result.success && result.settings) {
        setSettings(result.settings);
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const toggleSetting = useCallback(async (
    key: 'email_booking_confirmed' | 'email_unsubscribe' | 'notification_enabled'
  ) => {
    if (!token) return { success: false, message: 'Authentication required' };

    setLoading(true);
    try {
      const result = await toggleBooleanSetting(token, key);
      if (result.success) {
        await fetchSettings(); // Refresh settings
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle setting';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [token, fetchSettings]);

  const clearCache = useCallback(() => {
    clearSettingsCache();
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    toggleSetting,
    refresh: fetchSettings,
    clearCache
  };
}

/**
 * Hook for checking if a hotel is in wishlist (lightweight)
 */
export function useIsInWishlist(hotelId: number, token?: string) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkWishlistStatus = useCallback(async () => {
    if (!token || !hotelId) {
      setIsInWishlist(false);
      return;
    }

    setLoading(true);
    try {
      const inWishlist = await isHotelInWishlist(hotelId, token);
      setIsInWishlist(inWishlist);
    } catch (err) {
      setIsInWishlist(false);
    } finally {
      setLoading(false);
    }
  }, [hotelId, token]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  return {
    isInWishlist,
    loading,
    refresh: checkWishlistStatus
  };
}

/**
 * Hook for authenticated user state with token management
 */
export function useAuthenticatedUser() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get token from CustomerService
    const savedToken = CustomerService.getToken();
    setToken(savedToken);
    setIsAuthenticated(!!savedToken);
  }, []);

  const updateToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    setIsAuthenticated(!!newToken);
    
    if (newToken) {
      CustomerService.saveToken(newToken);
    } else {
      CustomerService.clearToken();
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await CustomerService.logout(token);
      } catch (error) {
      }
    }
    updateToken(null);
  }, [token, updateToken]);

  return {
    token,
    isAuthenticated,
    updateToken,
    logout
  };
}