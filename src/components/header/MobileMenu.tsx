'use client'
import Link from "next/link";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const MobileMenu = () => {
  const { t } = useHydratedTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { label: t('navigation.home', 'Home'), href: '/' },
    { label: t('navigation.hotels', 'Hotels'), href: '/search' },
    { label: t('navigation.destinations', 'Destinations'), href: '/destinations' },
    { label: t('navigation.contact', 'Contact'), href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="p-6">
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block text-gray-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white font-medium py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        {isAuthenticated && user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {user.first_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="block w-full text-center bg-secondary text-white py-3 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              {t('navigation.dashboard', 'Dashboard')}
            </Link>
            <Link
              href="/profile"
              className="block w-full text-center border border-slate-900 text-slate-900 py-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('navigation.profile', 'Profile')}
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-center border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t('navigation.logout', 'Log Out')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full text-center bg-secondary text-white py-3 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              {t('navigation.signIn', 'Sign In')}
            </Link>
            <Link
              href="/signup"
              className="block w-full text-center border border-slate-900 text-slate-900 py-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('navigation.signUp', 'Sign Up')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;