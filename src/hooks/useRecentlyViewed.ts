'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchHotelResult } from '@/types/api';

export interface RecentlyViewedHotel {
  id: string;
  hotel: SearchHotelResult;
  viewedAt: string;
}

const STORAGE_KEY = 'myroom_recently_viewed_hotels';
// Bump this version whenever stored hotel shape changes (e.g. after removing mock data).
// Stale data under an old version is discarded automatically.
const STORAGE_VERSION = 2;
const VERSION_KEY = 'myroom_recently_viewed_version';
const MAX_RECENTLY_VIEWED = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedHotel[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Clear stale data from old versions (e.g. mock hotel data)
      const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0');
      if (storedVersion < STORAGE_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, STORAGE_VERSION.toString());
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      }
    } catch (error) {
    }
  }, []);

  // Add a hotel to recently viewed
  const addRecentlyViewed = useCallback((hotel: SearchHotelResult) => {
    try {
      const newViewedHotel: RecentlyViewedHotel = {
        id: hotel.hotel_id.toString(),
        hotel,
        viewedAt: new Date().toISOString()
      };

      setRecentlyViewed(prevViewed => {
        const updated = [newViewedHotel, ...prevViewed]
          .filter((item, index, arr) => 
            // Remove duplicates based on hotel ID
            index === arr.findIndex(h => h.hotel.hotel_id === item.hotel.hotel_id)
          )
          .slice(0, MAX_RECENTLY_VIEWED);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(VERSION_KEY, STORAGE_VERSION.toString());
        return updated;
      });
    } catch (error) {
    }
  }, []);

  // Remove a hotel from recently viewed
  const removeRecentlyViewed = useCallback((hotelId: string) => {
    try {
      setRecentlyViewed(prevViewed => {
        const updated = prevViewed.filter(item => item.id !== hotelId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
    }
  }, []);

  // Clear all recently viewed
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    recentlyViewed,
    addRecentlyViewed,
    removeRecentlyViewed,
    clearRecentlyViewed
  };
}