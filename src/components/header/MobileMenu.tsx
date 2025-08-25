'use client'
import Link from "next/link";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const MobileMenu = () => {
  const { t } = useHydratedTranslation();
  
  const menuItems = [
    { label: t('navigation.home', 'Home'), href: '/' },
    { label: t('navigation.hotels', 'Hotels'), href: '/search' },
    { label: t('navigation.destinations', 'Destinations'), href: '/destinations' },
    { label: t('navigation.pages', 'Pages'), href: '/pages' },
    { label: t('navigation.dashboard', 'Dashboard'), href: '/dashboard' },
    { label: t('navigation.contact', 'Contact'), href: '/contact' },
  ];

  return (
    <div className="p-6">
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block text-gray-900 hover:text-blue-600 font-medium py-2 border-b border-gray-100 last:border-b-0"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
{t('navigation.signIn', 'Sign In')}
          </Link>
          <Link
            href="/signup"
            className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t('navigation.signUp', 'Sign Up')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;