/**
 * MyRoom Design System
 * Centralized design tokens for consistent UI/UX across the application
 * Inspired by modern minimalist aesthetics (Wave.co, Linear, Stripe)
 */

export const DESIGN_SYSTEM = {
  // ============================================
  // COLORS
  // ============================================
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main brand color
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Secondary Accent Colors
    secondary: {
      violet: {
        500: '#8b5cf6',
        600: '#7c3aed',
      },
      purple: {
        500: '#a855f7',
        600: '#9333ea',
      },
      pink: {
        500: '#ec4899',
        600: '#db2777',
      },
    },

    // Neutral Grays
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
    },

    // Semantic Colors
    semantic: {
      success: {
        light: '#d1fae5',
        DEFAULT: '#10b981',
        dark: '#047857',
      },
      warning: {
        light: '#fef3c7',
        DEFAULT: '#f59e0b',
        dark: '#d97706',
      },
      error: {
        light: '#fee2e2',
        DEFAULT: '#ef4444',
        dark: '#dc2626',
      },
      info: {
        light: '#dbeafe',
        DEFAULT: '#3b82f6',
        dark: '#1d4ed8',
      },
    },

    // Background & Surface
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Text Colors
    text: {
      primary: '#111827',      // Dark titles, headings
      secondary: '#4b5563',    // Body text
      tertiary: '#6b7280',     // Muted text, captions
      disabled: '#9ca3af',     // Disabled state
      inverse: '#ffffff',      // Text on dark backgrounds
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Font Families
    fontFamily: {
      sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },

    // Font Sizes & Line Heights (Mobile-first, responsive)
    scale: {
      // Display - Hero sections, landing pages
      display: {
        large: {
          size: 'text-4xl sm:text-5xl lg:text-6xl',    // 36px -> 48px -> 60px
          lineHeight: 'leading-tight',                   // 1.25
          weight: 'font-bold',
          letterSpacing: 'tracking-tight',
        },
        medium: {
          size: 'text-3xl sm:text-4xl lg:text-5xl',    // 30px -> 36px -> 48px
          lineHeight: 'leading-tight',
          weight: 'font-bold',
          letterSpacing: 'tracking-tight',
        },
        small: {
          size: 'text-2xl sm:text-3xl lg:text-4xl',    // 24px -> 30px -> 36px
          lineHeight: 'leading-tight',
          weight: 'font-bold',
          letterSpacing: 'tracking-tight',
        },
      },

      // Headings - Section titles, card headers
      heading: {
        h1: {
          size: 'text-2xl sm:text-3xl',                 // 24px -> 30px
          lineHeight: 'leading-tight',
          weight: 'font-bold',
          letterSpacing: 'tracking-tight',
        },
        h2: {
          size: 'text-xl sm:text-2xl',                  // 20px -> 24px
          lineHeight: 'leading-snug',
          weight: 'font-bold',
          letterSpacing: 'tracking-tight',
        },
        h3: {
          size: 'text-lg sm:text-xl',                   // 18px -> 20px
          lineHeight: 'leading-snug',
          weight: 'font-semibold',
        },
        h4: {
          size: 'text-base sm:text-lg',                 // 16px -> 18px
          lineHeight: 'leading-normal',
          weight: 'font-semibold',
        },
      },

      // Body - Paragraphs, descriptions
      body: {
        large: {
          size: 'text-lg',                              // 18px
          lineHeight: 'leading-relaxed',                // 1.625
          weight: 'font-normal',
        },
        medium: {
          size: 'text-base',                            // 16px
          lineHeight: 'leading-relaxed',
          weight: 'font-normal',
        },
        small: {
          size: 'text-sm',                              // 14px
          lineHeight: 'leading-relaxed',
          weight: 'font-normal',
        },
      },

      // UI Elements - Buttons, labels, badges
      ui: {
        button: {
          large: 'text-base font-medium',
          medium: 'text-sm font-medium',
          small: 'text-xs font-medium',
        },
        label: {
          size: 'text-xs',
          weight: 'font-medium',
          transform: 'uppercase',
          letterSpacing: 'tracking-wider',
        },
        badge: {
          size: 'text-xs',
          weight: 'font-medium',
        },
      },

      // Captions & Meta
      caption: {
        size: 'text-xs',                                // 12px
        lineHeight: 'leading-normal',
        weight: 'font-normal',
      },
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    // Section Spacing (Vertical rhythm)
    section: {
      compact: 'py-8',        // 32px - Tight sections
      comfortable: 'py-12',   // 48px - Standard sections
      spacious: 'py-16',      // 64px - Feature sections
      hero: 'py-20',          // 80px - Hero sections
    },

    // Component Spacing
    component: {
      // Padding
      padding: {
        xs: 'p-2',            // 8px
        sm: 'p-3',            // 12px
        md: 'p-4',            // 16px
        lg: 'p-5',            // 20px
        xl: 'p-6',            // 24px
      },

      // Margins
      margin: {
        xs: 'mb-2',           // 8px
        sm: 'mb-3',           // 12px
        md: 'mb-4',           // 16px
        lg: 'mb-6',           // 24px
        xl: 'mb-8',           // 32px
      },

      // Gaps
      gap: {
        xs: 'gap-2',          // 8px
        sm: 'gap-3',          // 12px
        md: 'gap-4',          // 16px
        lg: 'gap-6',          // 24px
        xl: 'gap-8',          // 32px
      },
    },
  },

  // ============================================
  // BORDERS & RADII
  // ============================================
  borders: {
    radius: {
      none: 'rounded-none',
      sm: 'rounded-md',       // 6px
      md: 'rounded-lg',       // 8px
      lg: 'rounded-xl',       // 12px
      xl: 'rounded-2xl',      // 16px
      full: 'rounded-full',
    },

    width: {
      DEFAULT: 'border',
      thin: 'border',
      thick: 'border-2',
    },

    color: {
      light: 'border-gray-200',
      DEFAULT: 'border-gray-300',
      dark: 'border-gray-400',
      primary: 'border-slate-500',
    },
  },

  // ============================================
  // SHADOWS & ELEVATION
  // ============================================
  shadows: {
    // Elevation levels
    none: 'shadow-none',
    sm: 'shadow-sm',                    // Subtle elevation
    md: 'shadow-md',                    // Cards
    lg: 'shadow-lg shadow-gray-200/50', // Elevated cards
    xl: 'shadow-xl shadow-gray-200/50', // Modals
    '2xl': 'shadow-2xl',                // Popovers

    // Special effects
    glow: {
      blue: 'shadow-lg shadow-slate-900/20',
      violet: 'shadow-lg shadow-violet-500/20',
      pink: 'shadow-lg shadow-pink-500/20',
    },
  },

  // ============================================
  // ANIMATIONS & TRANSITIONS
  // ============================================
  animation: {
    // Transition Durations
    duration: {
      fast: 'duration-150',       // 150ms - Micro interactions
      normal: 'duration-200',     // 200ms - Standard
      slow: 'duration-300',       // 300ms - Emphasized
      slower: 'duration-500',     // 500ms - Large movements
    },

    // Easing Functions
    easing: {
      DEFAULT: 'ease-out',
      smooth: 'ease-in-out',
      spring: [0.21, 0.47, 0.32, 0.98], // Custom cubic-bezier
    },

    // Common Animations
    hover: {
      lift: 'hover:-translate-y-1 transition-transform duration-200',
      scale: 'hover:scale-[1.02] transition-transform duration-200',
      glow: 'hover:shadow-lg transition-shadow duration-300',
    },
  },

  // ============================================
  // GLASSMORPHISM & EFFECTS
  // ============================================
  effects: {
    glass: {
      light: 'bg-white/80 backdrop-blur-xl',
      medium: 'bg-white/70 backdrop-blur-lg',
      dark: 'bg-gray-900/80 backdrop-blur-xl',
    },

    gradient: {
      primary: 'bg-gradient-to-r from-slate-500 to-violet-500',
      secondary: 'bg-gradient-to-r from-violet-500 to-purple-500',
      accent: 'bg-gradient-to-r from-pink-500 to-rose-500',
      subtle: 'bg-gradient-to-br from-slate-500/10 via-violet-500/10 to-pink-500/10',
    },

    blur: {
      background: 'blur-3xl',
      overlay: 'backdrop-blur-sm',
    },
  },

  // ============================================
  // COMPONENT PRESETS
  // ============================================
  components: {
    // Card variants
    card: {
      default: 'bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300',
      elevated: 'bg-white rounded-xl border border-gray-200 p-5 shadow-md hover:shadow-xl transition-all duration-300',
      glass: 'bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:shadow-lg transition-all duration-300',
    },

    // Button variants
    button: {
      primary: 'bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg px-4 py-2 transition-colors duration-200',
      ghost: 'hover:bg-gray-100 text-gray-700 font-medium rounded-lg px-4 py-2 transition-colors duration-200',
    },

    // Badge variants
    badge: {
      default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700',
      primary: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800',
      success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
    },
  },
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Combines typography classes for easy use
 */
export const text = {
  // Display
  displayLg: `${DESIGN_SYSTEM.typography.scale.display.large.size} ${DESIGN_SYSTEM.typography.scale.display.large.lineHeight} ${DESIGN_SYSTEM.typography.scale.display.large.weight} ${DESIGN_SYSTEM.typography.scale.display.large.letterSpacing}`,
  displayMd: `${DESIGN_SYSTEM.typography.scale.display.medium.size} ${DESIGN_SYSTEM.typography.scale.display.medium.lineHeight} ${DESIGN_SYSTEM.typography.scale.display.medium.weight} ${DESIGN_SYSTEM.typography.scale.display.medium.letterSpacing}`,
  displaySm: `${DESIGN_SYSTEM.typography.scale.display.small.size} ${DESIGN_SYSTEM.typography.scale.display.small.lineHeight} ${DESIGN_SYSTEM.typography.scale.display.small.weight} ${DESIGN_SYSTEM.typography.scale.display.small.letterSpacing}`,

  // Headings
  h1: `${DESIGN_SYSTEM.typography.scale.heading.h1.size} ${DESIGN_SYSTEM.typography.scale.heading.h1.lineHeight} ${DESIGN_SYSTEM.typography.scale.heading.h1.weight} ${DESIGN_SYSTEM.typography.scale.heading.h1.letterSpacing}`,
  h2: `${DESIGN_SYSTEM.typography.scale.heading.h2.size} ${DESIGN_SYSTEM.typography.scale.heading.h2.lineHeight} ${DESIGN_SYSTEM.typography.scale.heading.h2.weight} ${DESIGN_SYSTEM.typography.scale.heading.h2.letterSpacing}`,
  h3: `${DESIGN_SYSTEM.typography.scale.heading.h3.size} ${DESIGN_SYSTEM.typography.scale.heading.h3.lineHeight} ${DESIGN_SYSTEM.typography.scale.heading.h3.weight}`,
  h4: `${DESIGN_SYSTEM.typography.scale.heading.h4.size} ${DESIGN_SYSTEM.typography.scale.heading.h4.lineHeight} ${DESIGN_SYSTEM.typography.scale.heading.h4.weight}`,

  // Body
  bodyLg: `${DESIGN_SYSTEM.typography.scale.body.large.size} ${DESIGN_SYSTEM.typography.scale.body.large.lineHeight}`,
  bodyMd: `${DESIGN_SYSTEM.typography.scale.body.medium.size} ${DESIGN_SYSTEM.typography.scale.body.medium.lineHeight}`,
  bodySm: `${DESIGN_SYSTEM.typography.scale.body.small.size} ${DESIGN_SYSTEM.typography.scale.body.small.lineHeight}`,

  // Caption
  caption: `${DESIGN_SYSTEM.typography.scale.caption.size} ${DESIGN_SYSTEM.typography.scale.caption.lineHeight}`,
};

export default DESIGN_SYSTEM;
