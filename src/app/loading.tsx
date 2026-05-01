// Route-level loading UI for the home page.
// Next.js App Router shows this instantly on navigation to "/" while the page renders.
export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero skeleton */}
      <div className="relative h-[520px] bg-gray-200 dark:bg-gray-800 animate-pulse" />

      {/* Why choose us skeleton */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Hotels row skeleton */}
      {[...Array(2)].map((_, section) => (
        <div key={section} className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-[280px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="h-[180px] bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
