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
        <div className="mb-8 pt-6 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Сайн байна уу, {user.first_name || 'Хэрэглэгч'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Таны захиалга болон мэдээллийг энд удирдна уу.
              </p>
              {!user.is_verified && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xs text-amber-600">
                    ⚠ Таны цахим шуудан баталгаажаагүй байна.
                  </p>
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2 transition"
                  >
                    Баталгаажуулах
                  </button>
                </div>
              )}
            </div>

            {/* Avatar */}
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {user.first_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500 leading-tight">Профайл харах</p>
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
