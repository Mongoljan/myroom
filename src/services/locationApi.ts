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

    const cacheKey = query.toLowerCase();
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch('https://dev.kacc.mn/api/locations/suggest/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationResponse = await response.json();
      const suggestions = this.formatSuggestions(data, query);
      
      // Cache results
      this.cache.set(cacheKey, suggestions);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return suggestions;
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
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

    // Add matching soums with transliteration support
    data.soums.forEach(soum => {
      const nameScore = getSearchScore(query, soum.name);
      const provinceScore = getSearchScore(query, soum.province_name);
      const fullNameScore = getSearchScore(query, `${soum.name} ${soum.province_name}`);
      const maxScore = Math.max(nameScore, provinceScore, fullNameScore);
      
      if (maxScore > 0) {
        suggestions.push({
          id: `soum-${soum.id}`,
          name: soum.name,
          fullName: `${soum.name}, ${soum.province_name}`,
          type: 'soum',
          property_count: soum.property_count,
          searchScore: maxScore,
          originalData: {
            province_id: soum.province_id,
            soum_id: soum.id
          }
        });
      }
    });

    // Add matching districts with transliteration support
    data.districts.forEach(district => {
      const nameScore = getSearchScore(query, district.name);
      const soumScore = getSearchScore(query, district.soum_name);
      const provinceScore = getSearchScore(query, district.province_name);
      const fullNameScore = getSearchScore(query, `${district.name} ${district.soum_name} ${district.province_name}`);
      const maxScore = Math.max(nameScore, soumScore, provinceScore, fullNameScore);
      
      if (maxScore > 0) {
        suggestions.push({
          id: `district-${district.soum_id}-${district.name}`,
          name: district.name,
          fullName: `${district.name}, ${district.soum_name}, ${district.province_name}`,
          type: 'district',
          property_count: district.property_count,
          searchScore: maxScore,
          originalData: {
            province_id: district.province_id,
            soum_id: district.soum_id,
            district_name: district.name
          }
        });
      }
    });

    // Add matching properties (hotels) with transliteration support
    if (data.properties) {
      data.properties.forEach(property => {
        const score = getSearchScore(query, property.name);
        if (score > 0) {
          suggestions.push({
            id: `property-${property.id}`,
            name: property.name,
            fullName: property.name,
            type: 'property',
            property_count: 1,
            searchScore: score,
            originalData: {
              property_id: property.id
            }
          });
        }
      });
    }

    // Sort by search relevance and type priority
    return suggestions.sort((a, b) => {
      // First by search score (higher is better)
      const scoreDiff = (b.searchScore || 0) - (a.searchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      
      // Then by type priority (properties first for name searches)
      if (a.type === 'property' && b.type !== 'property') return -1;
      if (b.type === 'property' && a.type !== 'property') return 1;
      
      // Then by property count (descending)
      if (a.property_count !== b.property_count) {
        return b.property_count - a.property_count;
      }
      
      // Finally by name
      return a.name.localeCompare(b.name);
    });
  }

  // Get popular locations (provinces with highest property count)
  async getPopularLocations(): Promise<LocationSuggestion[]> {
    try {
      const response = await fetch('https://dev.kacc.mn/api/locations/suggest/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationResponse = await response.json();
      
      return data.provinces
        .sort((a, b) => b.property_count - a.property_count)
        .slice(0, 5)
        .map(province => ({
          id: `province-${province.id}`,
          name: province.name,
          fullName: province.name,
          type: 'province' as const,
          property_count: province.property_count,
          originalData: {
            province_id: province.id
          }
        }));
    } catch (error) {
      console.error('Error fetching popular locations:', error);
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
      console.error('Error fetching all location data:', error);
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
      console.error('Error fetching location by ID:', error);
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
    console.log('formatLocationForSearchAPI called with:', suggestion);

    const searchParams: {
      location?: string;
      name?: string;
      name_id?: number;
      province_id?: number;
      soum_id?: number;
      district?: string;
    } = {};

    if (suggestion.originalData) {
      console.log('originalData exists:', suggestion.originalData);
      // Handle property (hotel) selection - use name_id for exact match
      if (suggestion.type === 'property' && suggestion.originalData.property_id) {
        searchParams.name_id = suggestion.originalData.property_id;
        console.log('Setting name_id for property:', searchParams.name_id);
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