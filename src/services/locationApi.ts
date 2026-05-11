export interface Province {
  id: number;
  name: string;
  property_count: number;
}

export interface Soum {
  id: number;
  name: string;
  province_id: number;
  province_name: string;
  property_count: number;
}

export interface District {
  name: string;
  province_id: number;
  province_name: string;
  soum_id: number;
  soum_name: string;
  property_count: number;
}

export interface Property {
  id: number;
  name: string;
  province_id?: number | null;
  province_name?: string | null;
  soum_id?: number | null;
  soum_name?: string | null;
  district_name?: string | null;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  fullName: string;
  type: 'province' | 'soum' | 'district' | 'property';
  property_count: number;
  searchScore?: number; // For ranking search results
  // Add original data for search API
  originalData?: {
    province_id?: number;
    soum_id?: number;
    district_name?: string;
    property_id?: number;
  };
}

export interface LocationResponse {
  provinces: Province[];
  soums: Soum[];
  districts: District[];
  properties: Property[];
}

import { getSearchScore } from '@/utils/transliteration';

export class LocationService {
  private static instance: LocationService;
  private cache: Map<string, LocationSuggestion[]> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  // Bump this version string whenever formatSuggestions logic changes to bust stale cache
  private static readonly CACHE_VERSION = 'v3';

  // Raw API response cache — keyed by the query that fetched it
  private lastRawData: { query: string; data: LocationResponse } | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const queryLower = query.toLowerCase();
    const cacheKey = `${LocationService.CACHE_VERSION}:${queryLower}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    // If the new query is an extension of the last fetched query (user kept typing),
    // filter locally from the cached raw data instead of hitting the API again.
    if (
      this.lastRawData &&
      queryLower.startsWith(this.lastRawData.query.toLowerCase()) &&
      this.lastRawData.query.length >= 2
    ) {
      const suggestions = this.formatSuggestions(this.lastRawData.data, query);
      this.cache.set(cacheKey, suggestions);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      return suggestions;
    }

    try {
      const response = await fetch(`https://dev.kacc.mn/api/locations/suggest/?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationResponse = await response.json();

      // Store raw data so subsequent refined queries can filter locally
      this.lastRawData = { query, data };

      const suggestions = this.formatSuggestions(data, query);

      // Cache results
      this.cache.set(cacheKey, suggestions);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

      return suggestions;
    } catch (error) {
      return [];
    }
  }

  private formatSuggestions(data: LocationResponse, query: string): LocationSuggestion[] {
    const suggestions: LocationSuggestion[] = [];

    // Add matching provinces with transliteration support
    data.provinces.forEach(province => {
      const score = getSearchScore(query, province.name);
      if (score > 0) {
        suggestions.push({
          id: `province-${province.id}`,
          name: province.name,
          fullName: province.name,
          type: 'province',
          property_count: province.property_count,
          searchScore: score,
          originalData: {
            province_id: province.id
          }
        });
      }
    });

    // Add properties (hotels) — API already filtered geographically, include all returned.
    // Boost score if the hotel name itself matches the query.
    if (data.properties) {
      data.properties.forEach(property => {
        const nameScore = getSearchScore(query, property.name);
        const locationParts = [property.province_name, property.soum_name].filter(Boolean);
        const fullName = locationParts.join(', ');
        suggestions.push({
          id: `property-${property.id}`,
          name: property.name,
          fullName,
          type: 'property',
          property_count: 1,
          searchScore: nameScore > 0 ? nameScore : 0.1,
          originalData: {
            property_id: property.id
          }
        });
      });
    }

    // Sort: provinces first, then properties. Within each group rank by score then property count.
    return suggestions.sort((a, b) => {
      const aIsProperty = a.type === 'property';
      const bIsProperty = b.type === 'property';

      // Locations always come before hotels
      if (aIsProperty && !bIsProperty) return 1;
      if (!aIsProperty && bIsProperty) return -1;

      // Within same group: higher score first
      const scoreDiff = (b.searchScore || 0) - (a.searchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;

      // Then by property count (descending)
      if (a.property_count !== b.property_count) {
        return b.property_count - a.property_count;
      }

      // Finally by name
      return a.name.localeCompare(b.name);
    });
  }

  // Get popular locations (provinces + top soums by property count)
  async getPopularLocations(): Promise<LocationSuggestion[]> {
    try {
      const response = await fetch('https://dev.kacc.mn/api/locations/suggest/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationResponse = await response.json();

      const provinces: LocationSuggestion[] = data.provinces
        .filter(p => p.property_count > 0)
        .sort((a, b) => b.property_count - a.property_count)
        .slice(0, 12)
        .map(province => ({
          id: `province-${province.id}`,
          name: province.name,
          fullName: province.name,
          type: 'province' as const,
          property_count: province.property_count,
          originalData: { province_id: province.id }
        }));

      return provinces;
    } catch (error) {
      return [];
    }
  }

  // Get all location data (provinces, soums, districts)
  async getAllLocationData(): Promise<LocationResponse | null> {
    try {
      const response = await fetch('https://dev.kacc.mn/api/locations/suggest/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  // Get location by ID
  async getLocationById(type: 'province' | 'soum' | 'district', id: number): Promise<LocationSuggestion | null> {
    try {
      const data = await this.getAllLocationData();
      if (!data) return null;

      if (type === 'province') {
        const province = data.provinces.find(p => p.id === id);
        if (province) {
          return {
            id: `province-${province.id}`,
            name: province.name,
            fullName: province.name,
            type: 'province',
            property_count: province.property_count,
            originalData: { province_id: province.id }
          };
        }
      } else if (type === 'soum') {
        const soum = data.soums.find(s => s.id === id);
        if (soum) {
          return {
            id: `soum-${soum.id}`,
            name: soum.name,
            fullName: `${soum.name}, ${soum.province_name}`,
            type: 'soum',
            property_count: soum.property_count,
            originalData: {
              province_id: soum.province_id,
              soum_id: soum.id
            }
          };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Parse location string for search API
  parseLocationForSearch(locationString: string): {
    location: string;
    province_id?: number;
    soum_id?: number;
    district?: string;
  } {
    // Try to extract location data from the stored suggestions
    // This is a simple approach - in production, you might want to store the selected suggestion data
    return {
      location: locationString
    };
  }

  // Better approach: store the selected suggestion and use its original data
  formatLocationForSearchAPI(suggestion: LocationSuggestion): {
    location?: string;
    name?: string;
    name_id?: number;
    province_id?: number;
    soum_id?: number;
    district?: string;
  } {
    const searchParams: {
      location?: string;
      name?: string;
      name_id?: number;
      province_id?: number;
      soum_id?: number;
      district?: string;
    } = {};

    if (suggestion.originalData) {
      // Handle property (hotel) selection - use name_id for exact match
      if (suggestion.type === 'property' && suggestion.originalData.property_id) {
        searchParams.name_id = suggestion.originalData.property_id;
        return searchParams; // For properties, only send name_id
      }
      
      // Handle location-based searches (province, soum, district)
      if (suggestion.originalData.province_id) {
        searchParams.province_id = suggestion.originalData.province_id;
      }
      if (suggestion.originalData.soum_id) {
        searchParams.soum_id = suggestion.originalData.soum_id;
      }
      if (suggestion.originalData.district_name) {
        searchParams.district = suggestion.originalData.district_name;
      }
    }

    // Fallback to text search if no specific IDs available
    if (Object.keys(searchParams).length === 0) {
      searchParams.name = suggestion.name; // Use name for text search
    }

    return searchParams;
  }
}

export const locationService = LocationService.getInstance();