'use client';

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTheme(newTheme: Theme) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(newTheme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Read from DOM class applied by the inline script (set before React hydrates)
    if (typeof window !== 'undefined') {
      if (document.documentElement.classList.contains('dark')) return 'dark';
      if (document.documentElement.classList.contains('light')) return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Sync DOM on mount in case localStorage differs from inline-script guess
    try {
      const saved = localStorage.getItem('theme') as Theme | null;
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const resolved = saved ?? system;
      if (resolved !== theme) {
        setThemeState(resolved);
      }
      applyTheme(resolved);
    } catch {
      // ignore storage errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}