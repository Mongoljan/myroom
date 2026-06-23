"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import {
  User,
  CalendarDays,
  Heart,
  Tag,
  MessageSquare,
  Settings,
  ChevronDown,
  Hotel,
} from 'lucide-react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const personalInfoLinks = [
    { href: '/profile', labelKey: 'profileNav.yourProfile' },
    { href: '/profile/email', labelKey: 'profileNav.email' },
    { href: '/profile/phone', labelKey: 'profileNav.phone' },
    { href: '/profile/password', labelKey: 'profileNav.changePassword' },
  ];

  const mainNavLinks = [
    { href: '/profile/bookings', labelKey: 'profileNav.bookingHistory', icon: CalendarDays },
    { href: '/profile/saved', labelKey: 'profileNav.saved', icon: Heart },
    { href: '/profile/promo', labelKey: 'profileNav.promoCode', icon: Tag },
    { href: '/profile/reviews', labelKey: 'profileNav.reviews', icon: MessageSquare },
    { href: '/profile/settings', labelKey: 'profileNav.settings', icon: Settings },
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 items-start">
          <aside className="w-60 shrink-0">
            <div className="mb-1">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-default select-none">
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-medium text-sm">
                  <User size={16} />
                  <span>{t('profileNav.personalInfo')}</span>
                </div>
                <ChevronDown size={15} className="text-gray-400" />
              </div>
              <div className="ml-6 mt-0.5 flex flex-col gap-0.5">
                {personalInfoLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === link.href
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-0.5 mt-2">
              {mainNavLinks.map(({ href, labelKey, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === href
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{t(labelKey)}</span>
                </Link>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
