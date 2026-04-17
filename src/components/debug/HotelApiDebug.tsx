/**
 * API Debug Component for testing hotel search and recommended hotel APIs
 * This component provides UI for debugging API issues where count != displayed results
 */

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { debugSearchAPI, type SearchDebugInfo } from '@/utils/searchDebug';
import { debugRecommendedHotelsAPI, debugAllRecommendedTabs, type RecommendedDebugInfo } from '@/utils/recommendedDebug';

interface DebugState {
  isLoading: boolean;
  searchResults: SearchDebugInfo | null;
  recommendedResults: Record<string, RecommendedDebugInfo> | null;
  error: string | null;
}

export default function ApiDebugPanel() {
  const [debugState, setDebugState] = useState<DebugState>({
    isLoading: false,
    searchResults: null,
    recommendedResults: null,
    error: null
  });

  const [searchUrl, setSearchUrl] = useState('');

  const handleSearchDebug = async () => {
    setDebugState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let searchParams: URLSearchParams;
      
      if (searchUrl) {
        // Parse URL
        const url = new URL(searchUrl);
        searchParams = url.searchParams;
      } else {
        // Default Ulaanbaatar search
        searchParams = new URLSearchParams({
          location: 'Улаанбаатар',
          check_in: '2026-04-15',
          check_out: '2026-04-16',
          adults: '2',
          children: '0',
          rooms: '1',
          acc_type: 'hotel'
        });
      }
      
      const results = await debugSearchAPI(searchParams);
      setDebugState(prev => ({
        ...prev,
        searchResults: results,
        isLoading: false
      }));
      
    } catch (error) {
      setDebugState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search debug failed',
        isLoading: false
      }));
    }
  };

  const handleRecommendedDebug = async () => {
    setDebugState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const results = await debugAllRecommendedTabs();
      setDebugState(prev => ({
        ...prev,
        recommendedResults: results,
        isLoading: false
      }));
      
    } catch (error) {
      setDebugState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Recommended debug failed',
        isLoading: false
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🔧 Hotel API Debug Panel</h1>
        
        {/* Search API Debug */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔍 Search API Debug</h2>
          <div className="flex gap-4 mb-4">
            <input
              placeholder="Enter search URL (optional - leave blank for default Ulaanbaatar search)"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleSearchDebug}
              disabled={debugState.isLoading}
            >
              {debugState.isLoading ? 'Testing...' : 'Debug Search'}
            </Button>
          </div>
          
          {debugState.searchResults && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Search Results Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">API Count</span>
                  <div className="text-lg font-bold text-blue-600">{debugState.searchResults.responseCount}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Actual Results</span>
                  <div className="text-lg font-bold">{debugState.searchResults.actualResults}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">After Filtering</span>
                  <div className="text-lg font-bold text-green-600">{debugState.searchResults.filteredResults}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Match</span>
                  <Badge variant={debugState.searchResults.responseCount === debugState.searchResults.filteredResults ? 'default' : 'destructive'}>
                    {debugState.searchResults.responseCount === debugState.searchResults.filteredResults ? 'Perfect' : 'Mismatch'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Hotels Detail</h4>
                {debugState.searchResults.hotels.map((hotel, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded ${hotel.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div>
                      <span className="font-medium">{hotel.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hotel.isValid ? 'default' : 'destructive'}>
                        {hotel.isValid ? 'Valid' : 'Invalid'}
                      </Badge>
                      {hotel.issues && (
                        <span className="text-xs text-red-600">{hotel.issues.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Hotels API Debug */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🏨 Recommended Hotels API Debug</h2>
          <div className="mb-4">
            <Button
              onClick={handleRecommendedDebug}
              disabled={debugState.isLoading}
            >
              {debugState.isLoading ? 'Testing...' : 'Debug All Tabs'}
            </Button>
          </div>
          
          {debugState.recommendedResults && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Recommended Hotels Analysis</h3>
              <div className="space-y-4">
                {Object.entries(debugState.recommendedResults).map(([tab, results]) => (
                  <div key={tab} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{tab}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">Count: {results.count}</Badge>
                        <Badge variant="outline">Results: {results.resultsLength}</Badge>
                        <Badge variant={results.count === results.resultsLength ? 'default' : 'destructive'}>
                          {results.count === results.resultsLength ? 'Match' : 'Mismatch'}
                        </Badge>
                      </div>
                    </div>
                    
                    {results.hotels.length > 0 && (
                      <div className="space-y-1">
                        {results.hotels.slice(0, 3).map((hotel, index) => (
                          <div key={index} className="text-sm flex items-center justify-between">
                            <span>{hotel.name}</span>
                            <div className="flex gap-1">
                              {hotel.hasRoom && <Badge variant="outline" className="text-xs">Room</Badge>}
                              {hotel.hasImages && <Badge variant="outline" className="text-xs">{hotel.imageCount} img</Badge>}
                              {hotel.roomPrice && <Badge variant="outline" className="text-xs">{hotel.roomPrice}₮</Badge>}
                            </div>
                          </div>
                        ))}
                        {results.hotels.length > 3 && (
                          <div className="text-xs text-gray-500">...and {results.hotels.length - 3} more</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {debugState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{debugState.error}</p>
          </div>
        )}
      </div>
      
      {/* Usage Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">📚 How to Use</h2>
        <ul className="space-y-1 text-sm">
          <li><strong>Search Debug:</strong> Paste a search URL or leave blank for default Ulaanbaatar search</li>
          <li><strong>Recommended Debug:</strong> Tests all tabs (popular, discount, top_rated, cheapest, new)</li>
          <li><strong>Console Functions:</strong> Open DevTools console for window.debugHotelSearch and window.debugRecommendedHotels</li>
          <li><strong>Expected Behavior:</strong> API count should equal filtered results for proper functionality</li>
        </ul>
      </div>
    </div>
  );
}