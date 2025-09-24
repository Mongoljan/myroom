import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TOptions } from 'i18next';

export function useHydratedTranslation() {
  const { t: rawT, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Backward-compatible t: accepts either (key, fallback) or (key, options)
  const safeT = (key: string, optionsOrFallback?: string | TOptions, maybeFallback?: string): string => {
    if (!mounted) {
      // During SSR/hydration, return fallback if provided, otherwise last segment of key
      const fallbackVal = typeof optionsOrFallback === 'string' ? optionsOrFallback : maybeFallback;
      return (fallbackVal || key.split('.').pop() || key) as string;
    }

    // If second argument is a string, treat as fallback. If it's an object, treat as i18n options
    if (typeof optionsOrFallback === 'string') {
      const res = rawT(key) as string;
      return res === key ? (optionsOrFallback as string) : res;
    }

    const res = (optionsOrFallback ? rawT(key, optionsOrFallback) : rawT(key)) as string;
    if (res === key && typeof maybeFallback === 'string') {
      return maybeFallback;
    }
    return res as string;
  };

  return {
    t: safeT,
    i18n,
    mounted
  };
}