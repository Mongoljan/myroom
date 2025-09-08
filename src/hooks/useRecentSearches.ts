'use client';

import { useState, useEffect } from 'react';
import { LocationSuggestion } from '@/services/locationApi';

export interface RecentSearch {
  id: string;
  location: LocationSuggestion;
  searchDate: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
}

const STORAGE_KEY = 'myroom_recent_searches';
const MAX_RECENT_SEARCHES = 2;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Save a new search
  const saveSearch = (
    location: LocationSuggestion,
    checkIn: string,
    checkOut: string,
    adults: number,
    children: number,
    rooms: number
  ) => {
    try {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        location,
        searchDate: new Date().toISOString(),
        checkIn,
        checkOut,
        guests: { adults, children, rooms }
      };

      const updatedSearches = [newSearch, ...recentSearches]
        .filter((search, index, arr) => 
          // Remove duplicates based on location
          index === arr.findIndex(s => s.location.id === search.location.id)
        )
        .slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updatedSearches);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentSearches,
    saveSearch,
    clearRecentSearches
  };
}