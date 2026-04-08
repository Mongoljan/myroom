"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
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

const personalInfoLinks = [
  { href: '/profile', label: 'Таны профайл' },
  { href: '/profile/email', label: 'Цахим шуудан' },
  { href: '/profile/phone', label: 'Утасны дугаар' },
  { href: '/profile/password', label: 'Нууц үг солих' },
];

const mainNavLinks = [
  { href: '/profile/bookings', label: 'Захиалгын түүх', icon: CalendarDays },
  { href: '/profile/saved', label: 'Хадгалсан', icon: Heart },
  { href: '/profile/promo', label: 'Промо код', icon: Tag },
  { href: '/profile/reviews', label: 'Сэтгэгдлүүд', icon: MessageSquare },
  { href: '/profile/settings', label: 'Тохиргоо', icon: Settings },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const isPersonalInfoActive = personalInfoLinks.some((l) => l.href === pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 items-start">
          {/* ─── Sidebar ─── */}
          <aside className="w-60 shrink-0">
            {/* Quick Action - Book Hotel */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Hotel size={18} />
              <span>Буудал захиалах</span>
            </Link>

            {/* Personal info accordion */}
            <div className="mb-1">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-default select-none">
                <div className="flex items-center gap-2.5 text-gray-700 font-medium text-sm">
                  <User size={16} />
                  <span>Хувийн мэдээлэл</span>
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
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Main nav links */}
            <div className="flex flex-col gap-0.5 mt-2">
              {mainNavLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === href
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </aside>

          {/* ─── Main content ─── */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
