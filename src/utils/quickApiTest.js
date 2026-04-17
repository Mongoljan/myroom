/**
 * Console commands for quick API testing
 * Add this to your browser console on any page to test APIs
 */

// Quick test commands for search API
window.quickApiTest = {
  // Test basic Ulaanbaatar search that should show multiple hotels
  testUlaanbaatarSearch: async () => {
    console.log('🔍 Testing Ulaanbaatar search...');
    const params = new URLSearchParams({
      location: 'Улаанбаатар',
      check_in: '2026-04-15',
      check_out: '2026-04-16', 
      adults: '2',
      children: '0',
      rooms: '1',
      acc_type: 'hotel'
    });
    
    // Make direct API call to see raw response
    const apiUrl = `${window.location.origin}/api/search/?${params}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('📊 Raw Search Response:', {
        count: data.count,
        resultsLength: data.results?.length || 0,
        results: data.results?.slice(0, 3).map(h => ({
          id: h.hotel_id,
          name: h.property_name,
          location: h.location
        })) || [],
        fullResponse: data
      });
      return data;
    } catch (error) {
      console.error('❌ Search API Error:', error);
    }
  },

  // Test specific hotel search
  testSpecificHotel: async (hotelId = 101) => {
    console.log(`🎯 Testing specific hotel search for ID ${hotelId}...`);
    const params = new URLSearchParams({
      name_id: hotelId.toString(),
      check_in: '2026-04-15',
      check_out: '2026-04-16', 
      adults: '2',
      children: '0',
      rooms: '1',
      acc_type: 'hotel'
    });
    
    const apiUrl = `${window.location.origin}/api/search/?${params}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('🏨 Hotel-specific Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Hotel Search Error:', error);
    }
  },

  // Test recommended hotels
  testRecommended: async (tab = 'popular') => {
    console.log(`🏆 Testing recommended hotels - ${tab}...`);
    const apiUrl = `${window.location.origin}/api/suggestHotels/?tab=${tab}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(`📈 Recommended ${tab} Response:`, {
        count: data.count,
        resultsLength: data.results?.length || 0,
        results: data.results?.slice(0, 3).map(item => ({
          hotelId: item.hotel?.pk,
          name: item.hotel?.PropertyName,
          hasRoom: !!item.cheapest_room,
          price: item.cheapest_room?.final_price || item.cheapest_room?.base_price,
          imageCount: item.cheapest_room?.images?.length || 0
        })) || [],
        fullResponse: data
      });
      return data;
    } catch (error) {
      console.error('❌ Recommended API Error:', error);
    }
  },

  // Test all recommended tabs
  testAllRecommended: async () => {
    console.log('🔄 Testing all recommended tabs...');
    const tabs = ['popular', 'discount', 'top_rated', 'cheapest', 'new'];
    const results = {};
    
    for (const tab of tabs) {
      try {
        const data = await window.quickApiTest.testRecommended(tab);
        results[tab] = {
          count: data?.count || 0,
          resultsLength: data?.results?.length || 0
        };
      } catch (error) {
        results[tab] = { count: 0, resultsLength: 0, error: error.message };
      }
    }
    
    console.log('📊 SUMMARY - All Recommended Tabs:', results);
    return results;
  }
};

console.log('🚀 Quick API test functions loaded! Available commands:');
console.log('• quickApiTest.testUlaanbaatarSearch() - Test basic search');
console.log('• quickApiTest.testSpecificHotel(101) - Test specific hotel');
console.log('• quickApiTest.testRecommended("popular") - Test recommended');
console.log('• quickApiTest.testAllRecommended() - Test all recommended tabs');