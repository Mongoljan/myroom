import { notFound } from 'next/navigation';
import HotelSectionsView from '@/components/hotels/HotelSectionsView';
import { fetchHotelSectionsData } from '@/lib/hotelPageData';

interface HotelSectionsAsyncProps {
  id: string;
  searchParams?: {
    check_in?: string;
    check_out?: string;
    guests?: string;
  };
}

export default async function HotelSectionsAsync({ id, searchParams }: HotelSectionsAsyncProps) {
  const data = await fetchHotelSectionsData(id, searchParams?.check_in, searchParams?.check_out);

  if (!data) {
    notFound();
  }

  return (
    <HotelSectionsView
      hotel={data.hotel}
      searchParams={searchParams}
      propertyDetails={data.propertyDetails}
      basicInfo={data.basicInfo}
      policies={data.policies}
      reviewsData={data.reviewsData}
      faqs={data.faqs}
    />
  );
}
