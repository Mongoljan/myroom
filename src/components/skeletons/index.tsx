/** Shared loading skeletons aligned with current MyRoom page layouts. */

import type { CSSProperties } from 'react';

function Bar({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} style={style} />;
}

/** Matches SectionHotelCard — default w-[280px] carousel card */
export function HotelCarouselCardSkeleton({ className = 'w-[280px]' }: { className?: string }) {
  return (
    <div className={`${className} shrink-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse`}>
      <div className="h-[180px] bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <Bar className="h-4 w-4/5" />
        <Bar className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <Bar className="h-5 w-14" />
          <Bar className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

/** Matches RecentlyViewed horizontal cards — w-[300px] h-[110px] */
export function RecentlyViewedCardSkeleton() {
  return (
    <div className="shrink-0 w-[300px] h-[110px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse flex">
      <div className="w-[110px] bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 p-3 space-y-2">
        <Bar className="h-4 w-4/5" />
        <Bar className="h-3 w-1/2" />
        <Bar className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function RecentlyViewedSectionSkeleton() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Bar className="h-7 w-48 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <RecentlyViewedCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecommendedHotelsSectionSkeleton() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Bar className="h-7 w-56 mb-6" />
        <div className="mb-5 flex border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 h-12 bg-gray-100 dark:bg-gray-800/80" />
          ))}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <HotelCarouselCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PopularDestinationsSkeleton() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Bar className="h-7 w-56 mb-2" />
        <Bar className="h-4 w-72 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
              style={{ aspectRatio: '4/3' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ModernHero */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden bg-slate-800 animate-pulse min-h-[420px] p-8 flex flex-col justify-center">
            <Bar className="h-10 w-2/3 max-w-lg mb-6 bg-slate-600" />
            <Bar className="h-5 w-1/2 max-w-sm mb-10 bg-slate-600" />
            <div className="bg-white/10 rounded-xl p-4 space-y-3 max-w-4xl w-full">
              <div className="flex flex-col lg:flex-row gap-3">
                <Bar className="h-14 flex-1 bg-slate-600" />
                <Bar className="h-14 flex-1 bg-slate-600" />
                <Bar className="h-14 flex-1 bg-slate-600" />
                <Bar className="h-12 w-28 shrink-0 bg-slate-600 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhyChooseUs */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Bar className="h-7 w-48 mb-6" />
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-px animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 py-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <div className="w-18 h-18 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Bar className="h-5 w-3/4" />
                    <Bar className="h-4 w-full" />
                    <Bar className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Bar className="h-7 w-48 mb-4" />
          <div className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <RecentlyViewedCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <RecommendedHotelsSectionSkeleton />
      <PopularDestinationsSkeleton />
    </div>
  );
}

/** TripComStyleRoomCard layout */
export function TripComRoomCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
      <div className="px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700">
        <Bar className="h-5 w-1/2 mb-2" />
        <Bar className="h-4 w-1/3" />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700">
          <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
          <div className="p-3 space-y-2">
            {[...Array(4)].map((_, i) => (
              <Bar key={i} className="h-3 w-3/4" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <Bar className="h-16 w-full" />
          <Bar className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}

export function HotelPageSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Search banner (navy) */}
      <div className="py-6 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 rounded-xl bg-white/10 animate-pulse" />
        </div>
      </div>

      <div id="hotel-hero" className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-5">
          <Bar className="h-9 w-24 mb-4" />
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex-1 space-y-2">
              <Bar className="h-9 w-2/3 max-w-md" />
              <Bar className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Bar className="h-8 w-24" />
              <Bar className="h-10 w-28 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-1 h-56 sm:h-72 lg:h-96 rounded-xl overflow-hidden">
            <div className="row-span-2 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
          <div className="mt-4 h-28 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>

      {/* Sub nav */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 py-3 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <Bar key={i} className="h-5 w-20 shrink-0" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div>
          <Bar className="h-7 w-36 mb-4" />
          <div className="mb-6 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <TripComRoomCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <Bar className="h-7 w-40 mb-4" />
          <div className="h-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SearchResultsBodySkeleton() {
  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-gray-900">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 flex-1 min-h-0 overflow-hidden">
            <div className="hidden lg:flex lg:flex-col lg:w-80 shrink-0 min-h-0">
              <div className="space-y-3">
                <div className="h-[150px] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 animate-pulse">
                  <Bar className="h-4 w-24" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Bar className="h-3 w-32" />
                      <Bar className="h-3 w-full" />
                      <Bar className="h-3 w-5/6" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
              <div className="shrink-0 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 mb-2 animate-pulse">
                <div className="space-y-1.5">
                  <Bar className="h-6 w-48" />
                  <Bar className="h-3.5 w-32" />
                </div>
                <div className="flex gap-2">
                  <Bar className="h-8 w-44 rounded-md" />
                  <Bar className="h-8 w-52 rounded-md" />
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row animate-pulse"
                    style={{ opacity: 1 - i * 0.12 }}
                  >
                    <div className="w-full md:w-60 h-[160px] md:h-[240px] shrink-0 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bar className="h-5 w-2/3" />
                          <Bar className="h-3 w-16" />
                        </div>
                        <Bar className="h-3.5 w-1/2" />
                      </div>
                      <div className="space-y-1.5">
                        <Bar className="h-4 w-40" />
                        <Bar className="h-3 w-56" />
                        <div className="flex gap-1.5 pt-0.5">
                          {[60, 80, 72].map((w, j) => (
                            <Bar key={j} className="h-5" style={{ width: w }} />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end items-end gap-4">
                        <div className="space-y-1 text-right">
                          <Bar className="h-6 w-28 ml-auto" />
                          <Bar className="h-3 w-20 ml-auto" />
                        </div>
                        <Bar className="h-8 w-28 rounded-lg bg-primary/20" />
                      </div>
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

export function SearchResultsSkeleton() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      <div className="shrink-0 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 rounded-xl border border-primary/30 bg-gray-50 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
      <SearchResultsBodySkeleton />
    </div>
  );
}

export function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Bar className="h-9 w-24 mb-8" />
        <div className="flex items-start w-full mb-8 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <Bar className="h-3 w-16 mt-1.5" />
              </div>
              {i < 2 && <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mt-4 mx-1" />}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse space-y-4">
              <Bar className="h-6 w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Bar className="h-12 rounded-lg" />
                <Bar className="h-12 rounded-lg" />
                <Bar className="h-12 rounded-lg" />
                <Bar className="h-12 rounded-lg" />
              </div>
              <Bar className="h-24 rounded-lg" />
              <Bar className="h-32 rounded-lg" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse space-y-4 sticky top-6 h-fit">
            <Bar className="h-5 w-1/2" />
            <div className="flex gap-3">
              <div className="w-20 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <Bar className="h-4 w-full" />
                <Bar className="h-3 w-2/3" />
              </div>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Bar className="h-4 w-1/3" />
                <Bar className="h-4 w-1/4" />
              </div>
            ))}
            <Bar className="h-11 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 items-start">
          <aside className="w-60 shrink-0 space-y-2 animate-pulse">
            <Bar className="h-11 w-full rounded-lg mb-4" />
            <Bar className="h-10 w-full rounded-lg" />
            <div className="ml-6 space-y-1 mt-1">
              {[...Array(4)].map((_, i) => (
                <Bar key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
            <div className="mt-4 space-y-1">
              {[...Array(5)].map((_, i) => (
                <Bar key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </aside>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse space-y-4">
            <Bar className="h-6 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Bar className="h-11 rounded-lg" />
              <Bar className="h-11 rounded-lg" />
            </div>
            <Bar className="h-11 rounded-lg w-full" />
            <Bar className="h-11 rounded-lg w-full" />
            <Bar className="h-10 w-32 rounded-lg mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DestinationHotelsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          <div className="h-[180px] bg-gray-200 dark:bg-gray-700" />
          <div className="p-3 space-y-2">
            <Bar className="h-4 w-4/5" />
            <Bar className="h-3 w-1/2" />
            <div className="flex justify-between pt-1">
              <Bar className="h-5 w-14" />
              <Bar className="h-5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DestinationPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative py-12 bg-slate-800 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Bar className="h-4 w-48 mx-auto bg-slate-600" />
          <div className="w-16 h-16 rounded-full bg-slate-600 mx-auto" />
          <Bar className="h-9 w-64 mx-auto bg-slate-600" />
          <Bar className="h-4 w-96 max-w-full mx-auto bg-slate-600" />
        </div>
      </section>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4 animate-pulse">
                <Bar className="h-5 w-24" />
                <Bar className="h-8 w-full rounded-lg" />
                <Bar className="h-20 w-full rounded-lg" />
                <Bar className="h-24 w-full rounded-lg" />
              </div>
            </div>
            <div className="flex-1">
              <DestinationHotelsGridSkeleton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HotelRoomsPageSkeleton() {
  return (
    <>
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-pulse" />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <Bar className="h-9 w-24 mb-4" />
          <Bar className="h-8 w-72 mb-2" />
          <Bar className="h-4 w-48 mb-8" />
          <div className="flex flex-wrap gap-3 mb-8">
            {[...Array(2)].map((_, i) => (
              <Bar key={i} className="h-10 w-36 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <Bar className="h-6 w-2/3" />
                  <Bar className="h-4 w-1/2" />
                  <Bar className="h-10 w-full rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function HotelRoomsSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mb-6 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse" />
      {[...Array(2)].map((_, i) => (
        <TripComRoomCardSkeleton key={i} />
      ))}
    </div>
  );
}
