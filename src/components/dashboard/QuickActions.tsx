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

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
  gradient: string;
}

function ActionCard({ icon, label, description, onClick, gradient }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-300"
    >
      <div className="p-5">
        {/* Icon Container with Gradient */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 ${gradient}`}
        >
          <div className="text-white">{icon}</div>
        </div>

        {/* Label */}
        <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
          {label}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </button>
  );
}

export default function QuickActions() {
  const actions = [
    {
      icon: <Search className="w-5 h-5" />,
      label: 'New Search',
      description: 'Find your next destination',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Manage Bookings',
      description: 'View & modify reservations',
      gradient: 'bg-gradient-to-br from-violet-500 to-violet-600',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Saved Hotels',
      description: 'Your favorite properties',
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Payment Methods',
      description: 'Manage your cards',
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notifications',
      description: 'Stay updated',
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Support',
      description: '24/7 customer service',
      gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Rewards',
      description: 'Earn points & benefits',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      description: 'Account preferences',
      gradient: 'bg-gradient-to-br from-slate-500 to-slate-600',
    },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 p-6">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Quick Actions</h2>
        <p className="text-sm text-slate-600">Shortcuts to common tasks</p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            icon={action.icon}
            label={action.label}
            description={action.description}
            gradient={action.gradient}
          />
        ))}
      </div>
    </div>
  );
}
