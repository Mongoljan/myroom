import { Suspense } from "react";
import { Metadata } from "next";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import RecommendedHotels from "@/components/sections/RecommendedHotels";
import PopularDestinations from "@/components/sections/PopularDestinations";
import FaqSection from "@/components/sections/FaqSection";
import Partnerships from "@/components/sections/Partnerships";
import ModernHero from "@/components/hero/ModernHero";

export const metadata: Metadata = {
  title: "MyRoom - Зочид буудал захиалгын платформ",
  description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй. Хамгийн сайн үнэ, шууд баталгаажуулалт.",
  openGraph: {
    title: "MyRoom - Зочид буудал захиалгын платформ",
    description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй.",
  },
};

// Loading skeletons for dynamic sections
function HotelsSkeleton() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[280px] flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-[180px] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DestinationsSkeleton() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Static content - prerendered in shell */}
      <ModernHero />
      <WhyChooseUs />
      
      {/* Dynamic content - streamed at request time */}
      <Suspense fallback={<HotelsSkeleton />}>
        <RecentlyViewed />
      </Suspense>
      
      <Suspense fallback={<HotelsSkeleton />}>
        <RecommendedHotels />
      </Suspense>
      
      <Suspense fallback={<DestinationsSkeleton />}>
        <PopularDestinations />
      </Suspense>
      
      {/* Static content */}
      <Partnerships />
      <FaqSection />
    </>
  );
}
