'use client';

import {
  Search,
  Calendar,
  Heart,
  Settings,
  CreditCard,
  Bell,
  MessageCircle,
  Award,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color: string;
}

function ActionItem({ icon, label, href, onClick, color }: ActionItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 text-left group"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <div className="text-white">{icon}</div>
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </button>
  );
}

export default function QuickActions() {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const actions = [
    {
      icon: <Search className="w-4 h-4" />,
      label: t('dashboard.newSearch', 'New Search'),
      href: '/search',
      color: 'bg-slate-800',
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: t('dashboard.manageBookings', 'Manage Bookings'),
      href: '/booking/manage',
      color: 'bg-slate-700',
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: t('dashboard.savedHotels', 'Saved Hotels'),
      href: '/profile',
      color: 'bg-slate-600',
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: t('dashboard.paymentMethods', 'Payment Methods'),
      href: '/profile',
      color: 'bg-slate-600',
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: t('dashboard.notifications', 'Notifications'),
      href: '/profile',
      color: 'bg-slate-500',
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      label: t('dashboard.support', 'Support'),
      href: '/help',
      color: 'bg-slate-500',
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: t('dashboard.rewards', 'Rewards'),
      href: '/profile',
      color: 'bg-slate-500',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: t('dashboard.settings', 'Settings'),
      href: '/profile',
      color: 'bg-slate-400',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">{t('dashboard.quickActions', 'Quick Actions')}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.shortcutsToTasks', 'Shortcuts to common tasks')}</p>
      </div>

      <div className="space-y-2">
        {actions.map((action, index) => (
          <ActionItem
            key={index}
            icon={action.icon}
            label={action.label}
            href={action.href}
            color={action.color}
          />
        ))}
      </div>
    </div>
  );
}
