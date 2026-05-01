'use client';

import { useEffect, useMemo, useState } from 'react';
import { Gem, LayoutGrid, PackagePlus, Bike, HandHelping, Check } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import type { CombinedData, HotelFacility } from '@/types/api';

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

  return (
    <div className="bg-white dark:bg-transparent space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">
        {groups.map(({ key, title, Icon, items }) => (
          <div key={key}>
            <div className="flex items-center gap-2.5 mb-3">
              <Icon className="w-4 h-4 text-gray-700 dark:text-gray-400 shrink-0" />
              <h4 className="text-[15px] font-semibold text-gray-900 dark:text-white">{title}</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">({items.length})</span>
            </div>
            <ul className="space-y-2 pl-0">
              {items.map((item, index) => (
                <li
                  key={`${key}-${index}`}
                  className="flex items-start gap-2 text-[14px] text-gray-700 dark:text-gray-300"
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
  );
}
