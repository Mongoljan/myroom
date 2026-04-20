'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleFilterSectionProps {
  title: string;
  children: React.ReactNode;
  itemCount?: number;
  defaultExpanded?: boolean;
  initialShowCount?: number;
  className?: string;
}

export default function CollapsibleFilterSection({
  title,
  children,
  itemCount,
  defaultExpanded = true,
  initialShowCount = 5,
  className = ''
}: CollapsibleFilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  // Convert children to array to handle slicing
  const childrenArray = Array.isArray(children) ? children : [children];
  const hasMoreItems = childrenArray.length > initialShowCount;
  const displayedChildren = showAll ? childrenArray : childrenArray.slice(0, initialShowCount);

  return (
    <div className={`space-y-2 border-b border-gray-100 dark:border-gray-700 pb-3 ${className}`}>
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left hover:text-primary-600 transition-colors"
      >
        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300">
          {title}
          {itemCount !== undefined && (
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
              ({itemCount})
            </span>
          )}
        </h4>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="space-y-1">
          {displayedChildren}

          {/* Show All / Show Less Button */}
          {hasMoreItems && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Show all {childrenArray.length}
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}