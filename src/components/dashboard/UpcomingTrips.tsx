'use client';

import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Trip {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  image: string;
  status: 'confirmed' | 'pending';
}

export default function UpcomingTrips() {
  // Mock data - replace with actual API call
  const trips: Trip[] = [
    {
      id: '1',
      hotelName: 'Grand Plaza Hotel & Spa',
      location: 'Paris, France',
      checkIn: '2025-01-15',
      checkOut: '2025-01-20',
      guests: 2,
      roomType: 'Deluxe Suite',
      image: '/img/hotels/hotel1.jpg',
      status: 'confirmed',
    },
    {
      id: '2',
      hotelName: 'Seaside Resort & Beach',
      location: 'Bali, Indonesia',
      checkIn: '2025-02-10',
      checkOut: '2025-02-17',
      guests: 4,
      roomType: 'Ocean View Villa',
      image: '/img/hotels/hotel2.jpg',
      status: 'confirmed',
    },
  ];

  if (trips.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Trips</h2>
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-4">No upcoming trips</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors">
            Browse Hotels
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Upcoming Trips</h2>
        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
        </span>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={trip.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {/* Hotel Image */}
              <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20" />
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <MapPin className="w-12 h-12" />
                </div>
              </div>

              {/* Trip Details */}
              <div className="flex-1 min-w-0">
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {trip.hotelName}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.location}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 ml-2">
                    {trip.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>

                {/* Trip Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Check-in</p>
                      <p className="font-medium text-slate-900">
                        {new Date(trip.checkIn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Check-out</p>
                      <p className="font-medium text-slate-900">
                        {new Date(trip.checkOut).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Guests</p>
                      <p className="font-medium text-slate-900">{trip.guests}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Room</p>
                      <p className="font-medium text-slate-900 truncate">{trip.roomType}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
                    Manage Booking
                  </button>
                </div>
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
