/**
 * MyRoom Theme Configuration
 *
 * 🎨 EASY TO ADJUST: Change colors here and it will update across the entire app
 *
 * Current Brand: Teal (Modern, Fresh, Trust)
 *
 * To change the brand color:
 * 1. Update the 'primary' object below with your new color palette
 * 2. That's it! All components will automatically use the new colors
 */

export const theme = {
  // 🎨 PRIMARY BRAND COLOR - TEAL
  // Change these values to update the entire brand color
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',  // Main brand color
      600: '#0d9488',  // Buttons, CTAs, Active states
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },

    // Accent color (can be changed independently)
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',  // Amber - warmth, highlights
      600: '#d97706',
    },

    // Success, Warning, Error (stable colors)
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },

    // Neutral colors (grays)
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },

  // Typography (Tailwind compatible)
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'monospace'],
    },
  },

  // Spacing (matches Tailwind)
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border radius
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

// Helper function to get Tailwind-compatible color classes
export const getColorClass = (variant: 'primary' | 'accent' | 'neutral' = 'primary', shade: number = 600) => {
  const colorMap = {
    primary: 'teal',
    accent: 'amber',
    neutral: 'gray',
  };

  return colorMap[variant];
};

// Tailwind color configuration (for tailwind.config.js)
export const tailwindColors = {
  primary: theme.colors.primary,
  accent: theme.colors.accent,
};

export default theme;
