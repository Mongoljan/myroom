'use client';

import { useState } from 'react';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import CustomGuestSelector from './CustomGuestSelector';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export default function HotelSearchForm() {
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      location: searchParams.location,
      check_in: searchParams.checkIn,
      check_out: searchParams.checkOut,
      adults: searchParams.adults.toString(),
      children: searchParams.children.toString(),
      rooms: searchParams.rooms.toString(),
      acc_type: 'hotel'
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 md:mx-0">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search.location', 'Location')}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                placeholder={t('search.locationPlaceholder', 'Where are you going?')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Check In */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search.checkIn', 'Check In')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search.checkOut', 'Check Out')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                min={searchParams.checkIn}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search.guestsAndRooms', 'Guests & Rooms')}
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={`${searchParams.adults}-${searchParams.children}-${searchParams.rooms}`}
                onChange={(e) => {
                  const [adults, children, rooms] = e.target.value.split('-').map(Number);
                  setSearchParams(prev => ({ ...prev, adults, children, rooms }));
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="1-0-1">1 том хүн, 1 өрөө</option>
                <option value="2-0-1">2 том хүн, 1 өрөө</option>
                <option value="2-1-1">2 том хүн, 1 хүүхэд, 1 өрөө</option>
                <option value="2-2-1">2 том хүн, 2 хүүхэд, 1 өрөө</option>
                <option value="3-0-1">3 том хүн, 1 өрөө</option>
                <option value="4-0-2">4 том хүн, 2 өрөө</option>
                <option value="4-2-2">4 том хүн, 2 хүүхэд, 2 өрөө</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5" />
{t('hotel.findHotels', 'Search Hotels')}
          </button>
        </div>
      </form>
    </div>
  );
}