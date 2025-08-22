'use client'
import React from "react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useHydratedTranslation();

  const tabs = [
    { id: 'hotels', label: t('tabs.hotels', 'Hotels'), icon: '🏨' },
    { id: 'tour', label: t('tabs.tour', 'Tour'), icon: '🗺️' },
    { id: 'activity', label: t('tabs.activity', 'Activity'), icon: '🎯' },
    { id: 'holiday-rentals', label: t('tabs.holidayRentals', 'Holiday Rentals'), icon: '🏠' },
    { id: 'car', label: t('tabs.car', 'Car'), icon: '🚗' },
    { id: 'cruise', label: t('tabs.cruise', 'Cruise'), icon: '🚢' },
    { id: 'flights', label: t('tabs.flights', 'Flights'), icon: '✈️' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;