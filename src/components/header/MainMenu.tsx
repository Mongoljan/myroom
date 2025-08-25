'use client'
import Link from "next/link";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface MainMenuProps {
  style?: string;
}

const MainMenu: React.FC<MainMenuProps> = ({ style = "" }) => {
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
    <nav className="hidden xl:flex items-center space-x-8">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`font-medium hover:text-blue-400 transition-colors ${style}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainMenu;