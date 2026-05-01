'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Thin top-bar progress indicator that appears on every route transition.
 * No external deps — uses CSS animations only.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    // Clear any existing animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Start progress
    setProgress(0);
    setVisible(true);

    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      // Fast climb to 80% in 400ms, then slow to ~90% by 2s
      const p = elapsed < 400
        ? (elapsed / 400) * 80
        : Math.min(90, 80 + ((elapsed - 400) / 1600) * 10);
      setProgress(p);
      if (p < 90) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname, searchParams]);

  // Complete the bar when the new page content mounts (this effect runs after paint)
  useEffect(() => {
    if (!mountedRef.current) return;

    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
    >
      <div
        className="h-full bg-blue-500 origin-left"
        style={{
          width: `${progress}%`,
          transition: progress === 100
            ? 'width 150ms ease-out, opacity 150ms ease-out 150ms'
            : 'width 80ms linear',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
