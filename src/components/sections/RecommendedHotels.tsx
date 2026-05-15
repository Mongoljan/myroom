// Server component — runs on the Vercel edge at build/revalidation time.
// Fetches the initial "popular" tab data so the page ships with hotel cards
// in the HTML instead of showing a skeleton while the browser fetches them.
import { ApiService } from '@/services/api';
import { SuggestedHotel } from '@/types/api';
import RecommendedHotelsClient from './RecommendedHotelsClient';

export default async function RecommendedHotels() {
  let initialHotels: SuggestedHotel[] = [];
  try {
    const response = await ApiService.getSuggestedHotels('popular');
    initialHotels = (response.results || []).filter(
      (h): h is SuggestedHotel => h.hotel?.pk != null
    );
  } catch {
    // Graceful degradation — client component will render empty state
    initialHotels = [];
  }

  return <RecommendedHotelsClient initialHotels={initialHotels} />;
}
