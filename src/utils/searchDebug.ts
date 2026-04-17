/**
 * API Debug script to test search parameters and see why only 1 hotel shows when API says 2
 * This helps debug the screenshot issue where "Нийт илэрц: 2" but only 1 hotel displays
 */

import { ApiService } from '@/services/api';

export interface SearchDebugInfo {
  apiUrl: string;
  params: Record<string, unknown>;
  responseCount: number;
  actualResults: number;
  filteredResults: number;
  hotels: Array<{
    id: number;
    name: string;
    location: string;
    isValid: boolean;
    issues?: string[];
  }>;
}

export async function debugSearchAPI(searchParams: URLSearchParams): Promise<SearchDebugInfo> {
  // Build the same params that SearchResults component uses
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const params = {
    location: searchParams.get('location') || undefined,
    name: searchParams.get('name') || undefined,
    name_id: searchParams.get('name_id') ? parseInt(searchParams.get('name_id')!) : undefined,
    province_id: searchParams.get('province_id') ? parseInt(searchParams.get('province_id')!) : undefined,
    soum_id: searchParams.get('soum_id') ? parseInt(searchParams.get('soum_id')!) : undefined,
    district: searchParams.get('district') || undefined,
    check_in: searchParams.get('check_in') || today,
    check_out: searchParams.get('check_out') || tomorrow,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    rooms: parseInt(searchParams.get('rooms') || '1'),
    acc_type: searchParams.get('acc_type') || 'hotel',
  };

  // Validate and fix dates (same logic as SearchResults)
  if (!params.check_in || !params.check_out || params.check_in === params.check_out) {
    params.check_in = today;
    params.check_out = tomorrow;
  }

  if (new Date(params.check_out) <= new Date(params.check_in)) {
    const checkInDate = new Date(params.check_in);
    checkInDate.setDate(checkInDate.getDate() + 1);
    params.check_out = checkInDate.toISOString().split('T')[0];
  }

  console.log('🔍 Search API Debug - Parameters:', params);

  try {
    const response = await ApiService.searchHotels(params);
    const results = response?.results || [];
    
    console.log('📊 API Response:', {
      count: response.count,
      resultsLength: results.length,
      results: results.map(h => ({ 
        id: h.hotel_id, 
        name: h.property_name,
        location: h.location
      }))
    });

    // Apply same validation logic as SearchResults
    const validationResults = results.map(hotel => {
      const issues: string[] = [];
      
      if (!hotel) {
        issues.push('Hotel object is null/undefined');
      }
      if (!hotel.hotel_id) {
        issues.push('Missing hotel_id');
      }
      if (!hotel.property_name) {
        issues.push('Missing property_name');
      }
      if (!hotel.location) {
        issues.push('Missing location');
      }
      if (!hotel.rating_stars) {
        issues.push('Missing rating_stars');
      }

      const isValid = !!(hotel && hotel.hotel_id && hotel.property_name && hotel.location && hotel.rating_stars);
      
      return {
        id: hotel?.hotel_id || 0,
        name: hotel?.property_name || 'Unknown',
        location: `${hotel?.location?.province_city || ''}, ${hotel?.location?.soum || ''}`.trim(),
        isValid,
        issues: issues.length > 0 ? issues : undefined
      };
    });

    const validResults = validationResults.filter(h => h.isValid);
    
    // Apply same filtering logic as SearchResults
    const isSpecificQuery = !!params.name_id || !!params.name;
    let finalResults = validResults;
    
    if (isSpecificQuery && params.name_id) {
      finalResults = validResults.filter(h => h.id === params.name_id);
      console.log(`🎯 Filtered by name_id ${params.name_id}: ${finalResults.length} results`);
    } else if (isSpecificQuery && params.name) {
      const needle = params.name.toLowerCase();
      finalResults = validResults.filter(h => 
        h.name.toLowerCase().includes(needle)
      );
      console.log(`🎯 Filtered by name "${params.name}": ${finalResults.length} results`);
    }

    console.log('✅ Final Results:', finalResults);

    return {
      apiUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.kacc.mn/api'}/search/`,
      params,
      responseCount: response.count || 0,
      actualResults: results.length,
      filteredResults: finalResults.length,
      hotels: validationResults
    };

  } catch (error) {
    console.error('❌ Search API Error:', error);
    throw error;
  }
}

// Helper function to analyze a specific search URL
export async function analyzeSearchFromUrl(url: string): Promise<SearchDebugInfo> {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;
  
  console.log('🔗 Analyzing URL:', url);
  console.log('📋 URL Parameters:', Object.fromEntries(searchParams.entries()));
  
  return debugSearchAPI(searchParams);
}

// Test function that can be called from browser console
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).debugHotelSearch = {
    searchFromParams: debugSearchAPI,
    searchFromUrl: analyzeSearchFromUrl,
    testUlaanbaatar: () => debugSearchAPI(new URLSearchParams({
      location: 'Улаанбаатар',
      check_in: '2026-04-15',
      check_out: '2026-04-16', 
      adults: '2',
      children: '0',
      rooms: '1',
      acc_type: 'hotel'
    }))
  };
}