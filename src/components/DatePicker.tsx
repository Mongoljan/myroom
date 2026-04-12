"use client";

import { useEffect, useState } from 'react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function DatePicker({ value, onChange, className = '', disabled = false }: DatePickerProps) {
  const { t } = useHydratedTranslation();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setYear(y || '');
      setMonth(m || '');
      setDay(d || '');
    }
  }, [value]);

  // Update parent when any field changes
  useEffect(() => {
    if (day && month && year) {
      const newValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      if (newValue !== value) {
        onChange(newValue);
      }
    } else if (!day && !month && !year && value !== '') {
      onChange('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: '1', label: t('calendar.months.january', 'January') },
    { value: '2', label: t('calendar.months.february', 'February') },
    { value: '3', label: t('calendar.months.march', 'March') },
    { value: '4', label: t('calendar.months.april', 'April') },
    { value: '5', label: t('calendar.months.may', 'May') },
    { value: '6', label: t('calendar.months.june', 'June') },
    { value: '7', label: t('calendar.months.july', 'July') },
    { value: '8', label: t('calendar.months.august', 'August') },
    { value: '9', label: t('calendar.months.september', 'September') },
    { value: '10', label: t('calendar.months.october', 'October') },
    { value: '11', label: t('calendar.months.november', 'November') },
    { value: '12', label: t('calendar.months.december', 'December') },
  ];

  // Calculate days in month
  const getDaysInMonth = (m: string, y: string) => {
    if (!m || !y) return 31;
    return new Date(parseInt(y), parseInt(m), 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Month */}
      <div className="relative flex-1">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={disabled}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          <option value="">{t('datePicker.month', 'Month')}</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>

      {/* Day */}
      <div className="relative w-24">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          disabled={disabled}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          <option value="">{t('datePicker.day', 'Day')}</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>

      {/* Year */}
      <div className="relative w-28">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={disabled}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          <option value="">{t('datePicker.year', 'Year')}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>
    </div>
  );
}
