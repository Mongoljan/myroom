import { ApiService } from '@/services/api';
import { SearchHotelResult } from '@/types/api';
import RecommendedHotelsClient from './RecommendedHotelsClient';

export default async function RecommendedHotels() {
  let initialHotels: SearchHotelResult[] = [];
  try {
    const response = await ApiService.getSuggestedHotels('popular');
    initialHotels = response.results || [];
  } catch {
    initialHotels = [];
  }

  return <RecommendedHotelsClient initialHotels={initialHotels} />;
}
