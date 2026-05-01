'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGrid, PackagePlus, Bike, HandHelping, Check, ChevronDown, X } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import type { CombinedData, HotelFacility } from '@/types/api';

const PREVIEW_COUNT = 10;

interface HotelAmenitiesProps {
  generalFacilities?: HotelFacility[];
  additionalFacilities?: HotelFacility[];
  activities?: HotelFacility[];
  accessibilityFeatures?: HotelFacility[];
  /** @deprecated use generalFacilities */
  facilities?: HotelFacility[];
  /** @deprecated use generalFacilities */
  amenities?: HotelFacility[];
}

type ApiFacility = { id: number; name_en: string; name_mn: string };

type GroupKey = 'general' | 'additional' | 'activities' | 'accessibility';

type Group = {
  key: GroupKey;
  title: string;
  Icon: React.ElementType;
  items: { label: string; isHighlight: boolean }[];
};

function resolveItem(
  facility: HotelFacility,
  locale: 'en' | 'mn',
  canonical: Map<number, ApiFacility>
): { id: number | null; label: string; isHighlight: boolean } {
  if (typeof facility === 'string') {
    return { id: null, label: facility, isHighlight: false };
  }
  if (facility && typeof facility === 'object') {
    const id = typeof facility.id === 'number' ? facility.id : null;
    const isHighlight = facility.is_highlight === true;
    let label =
      (locale === 'mn' ? facility.name_mn : facility.name_en) ||
      facility.name_en ||
      facility.name_mn ||
      '';
    if (id !== null && canonical.has(id)) {
      const c = canonical.get(id)!;
      label = locale === 'mn' ? c.name_mn || label : c.name_en || label;
    }
    return { id, label, isHighlight };
  }
  return { id: null, label: '', isHighlight: false };
}

export default function HotelAmenities({
  generalFacilities,
  additionalFacilities,
  activities,
  accessibilityFeatures,
  facilities,
  amenities,
}: HotelAmenitiesProps) {
  const { t, i18n } = useHydratedTranslation();
  const locale: 'en' | 'mn' = i18n?.language?.startsWith('en') ? 'en' : 'mn';
  const [combined, setCombined] = useState<CombinedData | null>(null);
  const [openPanel, setOpenPanel] = useState<GroupKey | null>(null);
  // openPanel is used as a boolean: non-null = panel open
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    ApiService.getCombinedData()
      .then((data) => { if (!cancelled) setCombined(data); })
      .catch(() => { /* ignore — fall back to whatever names the hotel object has */ });
    return () => { cancelled = true; };
  }, []);

  const sources = useMemo(() => ({
    general: generalFacilities ?? facilities ?? amenities ?? [],
    additional: additionalFacilities ?? [],
    activities: activities ?? [],
    accessibility: accessibilityFeatures ?? [],
  }), [generalFacilities, additionalFacilities, activities, accessibilityFeatures, facilities, amenities]);

  const groups = useMemo<Group[]>(() => {
    const canonicalMaps: Record<GroupKey, Map<number, ApiFacility>> = {
      general: new Map(),
      additional: new Map(),
      activities: new Map(),
      accessibility: new Map(),
    };
    if (combined) {
      (combined.facilities || []).forEach(f => canonicalMaps.general.set(f.id, f));
      (combined.additionalFacilities || []).forEach(f => canonicalMaps.additional.set(f.id, f));
      (combined.activities || []).forEach(f => canonicalMaps.activities.set(f.id, f));
      (combined.accessibility_features || []).forEach(f => canonicalMaps.accessibility.set(f.id, f));
    }

    const groupDefs: Group[] = [
      { key: 'general',       title: t('hotelDetails.facilityGroups.general',       'Ерөнхий байгууламж'), Icon: LayoutGrid,   items: [] },
      { key: 'additional',    title: t('hotelDetails.facilityGroups.additional',    'Нэмэлт байгууламж'),  Icon: PackagePlus,  items: [] },
      { key: 'activities',    title: t('hotelDetails.facilityGroups.activities',    'Үйл ажиллагаа'),      Icon: Bike,         items: [] },
      { key: 'accessibility', title: t('hotelDetails.facilityGroups.accessibility', 'Хүртээмжтэй өрөө'),   Icon: HandHelping,  items: [] },
    ];

    for (const g of groupDefs) {
      const seen = new Set<string>();
      for (const fac of sources[g.key]) {
        const { id, label } = resolveItem(fac, locale, canonicalMaps[g.key]);
        if (!label) continue;
        const dedupeKey = id !== null ? `id:${id}` : `nm:${label.toLowerCase()}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        g.items.push({ label, isHighlight: false });
      }
    }

    return groupDefs.filter(g => g.items.length > 0);
  }, [sources, combined, locale, t]);

  const totalCount = groups.reduce((acc, g) => acc + g.items.length, 0);
  if (totalCount === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t('hotel.noAmenities', 'Мэдээлэл байхгүй байна')}
        </p>
      </div>
    );
  }

  const hasMore = groups.some(g => g.items.length > PREVIEW_COUNT);

  return (
    <div className="bg-white dark:bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">
        {groups.map(({ key, title, Icon, items }) => (
          <div key={key}>
            <div className="flex items-center gap-2.5 mb-3">
              <Icon className="w-4 h-4 text-gray-700 dark:text-gray-400 shrink-0" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">({items.length})</span>
            </div>
            <ul className="space-y-2 pl-0">
              {items.slice(0, PREVIEW_COUNT).map((item, index) => (
                <li
                  key={`${key}-${index}`}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Single global "see all" button */}
      {hasMore && (
        <button
          onClick={() => setOpenPanel('general')}
          className="mt-5 flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Бүгдийг харах ({totalCount})
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Right-side panel — all groups in one scrollable drawer */}
      {openPanel && mounted && createPortal(
        <div className="fixed inset-0 z-200 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenPanel(null)}
          />
          <div className="relative w-[780px] max-w-[95vw] bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Тохижилт</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{totalCount} нийт зүйл</p>
              </div>
              <button
                onClick={() => setOpenPanel(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Grid layout — all groups side by side */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {groups.map(({ key, title, Icon, items }) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0" />
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {title}
                        <span className="ml-1 text-sm font-normal text-gray-400">({items.length})</span>
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setOpenPanel(null)}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
