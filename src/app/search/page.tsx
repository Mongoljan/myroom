import { Suspense } from "react";
import { Metadata } from "next";
import SearchResultsPage from "@/components/search/SearchResultsPage";

// Force dynamic rendering - don't cache search results
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Зочид буудал хайх | MyRoom",
  description: "Хамгийн сайн зочид буудлын үнийг харьцуулж олоорой. Байршил, огноо, тохиромжтой сонголтуудаар хайх.",
  openGraph: {
    title: "Зочид буудал хайх | MyRoom",
    description: "Хамгийн сайн зочид буудлын үнийг харьцуулж олоорой.",
  },
};

function SearchPageFallback() {
  return (
    <>
      {/* Search Form Section */}
      <section className="pt-24 pb-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Loading */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar Loading */}
            <div className="lg:w-80">
              <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Loading */}
            <div className="flex-1">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-80 h-64 md:h-auto bg-gray-200"></div>
                      <div className="flex-1 p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex gap-2">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                          ))}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="space-y-2">
                            <div className="h-8 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="h-10 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchResultsPage />
    </Suspense>
  );
}