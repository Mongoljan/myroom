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
    return t(key);
  };

  return {
    t: safeT,
    i18n,
    mounted
  };
}