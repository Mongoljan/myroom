'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import StatsOverview from './StatsOverview';
import BookingHistory from './BookingHistory';
import QuickActions from './QuickActions';
import UpcomingTrips from './UpcomingTrips';
import EmailVerificationModal from './EmailVerificationModal';

export default function DashboardContent() {
  const { user, isAuthenticated, isLoading, refreshProfile } = useAuth();
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">{t('dashboard.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.first_name || 'Guest';

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8 pt-6 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.welcomeBack', { name: userName })}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('dashboard.subtitle', 'Manage your bookings and explore new destinations')}
              </p>
              {!user.is_verified && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xs text-amber-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    {t('dashboard.emailNotVerified')}
                  </p>
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2 transition"
                  >
                    {t('dashboard.verifyNow')}
                  </button>
                </div>
              )}
            </div>

            {/* Avatar */}
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500 leading-tight">{t('navigation.profile', 'Profile')}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <UpcomingTrips />
            <BookingHistory />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerified={() => {
          setShowVerifyModal(false);
          refreshProfile();
        }}
      />
    </div>
  );
}
