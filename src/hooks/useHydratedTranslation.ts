import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useHydratedTranslation() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeT = (key: string, fallback?: string) => {
    if (!mounted) {
      return fallback || key.split('.').pop() || key;
    }
    
    const translation = t(key);
    // If translation returns the same as the key, it means translation not found
    if (translation === key && fallback) {
      return fallback;
    }
    return translation;
  };

  return {
    t: safeT,
    i18n,
    mounted
  };
}