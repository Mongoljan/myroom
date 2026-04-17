'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, Minus, Plus } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';

interface CustomGuestSelectorProps {
  adults: number;
  childrenCount: number;
  rooms: number;
  onGuestChange: (adults: number, children: number, rooms: number) => void;
  className?: string;
  compact?: boolean;
}

export default function CustomGuestSelector({
  adults,
  childrenCount,
  rooms,
  onGuestChange,
  className = '',
  compact = false
}: CustomGuestSelectorProps) {
  const { t } = useHydratedTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Local state for optimistic updates
  const [localAdults, setLocalAdults] = useState(adults);
  const [localChildren, setLocalChildren] = useState(childrenCount);
  const [localRooms, setLocalRooms] = useState(rooms);

  // Debounce timer ref - reduced delay for better UX
  const debounceRef = useRef<NodeJS.Timeout>();

  // Simplified position calculation with performance optimization
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const modalWidth = 320;
    const padding = 16;
    
    let top = rect.bottom + 8;
    const left = Math.max(padding, Math.min(rect.left, window.innerWidth - modalWidth - padding));
    
    // Simple bottom check without complex height calculations
    if (top > window.innerHeight * 0.7) {
      top = rect.top - 280; // Fixed height estimate instead of dynamic calculation
    }
    
    setModalPosition({ top, left });
  }, []);

  // Optimized event listeners - combined click outside and scroll handling
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event: Event) => {
      const isClick = event.type === 'mousedown';
      const isScroll = event.type === 'scroll';
      
      if (isClick) {
        const mouseEvent = event as MouseEvent;
        if (dropdownRef.current && !dropdownRef.current.contains(mouseEvent.target as Node) && 
            buttonRef.current && !buttonRef.current.contains(mouseEvent.target as Node)) {
          setIsOpen(false);
        }
      } else if (isScroll) {
        setIsOpen(false);
      }
    };

    // Single listener for both interactions with passive scroll
    document.addEventListener('mousedown', handleOutsideInteraction);
    window.addEventListener('scroll', handleOutsideInteraction, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      window.removeEventListener('scroll', handleOutsideInteraction);
    };
  }, [isOpen]);

  // Sync local state with props
  useEffect(() => {
    setLocalAdults(adults);
    setLocalChildren(childrenCount);
    setLocalRooms(rooms);
  }, [adults, childrenCount, rooms]);

  const updateGuests = useCallback((type: 'adults' | 'children' | 'rooms', increment: boolean) => {
    let newAdults = localAdults;
    let newChildren = localChildren;
    let newRooms = localRooms;

    if (type === 'adults') {
      newAdults = increment ? localAdults + 1 : Math.max(1, localAdults - 1);
      setLocalAdults(newAdults);
    } else if (type === 'children') {
      newChildren = increment ? localChildren + 1 : Math.max(0, localChildren - 1);
      setLocalChildren(newChildren);
    } else if (type === 'rooms') {
      newRooms = increment ? localRooms + 1 : Math.max(1, localRooms - 1);
      setLocalRooms(newRooms);
    }

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Reduced debounce timer from 300ms to 150ms for better performance
    debounceRef.current = setTimeout(() => {
      onGuestChange(newAdults, newChildren, newRooms);
    }, 150);
  }, [localAdults, localChildren, localRooms, onGuestChange]);

  const getGuestText = () => {
    const parts = [];
    parts.push(`${localAdults} ${t('search.adults', 'adults').toLowerCase()}`);
    if (localChildren > 0) {
      parts.push(`${localChildren} ${t('search.children', 'children').toLowerCase()}`);
    }
    parts.push(`${localRooms} ${t('search.rooms', 'rooms').toLowerCase()}`);
    return parts.join(' · ');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button - Simplified animations for better performance */}
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            calculatePosition();
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        className={`w-full flex items-center justify-between ${compact ? 'p-1.5' : 'p-5'} transition-colors group hover:bg-gray-50 dark:hover:bg-gray-700`}
      >
        <div className="flex items-center gap-4">
          <Users className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-slate-900`} />
          <div className="text-left">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('search.guest', 'Зочин')}
            </div>
            <div className="text-base font-medium text-gray-900 dark:text-white">
              {getGuestText()}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-[320px] max-w-[90vw] z-[100000]"
            style={{ 
              top: Math.max(8, modalPosition.top),
              left: Math.max(8, Math.min(modalPosition.left, window.innerWidth - 336)),
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${TYPOGRAPHY.modal.title} text-gray-900 dark:text-white`}>
                    {t('search.adults', 'Adults')}
                  </div>
                  <div className="text-xs text-gray-900 dark:text-gray-300">
                    {t('search.adultsAgeNote', 'Age 13 or above')}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateGuests('adults', false)}
                    disabled={localAdults <= 1}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 transition-colors hover:bg-slate-50"
                  >
                    <Minus className="w-4 h-4 text-slate-900" />
                  </button>
                  <div className="w-12 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{localAdults}</span>
                  </div>
                  <button
                    onClick={() => updateGuests('adults', true)}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 transition-colors hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${TYPOGRAPHY.modal.title} text-gray-900 dark:text-white`}>
                    {t('search.children', 'Children')}
                  </div>
                  <div className="text-xs text-gray-900 dark:text-gray-300">
                    {t('search.childrenAgeNote', 'Age 0-12')}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('children', false)}
                    disabled={localChildren <= 0}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-900" />
                  </motion.button>
                  <div className="w-12 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{localChildren}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('children', true)}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-900" />
                  </motion.button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${TYPOGRAPHY.modal.title} text-gray-900 dark:text-white`}>
                    {t('search.rooms', 'Rooms')}
                  </div>
                  <div className="text-xs text-gray-900 dark:text-gray-300">
                    {t('search.roomsNote', 'Separate accommodations')}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('rooms', false)}
                    disabled={localRooms <= 1}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-900" />
                  </motion.button>
                  <div className="w-12 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{localRooms}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateGuests('rooms', true)}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-900" />
                  </motion.button>
                </div>
              </div>

              {/* Done Button - Matching site theme */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-semibold transition-colors text-sm shadow-sm"
                >
                  {t('common.done', 'Болсон')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}