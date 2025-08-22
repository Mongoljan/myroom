'use client'
import { useState } from "react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface GuestSelectorProps {
  adults: number;
  childrenCount: number;
  rooms: number;
  onGuestChange: (adults: number, children: number, rooms: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ 
  adults, 
  childrenCount, 
  rooms, 
  onGuestChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useHydratedTranslation();

  const updateGuests = (type: 'adults' | 'children' | 'rooms', increment: boolean) => {
    let newAdults = adults;
    let newChildren = childrenCount;
    let newRooms = rooms;

    if (type === 'adults') {
      newAdults = increment ? adults + 1 : Math.max(1, adults - 1);
  } else if (type === 'children') {
  newChildren = increment ? childrenCount + 1 : Math.max(0, childrenCount - 1);
    } else if (type === 'rooms') {
      newRooms = increment ? rooms + 1 : Math.max(1, rooms - 1);
    }

    onGuestChange(newAdults, newChildren, newRooms);
  };

  const guestText = `${adults} Adults${childrenCount > 0 ? `, ${childrenCount} Children` : ''}, ${rooms} Room${rooms > 1 ? 's' : ''}`;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {t('search.guest', 'Guests')}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
      >
        <span className="text-gray-900 dark:text-white">{guestText}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4 min-w-[320px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{t('search.adults', 'Adults')}</div>
                  <div className="text-sm text-gray-500">Age 13+</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateGuests('adults', false)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={adults <= 1}
                  >
                    <span className="text-lg leading-none">−</span>
                  </button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <button
                    onClick={() => updateGuests('adults', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{t('search.children', 'Children')}</div>
                  <div className="text-sm text-gray-500">Age 0-12</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateGuests('children', false)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={childrenCount <= 0}
                  >
                    <span className="text-lg leading-none">−</span>
                  </button>
                  <span className="w-8 text-center font-medium">{childrenCount}</span>
                  <button
                    onClick={() => updateGuests('children', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{t('search.rooms', 'Rooms')}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateGuests('rooms', false)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={rooms <= 1}
                  >
                    <span className="text-lg leading-none">−</span>
                  </button>
                  <span className="w-8 text-center font-medium">{rooms}</span>
                  <button
                    onClick={() => updateGuests('rooms', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('search.done', 'Done')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GuestSelector;