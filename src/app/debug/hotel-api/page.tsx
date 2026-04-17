/**
 * Debug page for testing hotel APIs
 * Access at /debug/hotel-api
 */

import HotelApiDebug from '@/components/debug/HotelApiDebug';

export default function HotelApiDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <HotelApiDebug />
    </div>
  );
}