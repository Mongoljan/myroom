'use client'
import Link from "next/link";

interface MainMenuProps {
  style?: string;
}

const MainMenu: React.FC<MainMenuProps> = ({ style = "" }) => {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Hotels', href: '/search' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Pages', href: '/pages' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Contact', href: '/contact' },
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