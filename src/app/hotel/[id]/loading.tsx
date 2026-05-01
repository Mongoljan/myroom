// Route-level loading UI for /hotel/[id].
// Mirrors the HotelPageSkeleton already used as a <Suspense> fallback.
export default function HotelLoading() {
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Image gallery skeleton */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="col-span-2 row-span-2 h-[400px] bg-gray-200 dark:bg-gray-700 rounded-l-xl animate-pulse" />
          <div className="h-[196px] bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-[196px] bg-gray-200 dark:bg-gray-700 rounded-tr-xl animate-pulse" />
          <div className="h-[196px] bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-[196px] bg-gray-200 dark:bg-gray-700 rounded-br-xl animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            {/* Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
          {/* Booking panel skeleton */}
          <div className="space-y-4">
            <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
