// Route-level loading UI for /booking
export default function BookingLoading() {
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse space-y-4"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Summary sidebar skeleton */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                ))}
              </div>
              <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
