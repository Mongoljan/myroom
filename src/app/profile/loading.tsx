// Route-level loading UI for /profile and all sub-routes
export default function ProfileLoading() {
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
              <hr className="border-gray-100 dark:border-gray-700" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              ))}
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
