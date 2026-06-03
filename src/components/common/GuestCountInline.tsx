'use client';

import { User, Baby } from 'lucide-react';

interface GuestCountInlineProps {
  adults: number;
  children?: number;
  className?: string;
  iconClassName?: string;
  showLabels?: boolean;
}

export default function GuestCountInline({
  adults,
  children = 0,
  className = '',
  iconClassName = 'w-3.5 h-3.5',
  showLabels = true,
}: GuestCountInlineProps) {
  return (
    <span className={`inline-flex items-center flex-wrap gap-x-2 gap-y-0.5 ${className}`}>
      {adults > 0 && (
        <span className="inline-flex items-center gap-0.5">
          <User className={iconClassName} strokeWidth={2} />
          x
          <span>
            {adults}
            {/* {showLabels ? ' том хүн' : ''} */}
          </span>
        </span>
      )}
      {children > 0 && (
        <span className="inline-flex items-center gap-0.5">
          <Baby className={iconClassName} />
          x
          <span>
            {children}
            {/* {showLabels ? ' хүүхэд' : ''} */}
          </span>
        </span>
      )}
    </span>
  );
}
