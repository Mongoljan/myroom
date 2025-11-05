import dynamic from "next/dynamic";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import RecommendedHotels from "@/components/sections/RecommendedHotels";
import PopularDestinations from "@/components/sections/PopularDestinations";
import FaqSection from "@/components/sections/FaqSection";
import Partnerships from "@/components/sections/Partnerships";
import ModernHero from "@/components/hero/ModernHero";

export const metadata = {
  title: "MyRoom - Modern Hotel Booking Platform",
  description: "Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences.",
};

const Home = () => {
  return (
    <>
      <ModernHero/>
      <WhyChooseUs />
      <RecentlyViewed />
      <RecommendedHotels />
      <PopularDestinations />
      <Partnerships />
      <FaqSection />
    </>
  );
};

Home.displayName = 'Home';

export default dynamic(() => Promise.resolve(Home));
