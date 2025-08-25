'use client';

import { useState, useRef, useEffect } from 'react';
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
  const pickerRef = useRef<HTMLDivElement>(null);

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  // Calculate nights between dates
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const nights = calculateNights();

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDisplayDate = () => {
    if (!checkIn && !checkOut) return placeholder;
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };

    if (checkIn && checkOut) {
      const nightsText = nights === 1 ? `1 ${t('navigation.night', 'night')}` : `${nights} ${t('navigation.nights', 'nights')}`;
      return `${formatDate(checkIn)} - ${formatDate(checkOut)} • ${nightsText}`;
    } else if (checkIn) {
      return `${formatDate(checkIn)} - Select checkout`;
    }
    return placeholder;
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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
    const dateStr = date.toISOString().split('T')[0];
    
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onDateChange(dateStr, '');
    } else if (checkIn && !checkOut) {
      // Complete the range
      if (date >= new Date(checkIn)) {
        onDateChange(checkIn, dateStr);
        setIsOpen(false);
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
    const monthName = displayMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    return (
      <div className="flex-1 px-3">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
          )}
          <h3 className={`font-semibold text-gray-900 ${monthOffset === 0 ? '' : 'ml-12'}`}>
            {monthName}
          </h3>
          {monthOffset === 1 && (
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          )}
          {monthOffset === 0 && <div className="w-10" />}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isInRange = isDateInRange(day.date);
            const isRangeStart = isDateRangeStart(day.date);
            const isRangeEnd = isDateRangeEnd(day.date);
            const isInHoverRange = isDateInHoverRange(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();

            // Build classes with proper priority hierarchy
            let buttonClass = 'relative p-2 text-sm font-medium transition-all duration-150';
            
            // Priority 1: DISABLED STATE (overrides everything)
            if (day.isDisabled) {
              buttonClass += ' text-gray-300 cursor-not-allowed rounded-lg';
            }
            // Priority 2: SELECTED RANGE STATES
            else if (isRangeStart && isRangeEnd) {
              // Single day selection
              buttonClass += ' bg-blue-600 text-white font-semibold cursor-pointer rounded-lg';
            }
            else if (isRangeStart) {
              buttonClass += ' bg-blue-600 text-white font-semibold cursor-pointer rounded-l-lg';
            }
            else if (isRangeEnd) {
              buttonClass += ' bg-blue-600 text-white font-semibold cursor-pointer rounded-r-lg';
            }
            else if (isInRange) {
              // Days between range
              buttonClass += ' bg-blue-100 text-blue-800 cursor-pointer';
            }
            // Priority 3: HOVER PREVIEW RANGE
            else if (isInHoverRange) {
              buttonClass += ' bg-blue-50 text-blue-700 cursor-pointer rounded-lg';
            }
            // Priority 4: TODAY HIGHLIGHT
            else if (isToday) {
              if (day.isCurrentMonth) {
                buttonClass += ' bg-blue-50 text-blue-700 font-semibold cursor-pointer rounded-lg border border-blue-200';
              } else {
                buttonClass += ' text-gray-400 cursor-pointer rounded-lg hover:bg-gray-50';
              }
            }
            // Priority 5: NORMAL DAYS
            else {
              if (day.isCurrentMonth) {
                buttonClass += ' text-gray-900 cursor-pointer rounded-lg hover:bg-blue-50';
              } else {
                buttonClass += ' text-gray-400 cursor-pointer rounded-lg hover:bg-gray-50';
              }
            }

            return (
              <button
                key={index}
                onClick={() => !day.isDisabled && handleDateClick(day.date)}
                onMouseEnter={() => !day.isDisabled && setHoverDate(day.date)}
                onMouseLeave={() => setHoverDate(null)}
                disabled={day.isDisabled}
                className={buttonClass}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={minimal 
          ? "w-full text-left border-none outline-none bg-transparent cursor-pointer"
          : "w-full p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
        }
      >
        {minimal ? (
          <span className={`text-lg font-medium ${
            checkIn || checkOut ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {formatDisplayDate()}
          </span>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <span className={checkIn || checkOut ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                {formatDisplayDate()}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] p-6 min-w-[640px] max-w-2xl">
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
        </div>
      )}
    </div>
  );
}