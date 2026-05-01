'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface CollapsibleFilterSectionProps {
  title: string;
  children: React.ReactNode;
  itemCount?: number;
  defaultExpanded?: boolean;
  initialShowCount?: number;
  className?: string;
  /** Number of currently-selected items in this group  */
  selectedCount?: number;
  /** Called when the user clicks the group-level clear (×) button */
  onClear?: () => void;
}

export default function CollapsibleFilterSection({
  title,
  children,
  itemCount,
  defaultExpanded = true,
  initialShowCount = 5,
  className = '',
  selectedCount = 0,
  onClear
}: CollapsibleFilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  // Convert children to array to handle slicing
  const childrenArray = Array.isArray(children) ? children : [children];
  const hasMoreItems = childrenArray.length > initialShowCount;
  const displayedChildren = showAll ? childrenArray : childrenArray.slice(0, initialShowCount);

  return (
    <div className={`space-y-2 border-b border-gray-200 dark:border-gray-600 pb-3 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 flex-1 text-left hover:text-primary-600 transition-colors min-w-0"
        >
          <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 truncate">
            {title}
            {selectedCount > 0 && (
              <span className="ml-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
                ({selectedCount})
              </span>
            )}
          </h4>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 ml-1" />
          )}
        </button>

        {/* Clear button — only shown when there are selected items */}
        {selectedCount > 0 && onClear && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            title="Арилгах"
            className="ml-1 shrink-0 p-0.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

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
                  Цөөн харах
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Бүгдийг харах ({childrenArray.length})
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