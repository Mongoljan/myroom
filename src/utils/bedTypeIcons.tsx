'use client';

import React from 'react';
import { BedDouble, BedSingle, Sofa } from 'lucide-react';
import { FaBedPulse, FaMattressPillow } from 'react-icons/fa6';
import { MdSingleBed, MdKingBed } from 'react-icons/md';
import { RiHotelBedFill } from 'react-icons/ri';
import { GiBunkBeds, GiPersonInBed } from 'react-icons/gi';

// ─────────────────────────────────────────────────────────────────────────────
// Each bed tier uses a visually distinct icon from a different library:
//
//   MdSingleBed       → single  (simple narrow bed outline)
//   BedSingle ×2      → twin    (2 narrow lucide beds)
//   FaMattressPillow  → semi-double (mattress+pillow silhouette, unique shape)
//   BedDouble         → double  (lucide wide bed with center rail)
//   MdKingBed         → queen   (Material wider bed, distinct from BedDouble)
//   RiHotelBedFill    → king    (Remix bold filled hotel bed)
//   GiPersonInBed     → super king (person lying on a bed, unmistakably luxury)
//   GiBunkBeds        → triple  (bunk bed = 3-bed feel)
//   Sofa              → sofa bed
//   FaBedPulse        → extra bed
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

const BED_MAP: Array<{ keys: string[]; entry: BedEntry }> = [
  {
    keys: ['twin / double', 'twin/double'],
    entry: {
      Icon: BedDouble,
      count: 1,
      info: { descriptionMn: '2 өргөндүү ор', descriptionEn: 'twin or double bed' },
    },
  },
  {
    keys: ['triple'],
    entry: {
      Icon: GiBunkBeds as IconComponent,
      count: 1,
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
      Icon: GiPersonInBed as IconComponent,
      count: 1,
      info: { descriptionMn: '1 хамгийн өргөн ор', descriptionEn: '1 super king bed' },
    },
  },
  {
    keys: ['king'],
    entry: {
      Icon: RiHotelBedFill as IconComponent,
      count: 1,
      info: { descriptionMn: '1 нилээн өргөн ор', descriptionEn: '1 king bed' },
    },
  },
  {
    keys: ['queen'],
    entry: {
      Icon: MdKingBed as IconComponent,
      count: 1,
      info: { descriptionMn: '1 өргөн ор', descriptionEn: '1 queen bed' },
    },
  },
  {
    keys: ['double'],
    entry: {
      Icon: BedDouble,
      count: 1,
      info: { descriptionMn: '2 өргөндүү ор', descriptionEn: 'double bed' },
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

export function BedTypeIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: string;
  className?: string;
}) {
  const entry = resolveEntry(name);
  const Icon = entry?.Icon ?? MdSingleBed as IconComponent;
  const count = entry?.count ?? 1;

  if (count === 1) {
    return <Icon className={className} />;
  }

  // Twin: render 2 BedSingle icons side-by-side
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

export function getBedTypeInfo(name: string): BedTypeInfo {
  const entry = resolveEntry(name);
  return entry?.info ?? { descriptionMn: name, descriptionEn: name };
}
