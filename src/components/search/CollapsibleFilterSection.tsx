'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  /**
   * When true, "Бүгдийг харах" opens a right-side slide panel instead of
   * expanding the list inline.
   */
  usePanel?: boolean;
}

export default function CollapsibleFilterSection({
  title,
  children,
  itemCount,
  defaultExpanded = true,
  initialShowCount = 5,
  className = '',
  selectedCount = 0,
  onClear,
  usePanel = false,
}: CollapsibleFilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Convert children to array to handle slicing
  const childrenArray = Array.isArray(children) ? children : [children];
  const hasMoreItems = childrenArray.length > initialShowCount;
  const displayedChildren = showAll || !hasMoreItems
    ? childrenArray
    : childrenArray.slice(0, initialShowCount);

  const handleShowAllClick = () => {
    if (usePanel) {
      setPanelOpen(true);
    } else {
      setShowAll(!showAll);
    }
  };

  /* ─── Right-side "all items" panel (trip.com style) ─── */
  const panel = panelOpen && mounted
    ? createPortal(
        <div className="fixed inset-0 z-200 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-80 bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {childrenArray.length} зүйл
                </p>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-0.5">
              {childrenArray}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {selectedCount > 0 && onClear && (
                <button
                  onClick={() => { onClear(); setPanelOpen(false); }}
                  className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Бүгдийг арилгах
                </button>
              )}
              <button
                onClick={() => setPanelOpen(false)}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

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
              onClick={handleShowAllClick}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
            >
              {!usePanel && showAll ? (
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

      {panel}
    </div>
  );
}