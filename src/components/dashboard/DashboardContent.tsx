'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BookingHistory from './BookingHistory';
import QuickActions from './QuickActions';
import EmailVerificationModal from './EmailVerificationModal';

export default function DashboardContent() {
  const { user, isAuthenticated, isLoading, refreshProfile } = useAuth();
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
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-10 pt-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
                Самбар
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Сайн байна уу, {user.first_name || 'Хэрэглэгч'}
              </h1>
              {!user.is_verified && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Цахим шуудан баталгаажаагүй — баталгаажуулах
                </button>
              )}
            </div>

            {/* Profile button */}
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold text-sm">
                {user.first_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user.first_name} {user.last_name}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Профайл харах</p>
              </div>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking History */}
          <div className="lg:col-span-8">
            <BookingHistory />
          </div>

          {/* Quick Actions */}
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
