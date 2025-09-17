'use client';

export default function LoadingSkeleton() {
  return (
    <div className="bg-white">
      {/* Header Skeleton - Material Texture */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' /%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-12 bg-white/10 rounded-lg"></div>
              <div className="h-12 bg-white/10 rounded-lg"></div>
              <div className="h-12 bg-white/10 rounded-lg"></div>
              <div className="h-12 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Loading Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-4 bg-gray-200/80 rounded mb-3 w-20 animate-pulse" />
              <div className="space-y-3">
                <div className="h-3 bg-gray-200/60 rounded w-full animate-pulse" />
                <div className="h-6 bg-gray-200/80 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200/60 rounded w-3/4 animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-6 bg-gray-200/80 rounded w-full animate-pulse" />
                  <div className="h-6 bg-gray-200/80 rounded w-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading Main Content */}
          <div className="flex-1 min-w-0">
            {/* Loading Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="h-6 bg-gray-200/80 rounded mb-3 w-48 animate-pulse" />
              <div className="flex gap-3 mb-3">
                <div className="h-6 bg-gray-200/80 rounded w-28 animate-pulse" />
                <div className="h-6 bg-gray-200/80 rounded w-20 animate-pulse" />
              </div>
              <div className="h-3 bg-gray-200/60 rounded w-32 animate-pulse" />
            </div>

            {/* Loading Hotel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="h-32 bg-gray-200/80 rounded mb-3 w-full animate-pulse" />
                  <div className="h-4 bg-gray-200/80 rounded mb-2 w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200/60 rounded mb-2 w-1/2 animate-pulse" />
                  <div className="flex gap-1.5 mb-2">
                    <div className="h-4 bg-gray-200/60 rounded w-12 animate-pulse" />
                    <div className="h-4 bg-gray-200/60 rounded w-16 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200/80 rounded w-20 animate-pulse" />
                    <div className="h-6 bg-gray-200/80 rounded w-16 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}