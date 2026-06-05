'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  MONGOLIAN_CYRILLIC_LETTERS,
  isMongolianCyrillicLetter,
} from '@/utils/mongolianCyrillicLetters';

interface EbarimtCyrillicLetterSelectProps {
  value: string;
  onChange: (letter: string) => void;
  placeholder?: string;
  className?: string;
}

export default function EbarimtCyrillicLetterSelect({
  value,
  onChange,
  placeholder = '—',
  className = '',
}: EbarimtCyrillicLetterSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return [...MONGOLIAN_CYRILLIC_LETTERS];
    return MONGOLIAN_CYRILLIC_LETTERS.filter((letter) =>
      letter.toLowerCase().includes(q.toLowerCase())
    );
  }, [query]);

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

  const selectLetter = (letter: string) => {
    onChange(letter);
    setOpen(false);
    setQuery('');
  };

  const handleInputChange = (next: string) => {
    const trimmed = next.trim();
    if (!trimmed) {
      setQuery('');
      onChange('');
      return;
    }
    const lastChar = trimmed.slice(-1).toUpperCase();
    if (isMongolianCyrillicLetter(lastChar)) {
      onChange(lastChar);
      setQuery('');
      setOpen(false);
      return;
    }
    setQuery(trimmed);
    setOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative w-16 shrink-0 ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={open ? query : value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full p-2.5 pr-7 border border-gray-300 rounded-md text-sm text-center uppercase focus:ring-2 focus:ring-primary focus:border-primary"
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          aria-label="Open letter list"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-40 max-h-44 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {filtered.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => selectLetter(letter)}
              className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 ${
                value === letter ? 'bg-primary/10 text-primary font-medium' : 'text-gray-800'
              }`}
            >
              {letter}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-500">Олдсонгүй</p>
          )}
        </div>
      )}
    </div>
  );
}
