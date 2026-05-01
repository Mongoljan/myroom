'use client';

import { Calendar, MapPin, Clock, TrendingUp } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-h1 font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function StatsOverview() {
  const { t } = useHydratedTranslation();

  const stats = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: t('dashboard.totalBookings', 'Total Bookings'),
      value: 12,
      trend: '+3',
      trendUp: true,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: t('dashboard.destinationsVisited', 'Destinations Visited'),
      value: 8,
      trend: '+2',
      trendUp: true,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: t('dashboard.upcomingTrips', 'Upcoming Trips'),
      value: 2,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: t('dashboard.totalSpent', 'Total Spent'),
      value: '₮4,850,000',
      trend: '+₮1,200,000',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
