'use client'
import Link from "next/link";

const MobileMenu = () => {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Hotels', href: '/search' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Pages', href: '/pages' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Contact', href: '/contact' },
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
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;