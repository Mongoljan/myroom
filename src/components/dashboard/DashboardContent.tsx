'use client';

import { useState } from 'react';
import StatsOverview from './StatsOverview';
import BookingHistory from './BookingHistory';
import QuickActions from './QuickActions';
import UpcomingTrips from './UpcomingTrips';

export default function DashboardContent() {
  const [userName] = useState('Mongoljansabyrjan'); // Replace with actual user data

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Max-width container for content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                Welcome back, {userName}
              </h1>
              <p className="text-base text-slate-600">
                Manage your bookings and explore new destinations
              </p>
            </div>

            {/* Profile Avatar with Gradient Border */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 rounded-full opacity-70 group-hover:opacity-100 blur transition-all duration-300" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StatsOverview />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upcoming Trips */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <UpcomingTrips />
            </div>

            {/* Booking History */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <BookingHistory />
            </div>
          </div>

          {/* Right Column - Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Quick Actions */}
              <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                <QuickActions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
