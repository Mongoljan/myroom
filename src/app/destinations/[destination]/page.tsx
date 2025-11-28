import { Metadata } from 'next';
import { Suspense } from 'react';
import DestinationPage from '@/components/destinations/DestinationPage';

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

// Loading skeleton for destination page
function DestinationSkeleton() {
  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero skeleton */}
        <div className="h-64 bg-gray-200 rounded-xl mb-8 animate-pulse" />
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Page({ params, searchParams }: Props) {
  const { destination } = await params;
  const resolvedSearchParams = await searchParams;
  
  return (
    <Suspense fallback={<DestinationSkeleton />}>
      <DestinationPage destination={destination} searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
