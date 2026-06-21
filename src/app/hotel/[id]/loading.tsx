import HotelPageBanner from '@/components/hotels/HotelPageBanner';
import { HotelHeroSkeleton, HotelSectionsSkeleton } from '@/components/skeletons';

export default function HotelLoading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <HotelPageBanner />
      <HotelHeroSkeleton />
      <HotelSectionsSkeleton />
    </div>
  );
}
