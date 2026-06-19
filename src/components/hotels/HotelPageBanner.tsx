'use client';

import { useMotionValue, useMotionTemplate, motion } from 'framer-motion';
import { useState } from 'react';
import SearchHeader from '@/components/search/SearchHeader';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

export default function HotelPageBanner() {
  const bannerMouseX = useMotionValue(0);
  const bannerMouseY = useMotionValue(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const bannerMask = useMotionTemplate`radial-gradient(420px circle at ${bannerMouseX}px ${bannerMouseY}px, white, transparent 80%)`;

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        bannerMouseX.set(e.clientX - rect.left);
        bannerMouseY.set(e.clientY - rect.top);
      }}
      onMouseEnter={() => setIsBannerHovered(true)}
      onMouseLeave={() => setIsBannerHovered(false)}
      className="relative w-full overflow-hidden py-6 group/banner"
      style={{ backgroundColor: 'var(--color-navy)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          mixBlendMode: 'overlay',
          opacity: 0.55,
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)' }} />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/banner:opacity-100"
        style={{ maskImage: bannerMask }}
      >
        {isBannerHovered && (
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent"
            colors={[[99, 102, 241], [139, 92, 246]]}
            dotSize={3}
            showGradient={false}
          />
        )}
      </motion.div>
      <SearchHeader disableSticky noBackground />
    </div>
  );
}
