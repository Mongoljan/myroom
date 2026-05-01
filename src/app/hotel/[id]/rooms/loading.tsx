// Route-level loading UI for /hotel/[id]/rooms
export default function HotelRoomsLoading() {
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Page header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
        </div>

        {/* Filter bar skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 animate-pulse">
          <div className="flex flex-wrap gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Room cards skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 h-52 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                    <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
