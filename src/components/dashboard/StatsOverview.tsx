'use client';

import { Calendar, MapPin, Clock, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  delay?: string;
}

function StatCard({ icon, label, value, trend, trendUp, delay }: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden animate-fade-in"
      style={{ animationDelay: delay }}
    >
      {/* Glass Card with Border */}
      <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 hover:border-slate-200/80 hover:-translate-y-1">
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-violet-500/0 to-pink-500/0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-2xl" />

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            {/* Icon Container */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>

            {/* Value */}
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>

            {/* Trend Indicator */}
            {trend && (
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp
                  className={`w-4 h-4 ${trendUp ? 'text-emerald-600' : 'text-rose-600 rotate-180'}`}
                />
                <span
                  className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {trend}
                </span>
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            )}
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}

export default function StatsOverview() {
  const stats = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Total Bookings',
      value: 12,
      trend: '+3',
      trendUp: true,
      delay: '0ms',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Destinations Visited',
      value: 8,
      trend: '+2',
      trendUp: true,
      delay: '50ms',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Upcoming Trips',
      value: 2,
      delay: '100ms',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Total Spent',
      value: '$4,850',
      trend: '+$1,200',
      trendUp: true,
      delay: '150ms',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
