/**
 * Design Tokens - Centralized mapping from design system to Tailwind classes
 *
 * This file creates a bridge between our design system and Tailwind.
 * Update values in design-system.ts, and they automatically propagate here.
 *
 * Usage:
 * - Instead of: className="text-gray-600 text-sm p-4"
 * - Use: className={`${ds.text.secondary} ${ds.typography.bodySm} ${ds.spacing.padding.md}`}
 */

import { text } from './design-system';

/**
 * Design System Utilities
 * Easy-to-use helper object that maps design system values to class names
 */
export const ds = {
  // ============================================
  // COLORS - 2025 Psychology-Based Palette
  // ============================================
  colors: {
    // Text colors - Optimized for readability & trust
    text: {
      primary: 'text-slate-900',           // Rich, modern black
      secondary: 'text-slate-600',         // Warm neutral
      tertiary: 'text-slate-500',          // Subtle, elegant
      disabled: 'text-slate-400',          // Gentle disabled
      inverse: 'text-white',               // Pure white
      accent: 'text-slate-900',             // Trust & reliability
    },

    // Background colors - Layered depth system
    bg: {
      primary: 'bg-white',
      secondary: 'bg-slate-50',            // Softer than gray
      tertiary: 'bg-slate-100',
      elevated: 'bg-white',
      overlay: 'bg-slate-900/60',          // Softer overlay
      glass: 'bg-white/80',                // Glassmorphism
      mesh: 'bg-gradient-to-br from-slate-50/50 via-violet-50/30 to-cyan-50/50', // Mesh gradient
    },

    // Primary brand - Trust + Energy (Blue-Cyan spectrum)
    primary: {
      50: 'bg-cyan-50',
      100: 'bg-cyan-100',
      200: 'bg-cyan-200',
      300: 'bg-cyan-300',
      400: 'bg-cyan-400',
      500: 'bg-cyan-500',             // Main: Trustworthy cyan
      600: 'bg-slate-900',             // Action: Reliable blue
      700: 'bg-slate-800',
      800: 'bg-slate-800',
      900: 'bg-slate-900',            // Deep, premium
      text: {
        50: 'text-cyan-50',
        100: 'text-cyan-100',
        200: 'text-cyan-200',
        300: 'text-cyan-300',
        400: 'text-cyan-400',
        500: 'text-cyan-500',
        600: 'text-slate-900',
        700: 'text-slate-800',
        800: 'text-slate-800',
        900: 'text-slate-900',
      },
    },

    // Secondary accent - Warmth + Hospitality (Coral-Orange)
    secondary: {
      50: 'bg-orange-50',
      100: 'bg-orange-100',
      200: 'bg-orange-200',
      300: 'bg-orange-300',
      400: 'bg-orange-400',
      500: 'bg-orange-500',           // Warm, welcoming
      600: 'bg-orange-600',
      text: {
        500: 'text-orange-500',
        600: 'text-orange-600',
      },
    },

    // Tertiary - Luxury + Premium (Purple-Violet)
    tertiary: {
      50: 'bg-violet-50',
      100: 'bg-violet-100',
      500: 'bg-violet-500',           // Premium feel
      600: 'bg-violet-600',
      700: 'bg-purple-700',           // Deep luxury
      text: {
        500: 'text-violet-500',
        600: 'text-violet-600',
      },
    },

    // Semantic colors - Enhanced with psychology
    success: {
      bg: 'bg-emerald-50',            // Natural, positive
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      solid: 'bg-emerald-500',
    },
    error: {
      bg: 'bg-rose-50',               // Softer than red
      text: 'text-rose-600',
      border: 'border-rose-200',
      solid: 'bg-rose-500',
    },
    warning: {
      bg: 'bg-amber-50',              // Attention-grabbing
      text: 'text-amber-600',
      border: 'border-amber-200',
      solid: 'bg-amber-500',
    },
    info: {
      bg: 'bg-sky-50',                // Calm, informative
      text: 'text-sky-600',
      border: 'border-sky-200',
      solid: 'bg-sky-500',
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Display sizes (Extra large headlines)
    displayLg: text.displayLg,
    displayMd: text.displayMd,
    displaySm: text.displaySm,

    // Headings (Modern: smaller, tighter)
    h1: 'text-2xl font-bold tracking-tight',    // 24px - Page titles
    h2: 'text-xl font-bold tracking-tight',     // 20px - Section headers
    h3: 'text-lg font-semibold',                // 18px - Sub-sections
    h4: 'text-base font-semibold',              // 16px - Card titles

    // Body text (Shadcn standard: 14px-16px)
    bodyLg: 'text-base leading-relaxed',        // 16px - Comfortable reading
    bodyMd: 'text-sm leading-relaxed',          // 14px - Standard body (Shadcn default)
    bodySm: 'text-sm leading-normal',           // 14px - Compact text

    // Caption & small text
    caption: 'text-xs text-gray-500',           // 12px - Meta info, timestamps

    // Font weights
    weight: {
      normal: 'font-normal',      // 400
      medium: 'font-medium',      // 500
      semibold: 'font-semibold',  // 600
      bold: 'font-bold',          // 700
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    // Section spacing (modern tight: 24px - 40px between sections)
    section: {
      compact: 'py-3',       // 24px (1.5rem) - Tight, modern spacing
      compact2:"py-10",
      comfortable: 'py-10',  // 40px (2.5rem) - Standard section spacing
      spacious: 'py-14',     // 56px (3.5rem) - Generous section spacing
      hero: 'py-20',         // 80px (5rem) - Hero sections only
    },

    // Padding (following 4px/8px base grid)
    padding: {
      xs: 'p-2',   // 8px
      sm: 'p-3',   // 12px
      md: 'p-4',   // 16px
      lg: 'p-6',   // 24px
      xl: 'p-8',   // 32px
    },

    // Padding X (horizontal)
    px: {
      xs: 'px-2',  // 8px
      sm: 'px-3',  // 12px
      md: 'px-4',  // 16px
      lg: 'px-6',  // 24px
      xl: 'px-8',  // 32px
    },

    // Padding Y (vertical)
    py: {
      xs: 'py-2',  // 8px
      sm: 'py-3',  // 12px
      md: 'py-4',  // 16px
      lg: 'py-6',  // 24px
      xl: 'py-8',  // 32px
    },

    // Margin (bottom margins for consistent vertical rhythm)
    margin: {
      xs: 'mb-2',  // 8px
      sm: 'mb-3',  // 12px
      md: 'mb-6',  // 24px
      lg: 'mb-8',  // 32px
      xl: 'mb-12', // 48px
    },

    // Gap (modern standard: 16px-24px for components)
    gap: {
      xs: 'gap-2',  // 8px - Tight spacing
      sm: 'gap-3',  // 12px - Compact spacing
      md: 'gap-4',  // 16px - Standard spacing (Shadcn default)
      lg: 'gap-6',  // 24px - Comfortable spacing
      xl: 'gap-8',  // 32px - Spacious layouts
    },
  },

  // ============================================
  // BORDERS & RADIUS
  // ============================================
  borders: {
    // Border radius
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    },

    // Border width
    width: {
      default: 'border',
      thin: 'border',
      thick: 'border-2',
      thicker: 'border-4',
    },

    // Border color - Updated for new palette
    color: {
      light: 'border-slate-200',      // Softer dividers
      default: 'border-slate-300',    // Standard borders
      dark: 'border-slate-400',       // Emphasized borders
      primary: 'border-cyan-500',     // Trust + energy
      accent: 'border-violet-500',    // Premium
      warm: 'border-orange-400',      // Hospitality
    },
  },

  // ============================================
  // SHADOWS & ELEVATION
  // ============================================
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg shadow-gray-200/50',
    xl: 'shadow-xl shadow-gray-200/50',
    '2xl': 'shadow-2xl',

    // Hover shadows
    hover: {
      sm: 'hover:shadow-sm',
      md: 'hover:shadow-md',
      lg: 'hover:shadow-lg',
    },
  },

  // ============================================
  // EFFECTS
  // ============================================
  effects: {
    // Glassmorphism
    glass: {
      light: 'bg-white/80 backdrop-blur-xl',
      medium: 'bg-white/70 backdrop-blur-lg',
      dark: 'bg-gray-900/80 backdrop-blur-xl',
    },

    // Gradients
    gradient: {
      primary: 'bg-gradient-to-r from-slate-500 to-violet-500',
      secondary: 'bg-gradient-to-r from-violet-500 to-purple-500',
      accent: 'bg-gradient-to-r from-pink-500 to-rose-500',
      subtle: 'bg-gradient-to-br from-slate-500/10 via-violet-500/10 to-pink-500/10',
    },
  },

  // ============================================
  // TRANSITIONS & ANIMATIONS
  // ============================================
  transitions: {
    default: 'transition-all duration-200',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-300',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200',
    shadow: 'transition-shadow duration-300',
  },

  // ============================================
  // COMPONENT PRESETS
  // ============================================
  components: {
    // Cards
    card: {
      default: 'bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300',
      elevated: 'bg-white rounded-xl border border-slate-200 p-5 shadow-md hover:shadow-xl transition-all duration-300',
      glass: 'bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200/50 p-5 hover:shadow-lg transition-all duration-300',
    },

    // 🎨 NEXT-GEN BUTTON STYLES - Beyond Gradients
    button: {
      // ===== PRIMARY ACTIONS - Geometric Pattern Overlay =====
      primary: `relative overflow-hidden bg-slate-400 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-900/50 hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:opacity-30 hover:before:opacity-40 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_20%_30%,_rgba(96,165,250,1)_0%,_transparent_40%),radial-gradient(circle_at_80%_70%,_rgba(167,139,250,1)_0%,_transparent_40%),radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.9)_0%,_transparent_50%)]`,
      
      // ===== SECONDARY - Neumorphic Soft Shadow =====
      secondary: 'relative bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-[4px_4px_10px_rgba(0,0,0,0.08),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[6px_6px_15px_rgba(0,0,0,0.12),-6px_-6px_15px_rgba(255,255,255,1)]',
      
      // ===== ACCENT - Mesh Gradient with Shimmer =====
      accent: 'relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-lg shadow-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
      
      // ===== PREMIUM - Luxury Metallic Shine =====
      premium: 'relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-900/70 border border-slate-700 hover:border-slate-600 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-slate-500/30 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000',
      
      // ===== GLASS - Glassmorphism + Backdrop =====
      glass: 'relative bg-white/20 backdrop-blur-xl border border-white/30 text-slate-900 font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 hover:bg-white/30 hover:border-white/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10',
      
      // ===== GHOST - Minimal with Hover Fill =====
      ghost: 'relative overflow-hidden text-slate-700 hover:text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-slate-600 before:to-cyan-600 before:translate-y-[100%] hover:before:translate-y-0 before:transition-transform before:duration-300 before:z-[-1]',
      
      // ===== WARM - Hospitality & Welcoming =====
      warm: 'relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-size-200 hover:bg-pos-100 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 hover:scale-[1.02]',
      
      // ===== SUCCESS - Positive Action =====
      success: 'relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02]',
      
      // ===== DANGER - Critical Action =====
      danger: 'relative bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-[1.02]',
      
      // ===== OUTLINE - Modern Border Effect =====
      outline: 'relative bg-transparent border-2 border-slate-900 text-slate-900 hover:text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-300 overflow-hidden before:absolute before:inset-0 before:bg-slate-900 before:translate-y-[100%] hover:before:translate-y-0 before:transition-transform before:duration-300 before:z-[-1]',

      // Button sizes
      sm: 'text-xs font-semibold px-4 py-1.5 rounded-lg',
      md: 'text-sm font-semibold px-6 py-2.5 rounded-xl',
      lg: 'text-base font-semibold px-8 py-3 rounded-xl',
      xl: 'text-lg font-semibold px-10 py-4 rounded-2xl',
    },

    // Badges with new color system
    badge: {
      default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700',
      primary: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700',
      success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700',
      error: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700',
      warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700',
    },

    // Inputs
    input: {
      default: 'w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all',
      error: 'w-full border border-red-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all',
    },
  },
};

/**
 * Helper function to combine design system classes
 * Usage: cn(ds.colors.text.primary, ds.typography.bodyMd, 'custom-class')
 */
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Responsive container classes
 */
export const container = {
  default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8',
};

/**
 * Icon size utilities
 */
export const iconSize = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export default ds;
