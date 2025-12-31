/**
 * Google Maps Utility Functions
 *
 * Helper functions for working with Google Maps URLs and coordinates
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Extracts latitude and longitude from Google Maps URL
 *
 * Supports formats:
 * - https://www.google.com/maps?q=47.918873,106.917017
 * - https://maps.google.com/?q=47.918873,106.917017
 *
 * @param url - Google Maps URL string
 * @returns Coordinates object or null if invalid
 *
 * @example
 * const coords = extractCoordinatesFromUrl('https://www.google.com/maps?q=47.918873,106.917017');
 * // Returns: { lat: 47.918873, lng: 106.917017 }
 */
export function extractCoordinatesFromUrl(url: string): Coordinates | null {
  const match = url.match(/q=([-\d.]+),([-\d.]+)/);
  if (match) {
    const [, lat, lng] = match;
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
  }
  return null;
}

/**
 * Generates Google Maps URL from coordinates
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Google Maps URL string
 *
 * @example
 * const url = generateGoogleMapsUrl(47.918873, 106.917017);
 * // Returns: 'https://www.google.com/maps?q=47.918873,106.917017'
 */
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Validates if coordinates are within valid ranges
 *
 * @param lat - Latitude (-90 to 90)
 * @param lng - Longitude (-180 to 180)
 * @returns true if valid, false otherwise
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Calculates distance between two coordinates using Haversine formula
 *
 * @param coords1 - First coordinate
 * @param coords2 - Second coordinate
 * @returns Distance in kilometers
 *
 * @example
 * const distance = calculateDistance(
 *   { lat: 47.918873, lng: 106.917017 },
 *   { lat: 47.9200, lng: 106.9200 }
 * );
 */
export function calculateDistance(coords1: Coordinates, coords2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coords2.lat - coords1.lat);
  const dLng = toRadians(coords2.lng - coords1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coords1.lat)) *
      Math.cos(toRadians(coords2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formats coordinates for display
 *
 * @param coords - Coordinates to format
 * @param decimals - Number of decimal places (default: 6)
 * @returns Formatted string
 *
 * @example
 * formatCoordinates({ lat: 47.918873, lng: 106.917017 });
 * // Returns: '47.918873, 106.917017'
 */
export function formatCoordinates(coords: Coordinates, decimals: number = 6): string {
  return `${coords.lat.toFixed(decimals)}, ${coords.lng.toFixed(decimals)}`;
}
