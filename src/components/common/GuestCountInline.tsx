'use client';

import { User, Baby } from 'lucide-react';

interface GuestCountInlineProps {
  adults: number;
  childCount?: number;
  className?: string;
  iconClassName?: string;
  showLabels?: boolean;
}

export default function GuestCountInline({
  adults,
  childCount = 0,
  className = '',
  iconClassName = 'w-3.5 h-3.5',
  showLabels = true,
}: GuestCountInlineProps) {
  return (
    <span className={`inline-flex items-center gap-x-2 whitespace-nowrap ${className}`}>
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
      {childCount > 0 && (
        <span className="inline-flex items-center gap-0.5">
          <Baby className={iconClassName} />
          x
          <span>
            {childCount}
            {/* {showLabels ? ' хүүхэд' : ''} */}
          </span>
        </span>
      )}
    </span>
  );
}
