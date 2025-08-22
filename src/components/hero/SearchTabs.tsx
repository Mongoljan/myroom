'use client'
import React from "react";
import { useTranslation } from "react-i18next";

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'hotels', label: t('tabs.hotels'), icon: '🏨' },
    { id: 'tour', label: t('tabs.tour'), icon: '🗺️' },
    { id: 'activity', label: t('tabs.activity'), icon: '🎯' },
    { id: 'holiday-rentals', label: t('tabs.holidayRentals'), icon: '🏠' },
    { id: 'car', label: t('tabs.car'), icon: '🚗' },
    { id: 'cruise', label: t('tabs.cruise'), icon: '🚢' },
    { id: 'flights', label: t('tabs.flights'), icon: '✈️' }
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