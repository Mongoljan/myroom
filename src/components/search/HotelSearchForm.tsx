'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TYPOGRAPHY } from '@/styles/containers';
import CustomGuestSelector from './CustomGuestSelector';
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
  const urlSearchParams = useSearchParams();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1
  });

  // Load current search params from URL
  useEffect(() => {
    setSearchParams({
      location: urlSearchParams.get('location') || '',
      checkIn: urlSearchParams.get('check_in') || '',
      checkOut: urlSearchParams.get('check_out') || '',
      adults: parseInt(urlSearchParams.get('adults') || '2'),
      children: parseInt(urlSearchParams.get('children') || '0'),
      rooms: parseInt(urlSearchParams.get('rooms') || '1'),
    });
  }, [urlSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      check_in: searchParams.checkIn,
      check_out: searchParams.checkOut,
      adults: searchParams.adults.toString(),
      children: searchParams.children.toString(),
      rooms: searchParams.rooms.toString(),
      acc_type: 'hotel'
    });

    // Add location parameter for basic text search
    if (searchParams.location) {
      params.append('location', searchParams.location);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleGuestChange = (adults: number, children: number, rooms: number) => {
    setSearchParams(prev => ({ ...prev, adults, children, rooms }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Desktop Layout - Horizontal */}
          <div className="hidden lg:flex items-center divide-x divide-gray-200">
            {/* Location Input */}
            <div className="flex-1 relative">
              <div className="flex items-center p-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className={`${TYPOGRAPHY.form.label} text-gray-500 mb-1`}>Location</div>
                  <input
                    type="text"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where are you going?"
                    className={`w-full ${TYPOGRAPHY.form.input} text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="relative">
              <div className="flex items-center p-4">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className={`${TYPOGRAPHY.form.label} text-gray-500 mb-1`}>Check in - Check out</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={searchParams.checkIn}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                      className={`${TYPOGRAPHY.body.standard} text-gray-900 border-none outline-none bg-transparent cursor-pointer`}
                      required
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="date"
                      value={searchParams.checkOut}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                      min={searchParams.checkIn}
                      className={`${TYPOGRAPHY.body.standard} text-gray-900 border-none outline-none bg-transparent cursor-pointer`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Selector */}
            <div className="relative">
              <CustomGuestSelector
                adults={searchParams.adults}
                childrenCount={searchParams.children}
                rooms={searchParams.rooms}
                onGuestChange={handleGuestChange}
                className="border-none"
              />
            </div>

            {/* Search Button */}
            <div className="p-2">
              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors ${TYPOGRAPHY.button.standard}`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Layout - Vertical Stack */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 divide-y divide-gray-200">
              {/* Location Input */}
              <div className="p-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <div className={`${TYPOGRAPHY.form.label} text-gray-500 mb-1`}>Location</div>
                    <input
                      type="text"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Where are you going?"
                      className={`w-full ${TYPOGRAPHY.form.input} text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent`}
                    />
                  </div>
                </div>
              </div>

              {/* Date Range - Mobile Friendly */}
              <div className="p-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div className="flex-1">
                    <div className={`${TYPOGRAPHY.form.label} text-gray-500 mb-2`}>Check in - Check out</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={searchParams.checkIn}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                        className={`${TYPOGRAPHY.body.standard} text-gray-900 border border-gray-200 rounded-lg p-2`}
                        required
                      />
                      <input
                        type="date"
                        value={searchParams.checkOut}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                        min={searchParams.checkIn}
                        className={`${TYPOGRAPHY.body.standard} text-gray-900 border border-gray-200 rounded-lg p-2`}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Selector - Mobile */}
              <div className="p-4">
                <CustomGuestSelector
                  adults={searchParams.adults}
                  childrenCount={searchParams.children}
                  rooms={searchParams.rooms}
                  onGuestChange={handleGuestChange}
                  className="border-none w-full"
                />
              </div>

              {/* Search Button - Mobile */}
              <div className="p-4">
                <button
                  type="submit"
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors ${TYPOGRAPHY.button.standard} flex items-center justify-center gap-2`}
                >
                  <Search className="w-5 h-5" />
                  <span>Search Hotels</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}