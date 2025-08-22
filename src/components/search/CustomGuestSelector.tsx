'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, Minus, Plus } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface CustomGuestSelectorProps {
  adults: number;
  children: number;
  rooms: number;
  onGuestChange: (adults: number, children: number, rooms: number) => void;
  className?: string;
}

export default function CustomGuestSelector({
  adults,
  children,
  rooms,
  onGuestChange,
  className = ''
}: CustomGuestSelectorProps) {
  const { t } = useHydratedTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateGuests = (type: 'adults' | 'children' | 'rooms', increment: boolean) => {
    let newAdults = adults;
    let newChildren = children;
    let newRooms = rooms;

    if (type === 'adults') {
      newAdults = increment ? adults + 1 : Math.max(1, adults - 1);
    } else if (type === 'children') {
      newChildren = increment ? children + 1 : Math.max(0, children - 1);
    } else if (type === 'rooms') {
      newRooms = increment ? rooms + 1 : Math.max(1, rooms - 1);
    }

    onGuestChange(newAdults, newChildren, newRooms);
  };

  const getGuestText = () => {
    const parts = [];
    parts.push(`${adults} adult${adults !== 1 ? 's' : ''}`);
    if (children > 0) {
      parts.push(`${children} child${children !== 1 ? 'ren' : ''}`);
    }
    parts.push(`${rooms} room${rooms !== 1 ? 's' : ''}`);
    return parts.join(' · ');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl"
      >
        <div className="flex items-center">
          <Users className="w-6 h-6 text-gray-400 mr-4" />
          <div className="text-left">
            <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {t('search.guest', 'Guest')}
            </div>
            <div className="text-lg font-medium text-gray-900">
              {getGuestText()}
            </div>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {t('search.adults', 'Adults')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Age 13 or above
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('adults', false)}
                    disabled={adults <= 1}
                    className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-blue-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                  <div className="w-12 text-center">
                    <span className="text-xl font-semibold text-gray-900">{adults}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('adults', true)}
                    className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {t('search.children', 'Children')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Age 0-12
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('children', false)}
                    disabled={children <= 0}
                    className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-blue-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                  <div className="w-12 text-center">
                    <span className="text-xl font-semibold text-gray-900">{children}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('children', true)}
                    className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {t('search.rooms', 'Rooms')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Separate accommodations
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('rooms', false)}
                    disabled={rooms <= 1}
                    className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-blue-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                  <div className="w-12 text-center">
                    <span className="text-xl font-semibold text-gray-900">{rooms}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('rooms', true)}
                    className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                </div>
              </div>

              {/* Done Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t('common.done', 'Done')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}