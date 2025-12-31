'use client';

import { useState, useEffect, useCallback } from 'react';
import { NearbyPlaceResult } from '@/services/placesApi';

interface UseNearbyPlacesOptions {
  lat?: number;
  lng?: number;
  enabled?: boolean;
  radius?: number;
}

interface UseNearbyPlacesResult {
  places: NearbyPlaceResult[];
  transportPlaces: NearbyPlaceResult[];
  landmarkPlaces: NearbyPlaceResult[];
  diningPlaces: NearbyPlaceResult[];
  shoppingPlaces: NearbyPlaceResult[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Cache for storing fetched places to avoid repeated API calls
const placesCache = new Map<string, NearbyPlaceResult[]>();

/**
 * Hook to fetch nearby places using Google Places API via browser
 * 
 * Note: Due to CORS restrictions, the Places API cannot be called directly from the browser.
 * This hook uses the Google Maps JavaScript API's PlacesService instead.
 */
export function useNearbyPlaces({
  lat,
  lng,
  enabled = true,
  radius = 5000,
}: UseNearbyPlacesOptions): UseNearbyPlacesResult {
  const [places, setPlaces] = useState<NearbyPlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = lat && lng ? `${lat.toFixed(4)},${lng.toFixed(4)},${radius}` : '';

  const fetchPlaces = useCallback(async () => {
    if (!lat || !lng || !enabled) return;

    // Check cache first
    if (placesCache.has(cacheKey)) {
      setPlaces(placesCache.get(cacheKey)!);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if Google Maps is loaded
      if (typeof google === 'undefined' || !google.maps?.places) {
        throw new Error('Google Maps Places API not loaded');
      }

      // Create a hidden map div for PlacesService (required by the API)
      let mapDiv = document.getElementById('places-service-map');
      if (!mapDiv) {
        mapDiv = document.createElement('div');
        mapDiv.id = 'places-service-map';
        mapDiv.style.display = 'none';
        document.body.appendChild(mapDiv);
      }

      const map = new google.maps.Map(mapDiv, {
        center: { lat, lng },
        zoom: 15,
      });

      const service = new google.maps.places.PlacesService(map);
      const location = new google.maps.LatLng(lat, lng);

      const allPlaces: NearbyPlaceResult[] = [];

      // Category configurations
      const categories: Array<{
        category: 'transport' | 'landmarks' | 'dining' | 'shopping';
        types: string[];
      }> = [
        { 
          category: 'transport', 
          types: ['train_station', 'transit_station', 'bus_station', 'subway_station', 'airport'] 
        },
        { 
          category: 'landmarks', 
          types: ['tourist_attraction', 'museum', 'church', 'park', 'point_of_interest'] 
        },
        { 
          category: 'dining', 
          types: ['restaurant', 'cafe', 'bar'] 
        },
        { 
          category: 'shopping', 
          types: ['shopping_mall', 'department_store', 'store'] 
        },
      ];

      // Fetch places for each category
      for (const { category, types } of categories) {
        for (const type of types) {
          try {
            const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
              service.nearbySearch(
                {
                  location,
                  radius,
                  type: type as string,
                },
                (results, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    resolve(results);
                  } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    resolve([]);
                  } else {
                    reject(new Error(`Places API error: ${status}`));
                  }
                }
              );
            });

            for (const place of results.slice(0, 3)) {
              if (!place.geometry?.location || !place.name) continue;

              const placeLat = place.geometry.location.lat();
              const placeLng = place.geometry.location.lng();
              
              // Calculate distance
              const distanceMeters = calculateDistance(lat, lng, placeLat, placeLng);
              const useCarMode = distanceMeters > 1000;

              allPlaces.push({
                name: place.name,
                distance: formatDistance(distanceMeters),
                distanceMeters,
                duration: estimateDuration(distanceMeters, useCarMode ? 'car' : 'walk'),
                category,
                placeId: place.place_id,
                address: place.vicinity,
                rating: place.rating,
                userRatingsTotal: place.user_ratings_total,
              });
            }
          } catch (err) {
            console.warn(`Error fetching ${type}:`, err);
          }
        }
      }

      // Remove duplicates and sort by distance
      const uniquePlaces = allPlaces
        .filter((place, index, self) => 
          index === self.findIndex(p => p.name === place.name)
        )
        .sort((a, b) => a.distanceMeters - b.distanceMeters);

      // Cache the results
      placesCache.set(cacheKey, uniquePlaces);
      setPlaces(uniquePlaces);

    } catch (err) {
      console.error('Error fetching nearby places:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby places');
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, radius, enabled, cacheKey]);

  useEffect(() => {
    if (enabled && lat && lng) {
      fetchPlaces();
    }
  }, [fetchPlaces, enabled, lat, lng]);

  // Filter places by category
  const transportPlaces = places.filter(p => p.category === 'transport');
  const landmarkPlaces = places.filter(p => p.category === 'landmarks');
  const diningPlaces = places.filter(p => p.category === 'dining');
  const shoppingPlaces = places.filter(p => p.category === 'shopping');

  return {
    places,
    transportPlaces,
    landmarkPlaces,
    diningPlaces,
    shoppingPlaces,
    isLoading,
    error,
    refetch: fetchPlaces,
  };
}

// Helper functions
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function estimateDuration(meters: number, mode: 'walk' | 'car'): string {
  const speedMs = mode === 'walk' ? 1.4 : 8.3;
  const minutes = Math.round(meters / speedMs / 60);
  
  if (minutes < 60) {
    return `${minutes} min ${mode === 'walk' ? 'walk' : 'drive'}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours} hr ${remainingMins} min ${mode === 'walk' ? 'walk' : 'drive'}`;
}
