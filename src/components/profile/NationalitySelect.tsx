'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchCountryNames } from '@/services/restCountriesApi';

interface NationalitySelectProps {
  value: string;
  onChange: (nationality: string) => void;
  className?: string;
}

export default function NationalitySelect({
  value,
  onChange,
  className = '',
}: NationalitySelectProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetchCountryNames()
      .then((names) => {
        if (active) setCountries(names);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((name) => name.toLowerCase().includes(q));
  }, [countries, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCountry = (name: string) => {
    onChange(name);
    setOpen(false);
    setQuery('');
  };

  const displayValue = open ? query : value;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={loading ? '...' : value || 'Mongolia'}
          className="w-full px-3.5 py-2.5 pr-9 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Open country list"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-52 overflow-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          {loading && (
            <p className="px-3 py-2 text-xs text-gray-500">...</p>
          )}
          {!loading && filtered.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => selectCountry(name)}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 ${
                value === name
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {name}
            </button>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-500">Олдсонгүй</p>
          )}
        </div>
      )}
    </div>
  );
}
