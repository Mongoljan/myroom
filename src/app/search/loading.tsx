// Route-level loading UI for /search.
// Shown instantly by Next.js App Router while the search page renders.
// Must match the h-screen flex-col layout used in SearchResults.
export default function SearchLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Search header skeleton */}
      <div className="shrink-0">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-4">
          <div className="bg-white dark:bg-gray-800 border border-primary rounded-xl overflow-hidden animate-pulse">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 p-5 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
              <div className="p-4 flex items-center">
                <div className="w-11 h-10 rounded-lg bg-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main body skeleton */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-3 flex flex-col">
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">

            {/* Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-80 shrink-0 min-h-0">
              <div className="flex-1 min-h-0 overflow-hidden pr-1 space-y-3">
                <div className="h-[150px] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 animate-pulse">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/60 rounded" />
                      <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700/60 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
              {/* Header row */}
              <div className="shrink-0 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 mb-2 animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3.5 w-32 bg-gray-100 dark:bg-gray-700/60 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-44 bg-gray-200 dark:bg-gray-700 rounded-md" />
                  <div className="h-8 w-52 bg-gray-200 dark:bg-gray-700 rounded-md" />
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row animate-pulse"
                    style={{ opacity: 1 - i * 0.12 }}
                  >
                    <div className="w-full md:w-60 h-[160px] md:h-[240px] flex-shrink-0 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                          <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700/60 rounded" />
                        </div>
                        <div className="h-3.5 w-1/2 bg-gray-100 dark:bg-gray-700/60 rounded" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-56 bg-gray-100 dark:bg-gray-700/60 rounded" />
                        <div className="flex gap-1.5 pt-0.5">
                          {[60, 80, 72].map((w, j) => (
                            <div key={j} className="h-5 bg-gray-100 dark:bg-gray-700/60 rounded" style={{ width: w }} />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end items-end gap-4">
                        <div className="space-y-1 text-right">
                          <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
                          <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700/60 rounded ml-auto" />
                        </div>
                        <div className="h-8 w-28 bg-primary/20 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
