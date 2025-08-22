import dynamic from "next/dynamic";
import Header1 from "@/components/header/Header1";
import Hero1 from "@/components/hero/Hero1";
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import RecommendedHotels from "@/components/sections/RecommendedHotels";
import PopularDestinations from "@/components/sections/PopularDestinations";
import FaqSection from "@/components/sections/FaqSection";

export const metadata = {
  title: "MyRoom - Hotel Booking Platform",
  description: "Find and book amazing hotels at exclusive deals",
};

const Home = () => {
  return (
    <>
      <Header1 />
      <Hero1 />
      <RecentlyViewed />
      <RecommendedHotels />
      <PopularDestinations />
      <FaqSection />
    </>
  );
};

Home.displayName = 'Home';

export default dynamic(() => Promise.resolve(Home));
