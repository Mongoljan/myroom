/**
 * Debug script for the Recommended Hotels API
 * This helps analyze why some tabs may return 0 hotels or different results than expected
 */

import { ApiService } from '@/services/api';

export interface RecommendedDebugInfo {
  tab: string;
  apiUrl: string;
  count: number;
  resultsLength: number;
  hotels: Array<{
    id: number;
    name: string;
    location: string;
    hasRoom: boolean;
    roomPrice?: number;
    hasImages: boolean;
    imageCount: number;
  }>;
}

export async function debugRecommendedHotelsAPI(
  tab: 'popular' | 'discount' | 'top_rated' | 'cheapest' | 'new' = 'popular'
): Promise<RecommendedDebugInfo> {
  
  console.log(`🏨 Debugging Recommended Hotels API - Tab: ${tab}`);
  
  try {
    const response = await ApiService.getSuggestedHotels(tab);
    const results = response?.results || [];
    
    console.log('📊 Raw API Response:', {
      count: response.count,
      resultsLength: results.length,
      tab: tab
    });

    // Analyze each hotel result (now using normalized structure)
    const analysisResults = results.map(item => {
      const hotel = item.hotel; // Now using normalized structure
      const room = item.cheapest_room;
      
      return {
        id: hotel.pk, // Using pk since that's the actual field from suggested API
        name: hotel.PropertyName, // Updated to use normalized PropertyName
        location: typeof hotel.location === 'string' 
          ? hotel.location 
          : (hotel.location as { province_city?: string })?.province_city || 'Unknown location', // Handle both string and object
        hasRoom: !!room,
        roomPrice: room?.final_price || room?.base_price,
        hasImages: !!(room?.images && room.images.length > 0),
        imageCount: room?.images?.length || 0
      };
    });

    console.log('🏨 Hotel Analysis:', analysisResults);

    const debugInfo: RecommendedDebugInfo = {
      tab,
      apiUrl: `https://dev.kacc.mn/api/suggestHotels/?tab=${tab}`,
      count: response.count || 0,
      resultsLength: results.length,
      hotels: analysisResults
    };

    console.log('📋 Debug Summary:', {
      tab: tab,
      totalCount: debugInfo.count,
      actualResults: debugInfo.resultsLength,
      hotelsWithRooms: analysisResults.filter(h => h.hasRoom).length,
      hotelsWithImages: analysisResults.filter(h => h.hasImages).length,
      averageImageCount: analysisResults.reduce((sum, h) => sum + h.imageCount, 0) / analysisResults.length
    });

    return debugInfo;

  } catch (error) {
    console.error(`❌ Recommended Hotels API Error for tab ${tab}:`, error);
    throw error;
  }
}

// Test all tabs
export async function debugAllRecommendedTabs(): Promise<Record<string, RecommendedDebugInfo>> {
  const tabs: Array<'popular' | 'discount' | 'top_rated' | 'cheapest' | 'new'> = 
    ['popular', 'discount', 'top_rated', 'cheapest', 'new'];
  
  const results: Record<string, RecommendedDebugInfo> = {};
  
  console.log('🔄 Testing all recommended hotel tabs...');
  
  for (const tab of tabs) {
    try {
      console.log(`\n📂 Testing tab: ${tab}`);
      const debugInfo = await debugRecommendedHotelsAPI(tab);
      results[tab] = debugInfo;
      
      console.log(`✅ ${tab}: ${debugInfo.count} total, ${debugInfo.resultsLength} returned`);
    } catch (error) {
      console.error(`❌ Failed to test ${tab}:`, error);
      results[tab] = {
        tab,
        apiUrl: `https://dev.kacc.mn/api/suggestHotels/?tab=${tab}`,
        count: 0,
        resultsLength: 0,
        hotels: []
      };
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY - All Tabs:');
  tabs.forEach(tab => {
    const info = results[tab];
    console.log(`${tab}: ${info.count} total, ${info.resultsLength} returned`);
  });
  
  return results;
}

// Test function that can be called from browser console
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).debugRecommendedHotels = {
    testTab: debugRecommendedHotelsAPI,
    testAllTabs: debugAllRecommendedTabs,
    // Quick tests for each tab
    testPopular: () => debugRecommendedHotelsAPI('popular'),
    testDiscount: () => debugRecommendedHotelsAPI('discount'),  
    testTopRated: () => debugRecommendedHotelsAPI('top_rated'),
    testCheapest: () => debugRecommendedHotelsAPI('cheapest'),
    testNew: () => debugRecommendedHotelsAPI('new')
  };
  
  console.log('🔧 Debug functions available on window.debugRecommendedHotels');
}