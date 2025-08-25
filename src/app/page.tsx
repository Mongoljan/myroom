import dynamic from "next/dynamic";
import Header1 from "@/components/header/Header1";
import Footer from "@/components/layout/Footer";
import ModernHero from "@/components/hero/ModernHero";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import RecommendedHotels from "@/components/sections/RecommendedHotels";
import PopularDestinations from "@/components/sections/PopularDestinations";
import FaqSection from "@/components/sections/FaqSection";
import Partnerships from "@/components/sections/Partnerships";

export const metadata = {
  title: "MyRoom - Modern Hotel Booking Platform",
  description: "Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences.",
};

const Home = () => {
  return (
    <>
      <Header1 />
      <main className="pt-20">
        <ModernHero />
        <WhyChooseUs />
        <Partnerships />
        <RecentlyViewed />
        <div className="bg-gray-50">
          <RecommendedHotels />
          <PopularDestinations />
        </div>
        <FaqSection />
      </main>
      <Footer />
    </>
  );
};

Home.displayName = 'Home';

export default dynamic(() => Promise.resolve(Home));
