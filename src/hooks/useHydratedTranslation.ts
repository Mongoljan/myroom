// src/hooks/useHydratedTranslation.ts

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TOptions, TFunction } from 'i18next';

// Define a generic type for the object returned by tAny
type TFunctionResult = string | unknown[] | object | undefined;

/**
 * A more powerful translation function that can return strings, arrays, or objects.
 * It uses function overloads to provide correct return types based on the options.
 */
function useTAny(rawT: TFunction, mounted: boolean) {
  // --- Function Overloads for Type Safety ---
  // 1. Simple key, returns a string
  function tAny(key: string): string;
  // 2. Key with options, can return a string, array, or object
  function tAny(key: string, options: TOptions): TFunctionResult;
  // 3. Key with options and a generic for the expected return type
  function tAny<T = unknown>(key: string, options: TOptions & { returnObjects: true }): T;
  // 4. Implementation
  function tAny(
    key: string,
    options?: TOptions & { returnObjects?: boolean }
  ): unknown {
    if (!mounted) {
      // During SSR/hydration, return the last segment of the key as a fallback.
      // For objects/arrays, this is less useful, but it's a safe default.
      return key.split('.').pop() || key;
    }

    // If options are provided, pass them to rawT. This includes `returnObjects: true`.
    return options ? rawT(key, options) : rawT(key);
  }

  return tAny;
}


export function useHydratedTranslation() {
  const { t: rawT, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The original safeT function, now clearly typed to only return strings.
  const safeT = (key: string, optionsOrFallback?: string | TOptions, maybeFallback?: string): string => {
    if (!mounted) {
      const fallbackVal = typeof optionsOrFallback === 'string' ? optionsOrFallback : maybeFallback;
      return (fallbackVal || key.split('.').pop() || key) as string;
    }

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

  // Create the new, more powerful t function
  const tAny = useTAny(rawT, mounted);

  return {
    t: safeT, // Keep the old 't' for backward compatibility
    tAny,     // Export the new 'tAny' for arrays and objects
    i18n,
    mounted
  };
}