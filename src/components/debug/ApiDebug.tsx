'use client';

import { useEffect, useState } from 'react';

interface ApiTestResult {
  status: number;
  ok: boolean;
  count: number;
  resultsLength: number;
}

interface ApiError {
  message: string;
  type: string;
}

interface DebugInfo {
  baseUrl: string;
  nodeEnv: string | undefined;
  timestamp: string;
  isClient: boolean;
  apiTest: ApiTestResult | null;
  error: ApiError | null;
}

export default function ApiDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      const info: DebugInfo = {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.kacc.mn/api',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        isClient: typeof window !== 'undefined',
        apiTest: null,
        error: null
      };

      try {
        const testUrl = `${info.baseUrl}/search/?province_id=1&check_in=2025-10-20&check_out=2025-10-21&adults=2&children=0&rooms=1&acc_type=hotel`;
        console.log('Testing API:', testUrl);
        
        const response = await fetch(testUrl);
        const data = await response.json();
        
        info.apiTest = {
          status: response.status,
          ok: response.ok,
          count: data.count,
          resultsLength: data.results?.length || 0
        };
      } catch (err) {
        info.error = {
          message: err instanceof Error ? err.message : 'Unknown error',
          type: err instanceof Error ? err.constructor.name : typeof err
        };
      }

      setDebugInfo(info);
      console.log('API Debug Info:', info);
    };

    checkApi();
  }, []);

  if (!debugInfo) return <div className="p-4 bg-yellow-100">Loading debug info...</div>;

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-black text-white text-xs rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
      <h3 className="font-bold mb-2">🔍 API Debug Info</h3>
      <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}
