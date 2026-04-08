'use client';

import {
  Search,
  Calendar,
  Heart,
  Settings,
  MessageCircle,
  Tag,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}

function ActionItem({ icon, label, href, color }: ActionItemProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
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
  const actions = [
    {
      icon: <Search className="w-4 h-4" />,
      label: 'Буудал хайх',
      href: '/search',
      color: 'bg-slate-800',
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Захиалгын түүх',
      href: '/profile/bookings',
      color: 'bg-slate-700',
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: 'Хадгалсан буудлууд',
      href: '/profile/saved',
      color: 'bg-rose-500',
    },
    {
      icon: <Star className="w-4 h-4" />,
      label: 'Үнэлгээ өгөх',
      href: '/profile/reviews',
      color: 'bg-yellow-500',
    },
    {
      icon: <Tag className="w-4 h-4" />,
      label: 'Промо код',
      href: '/profile/promo',
      color: 'bg-emerald-600',
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      label: 'Тусламж',
      href: '/help',
      color: 'bg-blue-500',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Тохиргоо',
      href: '/profile/settings',
      color: 'bg-slate-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Хурдан үйлдлүүд</h2>
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
