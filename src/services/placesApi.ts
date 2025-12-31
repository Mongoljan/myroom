/**
 * Google Places API Service
 * 
 * Fetches nearby places (restaurants, landmarks, transport, shopping) 
 * based on hotel coordinates using Google Places API
 * 
 * Required API: Google Places API (must be enabled in Google Cloud Console)
 * Environment variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 */

export interface NearbyPlaceResult {
  name: string;
  distance: string;
  distanceMeters: number;
  duration?: string;
  category: 'transport' | 'landmarks' | 'dining' | 'shopping';
  placeId?: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
}

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

// Category to Google Places types mapping
const categoryToTypes: Record<string, string[]> = {
  transport: ['train_station', 'transit_station', 'bus_station', 'subway_station', 'airport'],
  landmarks: ['tourist_attraction', 'museum', 'church', 'temple', 'monument', 'park', 'point_of_interest'],
  dining: ['restaurant', 'cafe', 'bar', 'food'],
  shopping: ['shopping_mall', 'department_store', 'store', 'supermarket', 'market'],
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    const km = meters / 1000;
    if (km < 10) {
      return `${km.toFixed(1)} km`;
    }
    return `${Math.round(km)} km`;
  }
}

/**
 * Estimate travel time based on distance
 */
function estimateDuration(meters: number, mode: 'walk' | 'car' = 'walk'): string {
  const speedMs = mode === 'walk' ? 1.4 : 8.3; // m/s (5 km/h walk, 30 km/h car in city)
  const seconds = meters / speedMs;
  const minutes = Math.round(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} min ${mode === 'walk' ? 'walk' : 'drive'}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours} hr ${remainingMins} min ${mode === 'walk' ? 'walk' : 'drive'}`;
}

/**
 * Fetch nearby places using Google Places API
 */
export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  category: 'transport' | 'landmarks' | 'dining' | 'shopping',
  radius: number = 5000 // 5km default
): Promise<NearbyPlaceResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return [];
  }

  const types = categoryToTypes[category];
  const results: NearbyPlaceResult[] = [];

  for (const type of types) {
    try {
      // Use the Places API Nearby Search
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK' && data.results) {
        for (const place of data.results.slice(0, 5)) { // Limit to 5 per type
          const distanceMeters = calculateDistance(
            lat, lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          );

          const useCarMode = distanceMeters > 1000;

          results.push({
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
      }
    } catch (error) {
      console.error(`Error fetching ${type} places:`, error);
    }
  }

  // Sort by distance and remove duplicates
  const uniquePlaces = results
    .filter((place, index, self) => 
      index === self.findIndex(p => p.name === place.name)
    )
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return uniquePlaces.slice(0, 10); // Return top 10 closest
}

/**
 * Fetch all nearby places for all categories
 */
export async function fetchAllNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 5000
): Promise<NearbyPlaceResult[]> {
  const categories: Array<'transport' | 'landmarks' | 'dining' | 'shopping'> = [
    'transport', 'landmarks', 'dining', 'shopping'
  ];

  const allPlaces: NearbyPlaceResult[] = [];

  for (const category of categories) {
    const places = await fetchNearbyPlaces(lat, lng, category, radius);
    allPlaces.push(...places);
  }

  return allPlaces;
}

/**
 * Extract coordinates from Google Maps URL
 */
export function extractCoordsFromGoogleMapUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  
  // Try format: https://www.google.com/maps?q=lat,lng
  const match1 = url.match(/q=([-\d.]+),([-\d.]+)/);
  if (match1) {
    return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) };
  }

  // Try format: https://www.google.com/maps/@lat,lng,zoom
  const match2 = url.match(/@([-\d.]+),([-\d.]+)/);
  if (match2) {
    return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };
  }

  // Try format: https://maps.google.com/maps/place/.../@lat,lng
  const match3 = url.match(/place\/.*\/@([-\d.]+),([-\d.]+)/);
  if (match3) {
    return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) };
  }

  return null;
}

/**
 * Client-side hook-friendly function to get nearby places
 * Uses browser's Geolocation if needed
 */
export function getNearbyPlacesFromCoords(
  googleMapUrl: string,
  defaultLat?: number,
  defaultLng?: number
): { lat: number; lng: number } | null {
  const coords = extractCoordsFromGoogleMapUrl(googleMapUrl || '');
  
  if (coords) {
    return coords;
  }

  if (defaultLat && defaultLng) {
    return { lat: defaultLat, lng: defaultLng };
  }

  return null;
}
