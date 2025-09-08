'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onDateChange: (checkIn: string, checkOut: string) => void;
  placeholder?: string;
  label?: string | React.ReactNode;
  minimal?: boolean; // For hero section - removes border, padding, and calendar icon
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

export default function DateRangePicker({ 
  checkIn, 
  checkOut, 
  onDateChange, 
  placeholder = "Check in - Check out",
  label,
  minimal = false
}: DateRangePickerProps) {
  const { t } = useHydratedTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Parse dates using year/month/day directly to avoid timezone issues
  const checkInDate = checkIn ? (() => {
    const [year, month, day] = checkIn.split('-').map(Number);
    return new Date(year, month - 1, day);
  })() : null;
  const checkOutDate = checkOut ? (() => {
    const [year, month, day] = checkOut.split('-').map(Number);
    return new Date(year, month - 1, day);
  })() : null;

  // Calculate nights between dates
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const nights = calculateNights();

  // Calculate modal position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: buttonRect.bottom + 8, // 8px margin
        right: window.innerWidth - buttonRect.right
      });
    }
  }, [isOpen]);

  // Close picker when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Check if click is inside picker or button
      const isInsidePicker = pickerRef.current?.contains(target);
      const isInsideButton = buttonRef.current?.contains(target);
      
      if (!isInsidePicker && !isInsideButton) {
        setIsOpen(false);
      }
    }

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 150);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDisplayDate = () => {
    if (!checkIn && !checkOut) return placeholder;
    
    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const formattedYear = date.getFullYear();
      const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedDay = date.getDate().toString().padStart(2, '0');
      return `${formattedYear}/${formattedMonth}/${formattedDay}`;
    };

    if (checkIn && checkOut) {
      const nightsText = nights === 1 ? `1 ${t('navigation.night')}` : `${nights} ${t('navigation.nights')}`;
      return `${formatDate(checkIn)} - ${nightsText} - ${formatDate(checkOut)}`;
    } else if (checkIn) {
      return `${formatDate(checkIn)} - ${t('common.selectCheckout')}`;
    }
    return placeholder;
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) { // 6 weeks
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isDisabled: currentDate < today
      });
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const handleDateClick = (date: Date) => {
    // Format date without timezone conversion
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onDateChange(dateStr, '');
    } else if (checkIn && !checkOut) {
      // Complete the range
      if (checkInDate && date >= checkInDate) {
        onDateChange(checkIn, dateStr);
        // Don't auto-close, let user click Done button
      } else {
        // If selected date is before check-in, start new selection
        onDateChange(dateStr, '');
      }
    }
  };

  const isDateInRange = (date: Date): boolean => {
    if (!checkInDate || !checkOutDate) return false;
    return date >= checkInDate && date <= checkOutDate;
  };

  const isDateRangeStart = (date: Date): boolean => {
    return checkInDate ? date.getTime() === checkInDate.getTime() : false;
  };

  const isDateRangeEnd = (date: Date): boolean => {
    return checkOutDate ? date.getTime() === checkOutDate.getTime() : false;
  };

  const isDateInHoverRange = (date: Date): boolean => {
    if (!checkInDate || !hoverDate || checkOutDate) return false;
    const start = checkInDate < hoverDate ? checkInDate : hoverDate;
    const end = checkInDate < hoverDate ? hoverDate : checkInDate;
    return date >= start && date <= end;
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const displayMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const days = getDaysInMonth(displayMonth);
    
    // Get month name with proper translation
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthIndex = displayMonth.getMonth();
    const year = displayMonth.getFullYear();
    const monthKey = monthNames[monthIndex];
    const monthName = `${t(`calendar.months.${monthKey}`)} ${year}`;

    return (
      <div className="flex-1 px-2">
        <div className="flex items-center justify-between mb-3">
          {monthOffset === 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevMonth();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronLeft className="w-4 h-4 text-gray-900" />
            </button>
          )}
          <h3 className={`font-medium text-gray-900 text-xs ${monthOffset === 0 ? '' : 'ml-10'}`}>
            {monthName}
          </h3>
          {monthOffset === 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextMonth();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          )}
          {monthOffset === 0 && <div className="w-10" />}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {[
            t('calendar.sun', 'Su'),
            t('calendar.mon', 'Mo'), 
            t('calendar.tue', 'Tu'),
            t('calendar.wed', 'We'),
            t('calendar.thu', 'Th'),
            t('calendar.fri', 'Fr'),
            t('calendar.sat', 'Sa')
          ].map((day, index) => (
            <div key={index} className="text-xs font-medium text-gray-900 text-center py-0.5">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            // Hide days that don't belong to current month
            if (!day.isCurrentMonth) {
              return <div key={index} className="relative p-2 text-sm"></div>;
            }

            const isInRange = isDateInRange(day.date);
            const isRangeStart = isDateRangeStart(day.date);
            const isRangeEnd = isDateRangeEnd(day.date);
            const isInHoverRange = isDateInHoverRange(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();

            // Build classes with proper priority hierarchy (only for current month days)
            let buttonClass = 'relative p-1.5 text-xs font-medium transition-all duration-150';
            
            // Priority 1: DISABLED STATE (overrides everything)
            if (day.isDisabled) {
              buttonClass += ' text-gray-400 cursor-not-allowed rounded-md opacity-50';
            }
            // Priority 2: SELECTED RANGE STATES
            else if (isRangeStart && isRangeEnd) {
              // Single day selection
              buttonClass += ' bg-blue-600 text-white font-semibold cursor-pointer rounded-md';
            }
            else if (isRangeStart) {
              buttonClass += ' bg-blue-600 text-white font-semibold cursor-pointer rounded-l-md';
            }
            else if (isRangeEnd) {
              buttonClass += ' bg-blue-600 text-white font-semibold cursor-pointer rounded-r-md';
            }
            else if (isInRange) {
              // Days between range
              buttonClass += ' bg-blue-200 text-blue-800 cursor-pointer';
            }
            // Priority 3: HOVER PREVIEW RANGE
            else if (isInHoverRange) {
              buttonClass += ' bg-blue-100 text-blue-700 cursor-pointer rounded-md';
            }
            // Priority 4: TODAY HIGHLIGHT (More Subtle)
            else if (isToday) {
              buttonClass += ' text-gray-900 cursor-pointer rounded-md hover:bg-blue-100 relative';
            }
            // Priority 5: NORMAL CURRENT MONTH DAYS
            else {
              buttonClass += ' text-gray-900 cursor-pointer rounded-md hover:bg-blue-100';
            }

            return (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!day.isDisabled) handleDateClick(day.date);
                }}
                onMouseEnter={() => !day.isDisabled && setHoverDate(day.date)}
                onMouseLeave={() => setHoverDate(null)}
                disabled={day.isDisabled}
                className={buttonClass}
              >
                {day.date.getDate()}
                {/* Subtle today indicator for non-range days */}
                {isToday && !isInRange && !isRangeStart && !isRangeEnd && !isInHoverRange && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
                {/* Corner today indicator for range days */}
                {isToday && (isInRange || isRangeStart || isRangeEnd) && (
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        className={minimal 
          ? "w-full text-left border-none outline-none bg-transparent cursor-pointer"
          : "w-full p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
        }
      >
        {minimal ? (
          <span className={`text-md font-medium ${
            checkIn || checkOut ? 'text-gray-900' : 'text-gray-400'
          }`}>
            {formatDisplayDate()}
          </span>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-900 mr-3" />
              <span className={checkIn || checkOut ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                {formatDisplayDate()}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-900 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        )}
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          ref={pickerRef}
          className="fixed bg-white border border-gray-200 rounded-xl z-[100000] p-4 w-[560px] max-w-[95vw]" 
          style={{ 
            top: Math.max(8, modalPosition.top), 
            right: Math.max(8, modalPosition.right),
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex">
            {/* Desktop: Two months side by side */}
            <div className="hidden md:flex w-full">
              {renderCalendar(0)}
              <div className="w-px bg-gray-200 mx-4"></div>
              {renderCalendar(1)}
            </div>
            
            {/* Mobile: Single month */}
            <div className="md:hidden w-full">
              {renderCalendar(0)}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}