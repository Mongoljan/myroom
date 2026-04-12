'use client';

import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useRouter } from 'next/navigation';

interface Trip {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  status: 'confirmed' | 'pending';
}

export default function UpcomingTrips() {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  // Mock data - replace with actual API call
  const trips: Trip[] = [];

  if (trips.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.upcomingTripsTitle', 'Upcoming Trips')}</h2>
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.noUpcomingTrips', 'No upcoming trips')}</p>
          <button
            onClick={() => router.push('/search')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {t('dashboard.browseHotels', 'Browse Hotels')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('dashboard.upcomingTripsTitle', 'Upcoming Trips')}</h2>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
          {trips.length} {trips.length === 1 ? t('dashboard.trip', 'Trip') : t('dashboard.trips', 'Trips')}
        </span>
      </div>

      {/* Trips List */}
      <div className="space-y-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            {/* Placeholder Image */}
            <div className="w-full sm:w-28 h-20 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>

            {/* Trip Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{trip.hotelName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {trip.location}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${trip.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {trip.status === 'confirmed' ? t('dashboard.confirmed', 'Confirmed') : 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(trip.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(trip.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  {trip.guests} {t('dashboard.guests', 'Guests')}
                </span>
                <span className="truncate">{trip.roomType}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  {t('dashboard.viewDetails', 'View Details')}
                </button>
                <button className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  {t('dashboard.manageBookings', 'Manage')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
