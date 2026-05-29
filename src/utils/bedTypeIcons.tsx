'use client';

import React from 'react';
import { BedDouble, BedSingle, Sofa } from 'lucide-react';
import { FaBedPulse, FaMattressPillow } from 'react-icons/fa6';
import { GiBunkBeds } from 'react-icons/gi';

// ─────────────────────────────────────────────────────────────────────────────
// Icon + SIZE strategy — size conveys bed width:
//
//   BedSingle (lucide) → single      base size
//   BedSingle × 2     → twin        each icon 2 steps smaller + gap-px  ≈ 1.5× total
//   FaMattressPillow  → semi-double  base size
//   BedDouble (lucide) → double      base size
//   BedDouble          → queen       +1 step larger
//   BedDouble          → king        +2 steps larger
//   BedDouble          → super king  +3 steps larger (biggest)
//   GiBunkBeds         → triple
//   Sofa               → sofa bed
//   FaBedPulse         → extra bed
// ─────────────────────────────────────────────────────────────────────────────

// Tailwind size ladder used for scaling icons up/down
// Fine-grained steps above base so queen/king are only subtly bigger than double
const TAILWIND_SIZES = ['3', '3.5', '4', '[17px]', '[19px]', '5', '6', '7', '8'];
// Base = index 2 ('4'=16px) → +1=[17px], +2=[19px], +3=20px, -1=14px, -2=12px

function scaleSize(val: string, steps: number): string {
  const idx = TAILWIND_SIZES.indexOf(val);
  if (idx === -1) return val;
  const newIdx = Math.max(0, Math.min(TAILWIND_SIZES.length - 1, idx + steps));
  return TAILWIND_SIZES[newIdx];
}

export interface BedTypeInfo {
  descriptionMn: string;
  descriptionEn: string;
}

type IconComponent = React.ComponentType<{ className?: string }>;

interface BedEntry {
  Icon: IconComponent;
  count: number;
  sizeScale: number; // steps relative to caller's base class: -n=smaller, 0=normal, +n=larger
  gap: string;       // Tailwind gap class (only applies when count > 1)
  info: BedTypeInfo;
}

const BED_MAP: Array<{ keys: string[]; entry: BedEntry }> = [
  {
    keys: ['twin / double', 'twin/double'],
    entry: {
      Icon: BedDouble,
      count: 1,
      sizeScale: 0,
      gap: 'gap-0.5',
      info: { descriptionMn: '2 өргөндүү ор', descriptionEn: 'twin or double bed' },
    },
  },
  {
    keys: ['triple'],
    entry: {
      Icon: GiBunkBeds as IconComponent,
      count: 1,
      sizeScale: 0,
      gap: 'gap-0.5',
      info: { descriptionMn: '3 нарийн ор', descriptionEn: '3 single beds' },
    },
  },
  {
    keys: ['semi double', 'semi-double', 'semidouble'],
    entry: {
      Icon: FaMattressPillow as IconComponent,
      count: 1,
      sizeScale: 0,
      gap: 'gap-0.5',
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
      sizeScale: +3, // largest — clearly premium
      gap: 'gap-0.5',
      info: { descriptionMn: '1 хамгийн өргөн ор', descriptionEn: '1 super king bed' },
    },
  },
  {
    keys: ['king'],
    entry: {
      Icon: BedDouble,
      count: 1,
      sizeScale: +0.25, // noticeably bigger than queen
      gap: 'gap-0.5',
      info: { descriptionMn: '1 их өргөн ор', descriptionEn: '1 king bed' },
    },
  },
  {
    keys: ['queen'],
    entry: {
      Icon: BedDouble,
      count: 1,
      sizeScale: +0.25, // slightly bigger than double
      gap: 'gap-0.5',
      info: { descriptionMn: '1 өргөн ор', descriptionEn: '1 queen bed' },
    },
  },
  {
    keys: ['double'],
    entry: {
      Icon: BedDouble,
      count: 1,
      sizeScale: 0, // base size
      gap: 'gap-0.5',
      info: { descriptionMn: '2 өргөндүү ор', descriptionEn: 'double bed' },
    },
  },
  {
    keys: ['twin'],
    entry: {
      Icon: BedSingle,
      count: 2,
      sizeScale: -1,    // each icon 2 steps smaller → two together ≈ 1.5× base
      gap: 'gap-0',     // no gap — as close as possible
      info: { descriptionMn: '2 нарийн ор', descriptionEn: '2 single beds' },
    },
  },
  {
    keys: ['single'],
    entry: {
      Icon: BedSingle,
      count: 1,
      sizeScale: 0, // base size — narrow, clearly one person
      gap: 'gap-0.5',
      info: { descriptionMn: '1 нарийн ор', descriptionEn: '1 single bed' },
    },
  },
  {
    keys: ['sofa'],
    entry: {
      Icon: Sofa,
      count: 1,
      sizeScale: 0,
      gap: 'gap-0.5',
      info: { descriptionMn: 'диван ор', descriptionEn: 'sofa bed' },
    },
  },
  {
    keys: ['extra'],
    entry: {
      Icon: FaBedPulse as IconComponent,
      count: 1,
      sizeScale: 0,
      gap: 'gap-0.5',
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

export function BedTypeIcon({
  name,
  className = 'w-4 h-4',
}: {
  name: string;
  className?: string;
}) {
  const entry = resolveEntry(name);
  const Icon = entry?.Icon ?? (BedSingle as IconComponent);
  const count = entry?.count ?? 1;
  const sizeScale = entry?.sizeScale ?? 0;
  const gap = entry?.gap ?? 'gap-0.5';

  // Parse caller-supplied size from className
  const parts = className.split(' ');
  const hPart = parts.find((c) => /^h-[\d.]+$/.test(c)) ?? 'h-4';
  const wPart = parts.find((c) => /^w-[\d.]+$/.test(c)) ?? 'w-4';
  const hVal = hPart.slice(2); // strip 'h-'
  const wVal = wPart.slice(2); // strip 'w-'
  const otherParts = parts.filter((c) => !/^[wh]-[\d.]+$/.test(c)).join(' ');

  const scaledH = `h-${scaleSize(hVal, sizeScale)}`;
  const scaledW = `w-${scaleSize(wVal, sizeScale)}`;

  if (count === 1) {
    return <Icon className={`${scaledW} ${scaledH} ${otherParts}`.trim()} />;
  }

  // Multi-icon (twin): render count icons scaled + tightly packed
  return (
    <span className={`inline-flex items-center ${gap} ${otherParts}`.trim()}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} className={`${scaledW} ${scaledH}`} />
      ))}
    </span>
  );
}

export function getBedTypeInfo(name: string): BedTypeInfo {
  const entry = resolveEntry(name);
  return entry?.info ?? { descriptionMn: name, descriptionEn: name };
}
