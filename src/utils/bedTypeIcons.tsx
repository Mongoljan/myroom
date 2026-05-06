'use client';

import React from 'react';
import { BedDouble, BedSingle, Sofa } from 'lucide-react';
import { FaBedPulse, FaMattressPillow } from 'react-icons/fa6';

// ─────────────────────────────────────────────────────────────────────────────
// Uses real icon library icons (lucide-react + react-icons/fa6).
//
// Visual strategy:
//   BedSingle  ×1 → single, semi-double*
//   BedSingle  ×2 → twin     (2 нарийн)
//   BedSingle  ×3 → triple   (3 нарийн)
//   BedDouble  ×1 → queen / king / super king (1 wide bed with center divider)
//   BedDouble  ×2 → double   (2 өргөндүү)
//   FaMattressPillow → semi-double (unique icon, different from BedSingle)
//   Sofa       ×1 → sofa bed
//   FaBedPulse ×1 → extra bed
// ─────────────────────────────────────────────────────────────────────────────

export interface BedTypeInfo {
  descriptionMn: string;
  descriptionEn: string;
}

type IconComponent = React.ComponentType<{ className?: string }>;

interface BedEntry {
  Icon: IconComponent;
  count: number;
  info: BedTypeInfo;
}

// Ordered longest-key-first to avoid partial mismatches
const BED_MAP: Array<{ keys: string[]; entry: BedEntry }> = [
  {
    keys: ['twin / double', 'twin/double'],
    entry: {
      Icon: BedDouble,
      count: 2,
      info: { descriptionMn: '2 өргөндүү ор', descriptionEn: 'twin or double beds' },
    },
  },
  {
    keys: ['triple'],
    entry: {
      Icon: BedSingle,
      count: 3,
      info: { descriptionMn: '3 нарийн ор', descriptionEn: '3 single beds' },
    },
  },
  {
    keys: ['semi double', 'semi-double', 'semidouble'],
    entry: {
      Icon: FaMattressPillow as IconComponent,
      count: 1,
      info: {
        descriptionMn: 'дундаж урттай хагас өргөн ор (хүүхэдтэй хүн унтах боломжтой)',
        descriptionEn: 'semi-double bed',
      },
    },
  },
  {
    keys: ['super king'],
    entry: {
      Icon: BedDouble,
      count: 1,
      info: { descriptionMn: '1 хамгийн өргөн ор', descriptionEn: '1 super king bed' },
    },
  },
  {
    keys: ['king'],
    entry: {
      Icon: BedDouble,
      count: 1,
      info: { descriptionMn: '1 нилээн өргөн ор', descriptionEn: '1 king bed' },
    },
  },
  {
    keys: ['queen'],
    entry: {
      Icon: BedDouble,
      count: 1,
      info: { descriptionMn: '1 өргөн ор', descriptionEn: '1 queen bed' },
    },
  },
  {
    keys: ['double'],
    entry: {
      Icon: BedDouble,
      count: 2,
      info: { descriptionMn: '2 өргөндүү ор', descriptionEn: '2 wide beds' },
    },
  },
  {
    keys: ['twin'],
    entry: {
      Icon: BedSingle,
      count: 2,
      info: { descriptionMn: '2 нарийн ор', descriptionEn: '2 single beds' },
    },
  },
  {
    keys: ['single'],
    entry: {
      Icon: BedSingle,
      count: 1,
      info: { descriptionMn: '1 нарийн ор', descriptionEn: '1 single bed' },
    },
  },
  {
    keys: ['sofa'],
    entry: {
      Icon: Sofa,
      count: 1,
      info: { descriptionMn: 'диван ор', descriptionEn: 'sofa bed' },
    },
  },
  {
    keys: ['extra'],
    entry: {
      Icon: FaBedPulse as IconComponent,
      count: 1,
      info: { descriptionMn: 'нэмэлт ор', descriptionEn: 'extra bed' },
    },
  },
];

function resolveEntry(name: string): BedEntry | null {
  const lower = name.toLowerCase().trim();
  for (const { keys, entry } of BED_MAP) {
    if (keys.some((k) => lower === k || lower.includes(k))) return entry;
  }
  return null;
}

/**
 * Renders the correct bed icon(s) for a given bed type name.
 * Accepts any Tailwind className for sizing and color.
 *
 * Multi-bed types (twin, double, triple) render 2–3 icons side-by-side
 * so the count is immediately visible.
 */
export function BedTypeIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: string;
  className?: string;
}) {
  const entry = resolveEntry(name);
  const Icon = entry?.Icon ?? BedSingle;
  const count = entry?.count ?? 1;

  if (count === 1) {
    return <Icon className={className} />;
  }

  // Multi-bed: render count icons side-by-side.
  // Extract the h-* class so sub-icons match the intended height; make them square.
  const parts = className.split(' ');
  const hPart = parts.find((c) => /^h-[\d.]+$/.test(c)) ?? 'h-5';
  const wPart = hPart.replace('h-', 'w-');
  const otherParts = parts.filter((c) => !/^[wh]-[\d.]+$/.test(c)).join(' ');

  return (
    <span className={`inline-flex items-center gap-0.5 ${otherParts}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} className={`${hPart} ${wPart}`} />
      ))}
    </span>
  );
}

/** Returns the Mongolian / English description for a bed type name. */
export function getBedTypeInfo(name: string): BedTypeInfo {
  const entry = resolveEntry(name);
  return entry?.info ?? { descriptionMn: name, descriptionEn: name };
}
