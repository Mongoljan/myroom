import SearchHeader from '@/components/search/SearchHeader';
import { SearchResultsBodySkeleton } from '@/components/skeletons';

export default function SearchLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden mb-[40px]">
      <SearchHeader />
      <SearchResultsBodySkeleton />
    </div>
  );
}
