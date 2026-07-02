'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Minus, Plus } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';

interface CustomGuestSelectorProps {
  adults: number;
  childrenCount: number;
  rooms: number;
  onGuestChange: (adults: number, children: number, rooms: number) => void;
  onChildrenAgesChange?: (ages: number[]) => void;
  className?: string;
  compact?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxChildAge?: number;
  hideLabel?: boolean; 
  textSizeClass?: string;
}

export default function CustomGuestSelector({
  adults,
  childrenCount,
  rooms,
  onGuestChange,
  onChildrenAgesChange,
  className = '',
  compact = false,
  onOpenChange,
  maxChildAge = 17,
  hideLabel = false,
  textSizeClass = 'text-sm',
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
  // Per-child ages: array length == localChildren, value -1 means not yet set
  const [childAges, setChildAges] = useState<number[]>(() => Array(childrenCount).fill(-1));
  // Whether to show red validation errors on unset age selects
  const [showAgeErrors, setShowAgeErrors] = useState(false);

  // Debounce timer ref - reduced delay for better UX
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Position calculation: prefer below the button, flip above when it won't fit, then clamp to viewport
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const modalWidth = 320;
    const modalHeightEstimate = 300; // generous upper-bound so clamping is conservative
    const padding = 16;

    const left = Math.max(padding, Math.min(rect.left, window.innerWidth - modalWidth - padding));

    const spaceBelow = window.innerHeight - rect.bottom - padding;
    const spaceAbove = rect.top - padding;

    let top: number;
    if (spaceBelow >= modalHeightEstimate || spaceBelow >= spaceAbove) {
      // Enough room below, or more room below than above → open downward
      top = rect.bottom + 8;
    } else {
      // More room above → open upward
      top = rect.top - modalHeightEstimate - 8;
    }

    // Always clamp to stay fully within the viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - modalHeightEstimate - padding));

    setModalPosition({ top, left });
  }, []);

  // Optimized event listeners - combined click outside and scroll handling
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event: Event) => {
      const isClick = event.type === 'mousedown';
      const isScroll = event.type === 'scroll';

      const agesIncomplete = localChildren > 0 && childAges.some((a) => a === -1);

      if (isClick) {
        const mouseEvent = event as MouseEvent;
        if (dropdownRef.current && !dropdownRef.current.contains(mouseEvent.target as Node) && 
            buttonRef.current && !buttonRef.current.contains(mouseEvent.target as Node)) {
          if (agesIncomplete) {
            setShowAgeErrors(true);
            return;
          }
          setIsOpen(false);
          onOpenChange?.(false);
        }
      } else if (isScroll) {
        if (agesIncomplete) {
          setShowAgeErrors(true);
          return;
        }
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    // Single listener for both interactions with passive scroll
    document.addEventListener('mousedown', handleOutsideInteraction);
    window.addEventListener('scroll', handleOutsideInteraction, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      window.removeEventListener('scroll', handleOutsideInteraction);
    };
  }, [isOpen, localChildren, childAges]);

  // Sync local state with props
  useEffect(() => {
    setLocalAdults(adults);
    setLocalChildren(childrenCount);
    setLocalRooms(rooms);
    setChildAges((prev) => {
      if (prev.length === childrenCount) return prev;
      if (childrenCount > prev.length) return [...prev, ...Array(childrenCount - prev.length).fill(-1)];
      return prev.slice(0, childrenCount);
    });
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
      // Compute new ages array outside the updater to avoid calling a prop callback during setState
      const newAges = newChildren > childAges.length
        ? [...childAges, ...Array(newChildren - childAges.length).fill(-1)]
        : childAges.slice(0, newChildren);
      setChildAges(newAges);
      onChildrenAgesChange?.(newAges);
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
  }, [localAdults, localChildren, localRooms, childAges, onGuestChange, onChildrenAgesChange]);

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
        type="button"
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            calculatePosition();
            setIsOpen(true);
            onOpenChange?.(true);
            setShowAgeErrors(false);
          } else {
            if (localChildren > 0 && childAges.some((a) => a === -1)) {
              setShowAgeErrors(true);
              return;
            }
            setIsOpen(false);
            onOpenChange?.(false);
          }
        }}
        className={`w-full flex items-center justify-between ${compact ? 'p-1.5' : 'p-5'} transition-colors group hover:bg-gray-50 dark:hover:bg-gray-700`}
      >
        <div className="flex items-center gap-4">
          <User className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-slate-900`} />
          <div className="text-left">
            <div className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${hideLabel ? 'hidden' : 'mb-1'}`}>
              {t('search.guest', 'Зочин')}
            </div>
            <div className={`text-base font-medium text-gray-900 dark:text-white ${textSizeClass}`}>
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
                    {t('search.adults', 'Том хүн')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {maxChildAge != null ? `${maxChildAge + 1}-аас дээш нас` : '18-аас дээш нас'}
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
                    {t('search.children', 'Хүүхэд')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {maxChildAge != null ? `0–${maxChildAge} нас` : '0–17 нас'}
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

              {/* Per-child age inputs */}
              {localChildren > 0 && (
                <div className="space-y-2 pt-1 w-full">
                  <p className={`text-xs leading-snug text-justify ${showAgeErrors && childAges.some(a => a === -1) ? 'text-red-600 dark:text-red-400 font-medium' : 'text-amber-600 dark:text-amber-400'}`}>
                    Өрөөний үнийг үнэн зөв тооцоолоход шаардлагатай тул хүүхэд бүрийн насыг үнэн зөв оруулна уу.
                    {showAgeErrors && childAges.some(a => a === -1) && ' Бүх хүүхэдийн насыг сонгоно уу.'}
                  </p>
                  {childAges.map((age, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300 shrink-0">
                        Хүүхэд {idx + 1}
                      </label>
                      <select
                        value={age === -1 ? '' : age}
                        onChange={(e) => {
                          const val = e.target.value === '' ? -1 : parseInt(e.target.value);
                          const next = [...childAges];
                          next[idx] = val;
                          setChildAges(next);
                          onChildrenAgesChange?.(next);
                        }}
                        className={`flex-1 border rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer ${
                          showAgeErrors && age === -1
                            ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <option value="">Нас оруулах</option>
                        {Array.from({ length: maxChildAge + 1 }, (_, i) => (
                          <option key={i} value={i}>{i} нас</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

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
            </div>

          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}