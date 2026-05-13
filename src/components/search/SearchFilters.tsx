'use client';

import { Star, X } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import CollapsibleFilterSection from './CollapsibleFilterSection';
import { SearchHotelResult } from '@/types/api';
import {
  useSearchFilters,
  UB_LANDMARKS,
  type CombinedApiData,
  type FilterState,
} from '@/hooks/useSearchFilters';

export { UB_LANDMARKS };

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  embedded?: boolean;
  apiData?: CombinedApiData | null;
  filters?: FilterState;
  filterCounts?: Record<string, number>;
  /** Min/Max price across current search results, used for the budget slider. */
  priceBounds?: [number, number];
  /** Number of hotels with a discounted cheapest room */
  discountedCount?: number;
  /** Number of hotels in the current results, used to gate the price slider. */
  totalResults?: number;
  /** All hotels from the search result — used to derive neighbourhood options. */
  hotels?: SearchHotelResult[];
}

export default function SearchFilters({
  isOpen,
  onClose,
  onFilterChange,
  embedded = false,
  apiData,
  filters: externalFilters,
  filterCounts = {},
  priceBounds,
  discountedCount = 0,
  totalResults = 0,
  hotels = [],
}: SearchFiltersProps) {
  const { t } = useHydratedTranslation();

  const {
    filters,
    recentIndividualFilters,
    setRecentIndividualFilters,
    loadingApi,
    updateFilters,
    handleClearAllFilters,
    isItemActive,
    toggleRecentFilter,
    roomFeatureFacilities,
    generalServiceFacilities,
    roomFacilitiesData,
    outdoorFacilities,
    accessibilityFacilities,
    bedTypeFacilities,
    neighbourhoodOptions,
    landmarkCounts,
  } = useSearchFilters({ onFilterChange, apiData, externalFilters, filterCounts, priceBounds, hotels });

  // Build active filter chips (shown at sidebar top and above hotel cards)
  const activeFilterChips: { label: string; onRemove: () => void }[] = [];

  (filters.propertyTypes || []).forEach(id => {
    const type = apiData?.property_types?.find(pt => pt.id === id);
    if (type) activeFilterChips.push({ label: type.name_mn, onRemove: () => updateFilters({ propertyTypes: (filters.propertyTypes || []).filter(i => i !== id) }) });
  });

  (filters.starRating || []).forEach(stars => {
    activeFilterChips.push({ label: `${stars} \u2605`, onRemove: () => updateFilters({ starRating: (filters.starRating || []).filter(s => s !== stars) }) });
  });

  if (filters.discounted) {
    activeFilterChips.push({ label: t('search.filtersSection.discounted') || '\u0425\u044f\u043c\u0434\u0440\u0430\u043b\u0442\u0430\u0439', onRemove: () => updateFilters({ discounted: false }) });
  }

  if (priceBounds && (filters.priceRange[0] > priceBounds[0] || filters.priceRange[1] < priceBounds[1])) {
    const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
    activeFilterChips.push({ label: `₮${fmt(filters.priceRange[0])}-₮${fmt(filters.priceRange[1])}`, onRemove: () => updateFilters({ priceRange: [priceBounds[0], priceBounds[1]] }) });
  }

  (filters.roomFeatures || []).forEach(id => {
    const fac = apiData?.facilities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ roomFeatures: (filters.roomFeatures || []).filter(i => i !== id) }) });
  });

  (filters.generalServices || []).forEach(id => {
    const fac = apiData?.additionalFacilities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ generalServices: (filters.generalServices || []).filter(i => i !== id) }) });
  });

  (filters.roomFacilities || []).forEach(id => {
    const fac = apiData?.roomFacilities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ roomFacilities: (filters.roomFacilities || []).filter(i => i !== id) }) });
  });

  (filters.outdoorAreas || []).forEach(id => {
    const fac = apiData?.activities?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ outdoorAreas: (filters.outdoorAreas || []).filter(i => i !== id) }) });
  });

  (filters.accessibilityFeatures || []).forEach(id => {
    const fac = apiData?.accessibility_features?.find(f => f.id === id);
    if (fac) activeFilterChips.push({ label: fac.name_mn, onRemove: () => updateFilters({ accessibilityFeatures: (filters.accessibilityFeatures || []).filter(i => i !== id) }) });
  });

  (filters.bedTypes || []).forEach(id => {
    const bt = bedTypeFacilities.find(b => b.id === id);
    if (bt) activeFilterChips.push({ label: bt.name, onRemove: () => updateFilters({ bedTypes: (filters.bedTypes || []).filter(i => i !== id) }) });
  });

  (filters.neighbourhood || []).forEach(name => {
    activeFilterChips.push({ label: name, onRemove: () => updateFilters({ neighbourhood: (filters.neighbourhood || []).filter(n => n !== name) }) });
  });

  (filters.landmark || []).forEach(id => {
    const lm = UB_LANDMARKS.find(l => l.id === id);
    if (lm) activeFilterChips.push({ label: lm.name_mn, onRemove: () => updateFilters({ landmark: (filters.landmark || []).filter(l => l !== id) }) });
  });

  if (embedded) {
    return (
      <>
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold text-gray-900 dark:text-white">{t('search.filtersSection.title')}</h3>

          {/* 1. Өмнөх хайлтууд */}
          {recentIndividualFilters.length > 0 && (
            <CollapsibleFilterSection
              title='Өмнөх хайлтууд'
              itemCount={recentIndividualFilters.length}
              initialShowCount={5}
              selectedCount={recentIndividualFilters.filter(item => isItemActive(item)).length}
              onClear={() => {
                setRecentIndividualFilters([]);
                try { localStorage.removeItem('hotel_recent_individual_filters'); } catch { /* ignore */ }
              }}
            >
              {recentIndividualFilters.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleRecentFilter(item)}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.label}</span>
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 2. Буудлын төрөл */}
          {apiData?.property_types && apiData.property_types.length > 0 && (
            <CollapsibleFilterSection
              title='Буудлын төрөл'
              itemCount={apiData.property_types.length}
              initialShowCount={5}
              selectedCount={(filters.propertyTypes || []).length}
              onClear={() => updateFilters({ propertyTypes: [] })}
            >
              {[...apiData.property_types].sort((a, b) => a.name_mn.localeCompare(b.name_mn, 'mn')).map((pt) => {
                const isSelected = (filters.propertyTypes || []).includes(pt.id);
                const count = filterCounts[`propertyType_${pt.id}`];
                return (
                  <label key={pt.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ propertyTypes: isSelected ? (filters.propertyTypes || []).filter(id => id !== pt.id) : [...(filters.propertyTypes || []), pt.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{pt.name_mn}</span>
                    {count !== undefined && count > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 2. Popular filters */}
          {(() => {
            const popularFacs = roomFeatureFacilities
              .filter(f => (filterCounts[`facility_${f.id}`] || 0) > 0)
              .sort((a, b) => (filterCounts[`facility_${b.id}`] || 0) - (filterCounts[`facility_${a.id}`] || 0))
              .slice(0, 4);
            if (popularFacs.length === 0) return null;
            return (
              <div className="space-y-1.5 border-b border-gray-200 dark:border-gray-600 pb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Түгээмэл хайлтууд</h4>
                {popularFacs.map((facility) => {
                  const isSelected = (filters.roomFeatures || []).includes(facility.id);
                  return (
                    <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateFilters({ roomFeatures: isSelected ? (filters.roomFeatures || []).filter(id => id !== facility.id) : [...(filters.roomFeatures || []), facility.id] })}
                        className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                      {filterCounts[`facility_${facility.id}`] !== undefined && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                      )}
                    </label>
                  );
                })}
              </div>
            );
          })()}

          {/* 3. Budget */}
          {priceBounds && priceBounds[1] > priceBounds[0] && totalResults >= 1 && (
            <div className="space-y-2 border-b border-gray-200 dark:border-gray-600 pb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Үнэ</h4>
              {(() => {
                const minVal = Math.max(priceBounds[0], filters.priceRange?.[0] ?? priceBounds[0]);
                const maxVal = Math.min(priceBounds[1], filters.priceRange?.[1] ?? priceBounds[1]);
                const step = Math.max(1000, Math.round((priceBounds[1] - priceBounds[0]) / 100));
                const fmt = (n: number) => '₮' + new Intl.NumberFormat('en-US').format(n);
                const range = priceBounds[1] - priceBounds[0];
                const leftPct = range > 0 ? ((minVal - priceBounds[0]) / range) * 100 : 0;
                const rightPct = range > 0 ? ((priceBounds[1] - maxVal) / range) * 100 : 0;
                // When min thumb is pushed far right, bring it to top so user can drag it back left
                const minZIndex = leftPct >= 90 ? 4 : 2;
                const maxZIndex = leftPct >= 90 ? 2 : 4;
                return (
                  <>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{fmt(minVal)}</span>
                      <span>{fmt(maxVal)}</span>
                    </div>
                    <div className="relative h-5 flex items-center">
                      {/* Track background */}
                      <div className="absolute inset-x-0 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full" />
                      {/* Active fill between thumbs */}
                      <div
                        className="absolute h-1.5 bg-primary rounded-full"
                        style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
                      />
                      {/* Visual min thumb */}
                      <div
                        className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow pointer-events-none -translate-x-1/2"
                        style={{ left: `${leftPct}%`, zIndex: 1 }}
                      />
                      {/* Visual max thumb */}
                      <div
                        className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow pointer-events-none -translate-x-1/2"
                        style={{ left: `${100 - rightPct}%`, zIndex: 1 }}
                      />
                      {/* Min handle input */}
                      <input
                        type="range"
                        min={priceBounds[0]}
                        max={priceBounds[1]}
                        step={step}
                        value={minVal}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val < maxVal) updateFilters({ priceRange: [val, maxVal] }, { saveRecent: false });
                        }}
                        onMouseUp={(e) => {
                          const val = Math.min(parseInt((e.target as HTMLInputElement).value, 10), maxVal - step);
                          updateFilters({ priceRange: [val, maxVal] });
                        }}
                        onTouchEnd={(e) => {
                          const val = Math.min(parseInt((e.target as HTMLInputElement).value, 10), maxVal - step);
                          updateFilters({ priceRange: [val, maxVal] });
                        }}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        style={{ zIndex: minZIndex }}
                      />
                      {/* Max handle input */}
                      <input
                        type="range"
                        min={priceBounds[0]}
                        max={priceBounds[1]}
                        step={step}
                        value={maxVal}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val > minVal) updateFilters({ priceRange: [minVal, val] }, { saveRecent: false });
                        }}
                        onMouseUp={(e) => {
                          const val = Math.max(parseInt((e.target as HTMLInputElement).value, 10), minVal + step);
                          updateFilters({ priceRange: [minVal, val] });
                        }}
                        onTouchEnd={(e) => {
                          const val = Math.max(parseInt((e.target as HTMLInputElement).value, 10), minVal + step);
                          updateFilters({ priceRange: [minVal, val] });
                        }}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        style={{ zIndex: maxZIndex }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* 5. Үндсэн үйлчилгээ */}
          {roomFeatureFacilities.length > 0 && (
            <CollapsibleFilterSection
              title='Үндсэн үйлчилгээ'
              itemCount={roomFeatureFacilities.length}
              initialShowCount={10}
              selectedCount={(filters.roomFeatures || []).length}
              onClear={() => updateFilters({ roomFeatures: [] })}
              usePanel
            >
              {roomFeatureFacilities.map((facility) => {
                const isSelected = (filters.roomFeatures || []).includes(facility.id);
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ roomFeatures: isSelected ? (filters.roomFeatures || []).filter(id => id !== facility.id) : [...(filters.roomFeatures || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`facility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 6. Нэмэлт үйлчилгээ */}
          {generalServiceFacilities.length > 0 && (
            <CollapsibleFilterSection
              title='Нэмэлт үйлчилгээ'
              itemCount={generalServiceFacilities.length}
              initialShowCount={10}
              selectedCount={(filters.generalServices || []).length}
              onClear={() => updateFilters({ generalServices: [] })}
              usePanel
            >
              {generalServiceFacilities.map((facility) => {
                const isSelected = (filters.generalServices || []).includes(facility.id);
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ generalServices: isSelected ? (filters.generalServices || []).filter(id => id !== facility.id) : [...(filters.generalServices || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`facility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 7. Өрөөний тохижилт — Room facilities */}
          {roomFacilitiesData.length > 0 && (
            <CollapsibleFilterSection
              title='Өрөөний тохижилт'
              itemCount={roomFacilitiesData.length}
              initialShowCount={10}
              selectedCount={(filters.roomFacilities || []).length}
              onClear={() => updateFilters({ roomFacilities: [] })}
              usePanel
            >
              {roomFacilitiesData.map((facility) => {
                const isSelected = (filters.roomFacilities || []).includes(facility.id);
                const count = filterCounts[`roomFac_${facility.id}`];
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ roomFacilities: isSelected ? (filters.roomFacilities || []).filter(id => id !== facility.id) : [...(filters.roomFacilities || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {count !== undefined && count > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 8. Буудлын хүртээмж */}
          {accessibilityFacilities.length > 0 && (
            <CollapsibleFilterSection
              title='Буудлын хүртээмж'
              itemCount={accessibilityFacilities.length}
              initialShowCount={10}
              selectedCount={(filters.accessibilityFeatures || []).length}
              onClear={() => updateFilters({ accessibilityFeatures: [] })}
              usePanel
            >
              {accessibilityFacilities.map((facility) => {
                const isSelected = (filters.accessibilityFeatures || []).includes(facility.id);
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ accessibilityFeatures: isSelected ? (filters.accessibilityFeatures || []).filter(id => id !== facility.id) : [...(filters.accessibilityFeatures || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`accessibility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`accessibility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 9. Орны төрөл */}
          {bedTypeFacilities.length > 0 && (
            <CollapsibleFilterSection
              title='Орны төрөл'
              itemCount={bedTypeFacilities.length}
              initialShowCount={5}
              selectedCount={(filters.bedTypes || []).length}
              onClear={() => updateFilters({ bedTypes: [] })}
              usePanel
            >
              {bedTypeFacilities.map((bt) => {
                const isSelected = (filters.bedTypes || []).includes(bt.id);
                return (
                  <label key={bt.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ bedTypes: isSelected ? (filters.bedTypes || []).filter(id => id !== bt.id) : [...(filters.bedTypes || []), bt.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{bt.name}</span>
                    {filterCounts[`bedType_${bt.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`bedType_${bt.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 10. Ойролцоох байршлууд */}
          {neighbourhoodOptions.length > 0 && (
            <CollapsibleFilterSection
              title='Ойролцоох байршлууд'
              itemCount={neighbourhoodOptions.length}
              initialShowCount={5}
              selectedCount={(filters.neighbourhood || []).length}
              onClear={() => updateFilters({ neighbourhood: [] })}
            >
              {neighbourhoodOptions.map(({ name, count }) => {
                const isSelected = (filters.neighbourhood || []).includes(name);
                return (
                  <label key={name} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ neighbourhood: isSelected ? (filters.neighbourhood || []).filter(n => n !== name) : [...(filters.neighbourhood || []), name] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 11. Үзвэр үзэсгэлэнт газрууд */}
          {landmarkCounts.length > 0 && (
            <CollapsibleFilterSection
              title='Үзвэр үзэсгэлэнт газрууд'
              itemCount={landmarkCounts.length}
              initialShowCount={5}
              selectedCount={(filters.landmark || []).length}
              onClear={() => updateFilters({ landmark: [] })}
            >
              {landmarkCounts.map(({ id, name_mn, count }) => {
                const isSelected = (filters.landmark || []).includes(id);
                return (
                  <label key={id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ landmark: isSelected ? (filters.landmark || []).filter(l => l !== id) : [...(filters.landmark || []), id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{name_mn}</span>
                    {count > 0 && <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {/* 12. Хөнгөлөлт */}
          {discountedCount > 0 && (
            <div className="space-y-2 border-b border-gray-200 dark:border-gray-600 pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.discounted}
                  onChange={(e) => updateFilters({ discounted: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1">Хөнгөлөлт</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({discountedCount})</span>
              </label>
            </div>
          )}

          {/* 13. Буудлын зэрэглэл */}
          {apiData?.ratings && apiData.ratings.length > 0 && (
            <div className="space-y-1.5 border-b border-gray-200 dark:border-gray-600 pb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Буудлын зэрэглэл</h4>
              {apiData.ratings.filter(r => r.rating !== 'N/A').map((rating) => {
                const stars = parseInt(rating.rating.match(/\d+/)?.[0] || '0');
                if (stars === 0) return null;
                const isSelected = (filters.starRating || []).includes(stars);
                const count = filterCounts[`rating_${stars}`];
                return (
                  <label key={rating.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ starRating: isSelected ? (filters.starRating || []).filter(s => s !== stars) : [...(filters.starRating || []), stars] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 flex items-center gap-1">
                      {stars}
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    </span>
                    {count !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {/* 14. Зочдын үнэлгээ — placeholder */}
          {/* TODO: implement guest rating filter when API supports it */}

          {/* 15. Нэмэлт төлбөртэй үйлчилгээ */}
          {outdoorFacilities.length > 0 && (
            <CollapsibleFilterSection
              title='Нэмэлт төлбөртэй үйлчилгээ'
              itemCount={outdoorFacilities.length}
              initialShowCount={10}
              selectedCount={(filters.outdoorAreas || []).length}
              onClear={() => updateFilters({ outdoorAreas: [] })}
              usePanel
            >
              {outdoorFacilities.map((facility) => {
                const isSelected = (filters.outdoorAreas || []).includes(facility.id);
                return (
                  <label key={facility.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateFilters({ outdoorAreas: isSelected ? (filters.outdoorAreas || []).filter(id => id !== facility.id) : [...(filters.outdoorAreas || []), facility.id] })}
                      className="w-4 h-4 rounded border-gray-600 dark:border-gray-500 text-primary-600 focus:ring-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{facility.name_mn}</span>
                    {filterCounts[`facility_${facility.id}`] !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({filterCounts[`facility_${facility.id}`]})</span>
                    )}
                  </label>
                );
              })}
            </CollapsibleFilterSection>
          )}

          {loadingApi && (
            <div className="text-xs text-gray-500 dark:text-gray-400 py-2">{t('search.filtersSection.loading')}</div>
          )}
        </div>
      </>
    );
  }

  // Mobile modal version
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/25" onClick={onClose} />
        <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 font-semibold text-gray-900 dark:text-white">{t('search.filtersSection.title')}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mobile filter view — use desktop sidebar for full filters.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
