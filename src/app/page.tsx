import { Suspense } from "react";
import { Metadata } from "next";

// ISR: regenerate home page at most once every 5 minutes.
// Vercel serves the cached HTML instantly to all users between revalidations.
export const revalidate = 300;
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import RecommendedHotels from "@/components/sections/RecommendedHotels";
import PopularDestinations from "@/components/sections/PopularDestinations";
import FaqSection from "@/components/sections/FaqSection";
import Partnerships from "@/components/sections/Partnerships";
import ModernHero from "@/components/hero/ModernHero";
import {
  RecentlyViewedSectionSkeleton,
  RecommendedHotelsSectionSkeleton,
  PopularDestinationsSkeleton,
} from "@/components/skeletons";

export const metadata: Metadata = {
  title: "MyRoom - Зочид буудал захиалгын платформ",
  description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй. Хамгийн сайн үнэ, шууд баталгаажуулалт.",
  openGraph: {
    title: "MyRoom - Зочид буудал захиалгын платформ",
    description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй.",
  },
};

export default function Home() {
  return (
    <>
      {/* Static content - prerendered in shell */}
      <div className="py-10">
      <ModernHero />
      </div>
      <WhyChooseUs />
      
      {/* Dynamic content - streamed at request time */}
      <Suspense fallback={<RecentlyViewedSectionSkeleton />}>
        <RecentlyViewed />
      </Suspense>
      
      <Suspense fallback={<RecommendedHotelsSectionSkeleton />}>
        <RecommendedHotels />
      </Suspense>
      
      <Suspense fallback={<PopularDestinationsSkeleton />}>
        <PopularDestinations />
      </Suspense>
      
      {/* Static content */}
      <Partnerships />
      <FaqSection />
    </>
  );
}
