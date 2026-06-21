import { Metadata } from 'next';
import SearchHeader from '@/components/search/SearchHeader';
import SearchResults from '@/components/search/SearchResults';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Зочид буудал хайх | MyRoom',
  description: 'Хамгийн сайн зочид буудлын үнийг харьцуулж олоорой. Байршил, огноо, тохиромжтой сонголтуудаар хайх.',
  openGraph: {
    title: 'Зочид буудал хайх | MyRoom',
    description: 'Хамгийн сайн зочид буудлын үнийг харьцуулж олоорой.',
  },
};

export default function SearchPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden mb-[40px]">
      <SearchHeader />
      <SearchResults />
    </div>
  );
}
