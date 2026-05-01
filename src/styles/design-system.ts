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
      light: 'border-gray-200 dark:border-gray-700',
      DEFAULT: 'border-gray-300 dark:border-gray-600',
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
      light: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
      medium: 'bg-white/70 dark:bg-gray-700/70 backdrop-blur-lg',
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
      default: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300',
      elevated: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-md hover:shadow-xl transition-all duration-300',
      glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg transition-all duration-300',
    },

    // Button variants
    button: {
      primary: 'bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200',
      secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg px-4 py-2 transition-colors duration-200',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg px-4 py-2 transition-colors duration-200',
    },

    // Badge variants
    badge: {
      default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      primary: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800',
      success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
    },
  },
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * MYROOM TEXT UTILITIES — the single source-of-truth for typography classes.
 *
 * All sizes map to CSS custom properties defined in design-tokens.css via the
 * @theme block in globals.css, so editing --ds-h2 etc. cascades everywhere.
 *
 * Hierarchy:
 *   display  → 32px  hero headlines
 *   h1       → 26px  page-level title (hotel detail page name, etc.)
 *   h2       → 20px  section headings (Санал болгох, Алдартай байршлүүд…)
 *   h3       → 17px  card / modal headings
 *   h4       → 15px  small headings, secondary labels
 *   body-lg  → 15px  lead / important body copy
 *   body-md  → 14px  standard body text
 *   caption  → 13px  meta info, location labels
 *   label    → 12px  badges, tags, tiny UI text
 */
export const text = {
  // ─── Display (hero only) ────────────────────────────────────────
  displayLg: 'text-4xl sm:text-5xl font-bold tracking-tight leading-none',
  displayMd: 'text-3xl sm:text-4xl font-bold tracking-tight leading-tight',
  displaySm: 'text-display font-bold tracking-tight leading-tight',

  // ─── Standard heading hierarchy ─────────────────────────────────
  /** Page-level title — hotel name on detail page, search result count */
  h1: 'text-h1 font-bold leading-tight tracking-tight',
  /** Section headings — all home-page sections must use this */
  h2: 'text-h2 font-semibold leading-snug tracking-tight',
  /** Card / modal headings */
  h3: 'text-h3 font-semibold leading-snug',
  /** Small headings, card labels */
  h4: 'text-h4 font-medium leading-normal',

  // ─── Body text ──────────────────────────────────────────────────
  bodyLg: 'text-body-lg leading-relaxed',
  bodyMd: 'text-body-md leading-relaxed',
  bodySm: 'text-body-md leading-normal',

  // ─── Small / meta text ──────────────────────────────────────────
  caption: 'text-caption leading-normal',
  label:   'text-label font-medium',
};

export default DESIGN_SYSTEM;
