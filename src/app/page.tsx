import dynamic from "next/dynamic";
import Header1 from "@/components/header/Header1";
import ModernHero from "@/components/hero/ModernHero";
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import RecommendedHotels from "@/components/sections/RecommendedHotels";
import PopularDestinations from "@/components/sections/PopularDestinations";
import FaqSection from "@/components/sections/FaqSection";

export const metadata = {
  title: "MyRoom - Modern Hotel Booking Platform",
  description: "Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences.",
};

const Home = () => {
  return (
    <>
      <Header1 />
      <ModernHero />
      <div className="bg-gray-50 dark:bg-gray-900">
        <RecommendedHotels />
        <PopularDestinations />
        <RecentlyViewed />
        <FaqSection />
      </div>
    </>
  );
};

Home.displayName = 'Home';

export default dynamic(() => Promise.resolve(Home));
