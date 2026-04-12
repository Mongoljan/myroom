'use client';

import { ReactNode } from 'react';

interface SearchFormContainerProps {
  children: ReactNode;
  compact?: boolean;
}

export default function SearchFormContainer({ children, compact = false }: SearchFormContainerProps) {
  if (compact) {
    // Compact mode - no border, no shadow, seamless with header
    return (
      <div className="bg-white dark:bg-gray-800">
        {children}
      </div>
    );
  }

  // Normal mode - with border and shadow
  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-primary rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden"
     
    >
      {children}
    </div>
  );
}