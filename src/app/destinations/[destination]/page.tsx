import { Metadata } from 'next';
import { Suspense } from 'react';
import DestinationPage from '@/components/destinations/DestinationPage';
import { DestinationPageSkeleton } from '@/components/skeletons';
import LocationInput from '@/components/search/LocationInput';

// ISR - revalidate destination pages every hour
export const revalidate = 3600;

// Pre-generate popular destinations at build time
export async function generateStaticParams() {
  // Popular Mongolian destinations
  const destinations = [
    'ulaanbaatar',
    'darkhan',
    'erdenet', 
    'khuvsgul',
    'arkhangai',
    'khovd',
    'gobi',
    'terelj',
  ];
  
  return destinations.map((destination) => ({
    destination,
  }));
}

// Destination name mappings for better SEO
const destinationNames: Record<string, { en: string; mn: string }> = {
  'ulaanbaatar': { en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
  'darkhan': { en: 'Darkhan', mn: 'Дархан' },
  'erdenet': { en: 'Erdenet', mn: 'Эрдэнэт' },
  'khuvsgul': { en: 'Khuvsgul', mn: 'Хөвсгөл' },
  'arkhangai': { en: 'Arkhangai', mn: 'Архангай' },
  'khovd': { en: 'Khovd', mn: 'Ховд' },
  'gobi': { en: 'Gobi', mn: 'Говь' },
  'terelj': { en: 'Terelj', mn: 'Тэрэлж' },
};

type Props = {
  params: Promise<{ destination: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination } = await params;
  
  // Get proper name or format from slug
  const names = destinationNames[destination.toLowerCase()] || {
    en: destination.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    mn: destination.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  };

  return {
    title: `${names.mn} - Зочид буудал & Байр | MyRoom`,
    description: `${names.mn} дахь хамгийн сайн зочид буудлуудыг олоорой. Шууд захиалга, хамгийн сайн үнийн баталгаа.`,
    openGraph: {
      title: `${names.mn} Зочид буудлууд | MyRoom`,
      description: `${names.mn}-д зочид буудал захиалах. Шууд баталгаажуулалт.`,
      type: 'website',
    },
    alternates: {
      canonical: `/destinations/${destination}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { destination } = await params;
  const resolvedSearchParams = await searchParams;
  
  return (
    <Suspense fallback={<DestinationPageSkeleton />}>
      <DestinationPage destination={destination} searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
