'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchHotelResult } from '@/types/api';

export interface RecentlyViewedHotel {
  id: string;
  hotel: SearchHotelResult;
  viewedAt: string;
}

const STORAGE_KEY = 'myroom_recently_viewed_hotels';
const MAX_RECENTLY_VIEWED = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedHotel[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      }
    } catch (error) {
      console.error('Error loading recently viewed hotels:', error);
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
        return updated;
      });
    } catch (error) {
      console.error('Error saving recently viewed hotel:', error);
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
      console.error('Error removing recently viewed hotel:', error);
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