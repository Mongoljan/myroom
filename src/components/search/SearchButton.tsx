'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface SearchButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  const { t } = useHydratedTranslation();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const id = Date.now();
      setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 950);
    }
    onClick?.(e);
  }, [onClick]);

  return (
    <div className="p-4">
      <motion.button
        ref={buttonRef}
        type="submit"
        onClick={handleClick}
        onMouseDown={(e) => e.preventDefault()}
        whileHover={{ scale: 1.02, boxShadow: '0 6px 22px rgba(142,197,255,0.45)' }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm bg-secondary hover:bg-secondary/90 text-white"
      >
        {/* 3-ring water ripple */}
        {ripples.flatMap(r => [
          <span key={`${r.id}-a`} className="absolute rounded-full pointer-events-none animate-water-ripple-a" style={{ left: r.x, top: r.y, width: 8, height: 8, background: 'rgba(255,255,255,0.55)' }} />,
          <span key={`${r.id}-b`} className="absolute rounded-full pointer-events-none animate-water-ripple-b" style={{ left: r.x, top: r.y, width: 8, height: 8, background: 'rgba(255,255,255,0.32)' }} />,
          <span key={`${r.id}-c`} className="absolute rounded-full pointer-events-none animate-water-ripple-c" style={{ left: r.x, top: r.y, width: 8, height: 8, background: 'rgba(255,255,255,0.16)' }} />,
        ])}
        <Search className="relative z-10 w-5 h-5" />
        <span className="relative z-10 hidden text-[18px] xl:inline font-semibold tracking-wide">
          {t('search.searchButton', 'Хайх')}
        </span>
      </motion.button>
    </div>
  );
}
