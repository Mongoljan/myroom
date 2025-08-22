import { Suspense } from 'react';
import Header1 from '@/components/header/Header1';
import ManageBookingContent from '@/components/booking/ManageBookingContent';

function LoadingFallback() {
  return (
    <>
      <Header1 />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="animate-pulse space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ManageBookingPage() {
  return (
    <>
      <Header1 />
      <Suspense fallback={<LoadingFallback />}>
        <ManageBookingContent />
      </Suspense>
    </>
  );
}