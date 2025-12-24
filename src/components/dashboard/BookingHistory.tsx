'use client';

import { Calendar, MapPin, Star, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Booking {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: 'completed' | 'cancelled';
  rating?: number;
}

export default function BookingHistory() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  // Mock data - replace with actual API call
  const bookings: Booking[] = [
    {
      id: '1',
      hotelName: 'Luxury Resort & Spa',
      location: 'Tokyo, Japan',
      checkIn: '2024-11-01',
      checkOut: '2024-11-05',
      nights: 4,
      totalPrice: 1200,
      status: 'completed',
      rating: 5,
    },
    {
      id: '2',
      hotelName: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      checkIn: '2024-10-15',
      checkOut: '2024-10-20',
      nights: 5,
      totalPrice: 1850,
      status: 'completed',
      rating: 4,
    },
    {
      id: '3',
      hotelName: 'City Center Hotel',
      location: 'New York, USA',
      checkIn: '2024-09-10',
      checkOut: '2024-09-12',
      nights: 2,
      totalPrice: 480,
      status: 'cancelled',
    },
    {
      id: '4',
      hotelName: 'Beach Paradise Resort',
      location: 'Maldives',
      checkIn: '2024-08-20',
      checkOut: '2024-08-27',
      nights: 7,
      totalPrice: 3200,
      status: 'completed',
      rating: 5,
    },
  ];

  const filteredBookings = bookings.filter((b) => filter === 'all' || b.status === filter);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 p-6 sm:p-8">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Booking History</h2>

        {/* Filter Tabs */}
        <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'completed'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'cancelled'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking, index) => (
            <div
              key={booking.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-300 hover:border-slate-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between p-4 sm:p-5">
                {/* Left: Booking Info */}
                <div className="flex-1 min-w-0">
                  {/* Hotel Name & Location */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {booking.hotelName}
                      </h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Date & Status */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        {new Date(booking.checkIn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span>
                        {new Date(booking.checkOut).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <span className="text-sm text-slate-500">•</span>

                    <span className="text-sm font-medium text-slate-600">
                      {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                    </span>

                    {booking.rating && (
                      <>
                        <span className="text-sm text-slate-500">•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium text-slate-900">
                            {booking.rating}.0
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Price & Status */}
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </span>

                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      ${booking.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>

                  <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group/btn">
                    Details
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {filteredBookings.length > 0 && (
        <div className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            View All Bookings
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
