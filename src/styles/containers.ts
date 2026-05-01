// Standard container patterns for consistent use across the app
export const CONTAINERS = {
  // Main content container - use for most pages
  standard: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // Narrow content - use for forms, article content
  narrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // Auth pages - use for login/signup
  auth: "max-w-md mx-auto px-4 sm:px-6",
  
  // Full width - use for hero sections that need more space
  fullWidth: "w-full px-4 sm:px-6 lg:px-8"
} as const;

// Compact spacing patterns for minimal design
export const SPACING = {
  // Section padding — all sections should use one of these
  section: {
    compact: "py-8",    // 32px
    standard: "py-10",  // 40px ← default for home sections
    large: "py-14",     // 56px
  },
  
  // Component margins
  component: {
    tight: "mb-3",
    standard: "mb-5",
    large: "mb-8",
  },
  
  // Heading-to-content gap
  text: {
    tight: "mb-1",
    standard: "mb-2",
    large: "mb-4",
  }
} as const;

/**
 * TYPOGRAPHY — the unified type system.
 *
 * All classes use the custom Tailwind utilities defined in globals.css @theme,
 * backed by --ds-* CSS variables in design-tokens.css.
 *
 * Hierarchy:
 *   hero.title   → responsive hero headline (stays responsive for hero only)
 *   heading.h1   → 26px  page-level title
 *   heading.h2   → 20px  section headings  ← ALL section titles must use this
 *   heading.h3   → 17px  sub-section / sidebar headings
 *   heading.h4   → 15px  card-internal labels
 *   body.large   → 15px  lead text
 *   body.standard→ 14px  regular body
 *   body.small   → 13px  secondary text
 *   body.caption → 13px  meta, location, dates
 *   button.*     → font-size + weight for CTA buttons
 *   nav.*        → navigation link sizes
 *   card.*       → card-specific hierarchy
 */
export const TYPOGRAPHY = {
  // Hero sections — kept responsive to scale on very large screens
  hero: {
    title: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
    subtitle: "text-h3 font-medium leading-snug",
    description: "text-body-md leading-relaxed",
  },
  
  // Page headings
  heading: {
    h1: "text-h1 font-bold leading-tight",           // 26px – page title
    h2: "text-h2 font-semibold leading-snug",        // 20px – section title
    h3: "text-h3 font-medium leading-snug",          // 17px – sub-section
    h4: "text-h4 font-medium leading-normal",        // 15px – card label
  },
  
  // Body text
  body: {
    large:    "text-body-lg leading-relaxed",        // 15px
    standard: "text-body-md leading-relaxed",        // 14px
    small:    "text-caption leading-normal",         // 13px
    caption:  "text-caption leading-normal",         // 13px
  },
  
  // UI Elements
  button: {
    large:    "text-body-lg font-semibold",
    standard: "text-body-md font-medium",
    small:    "text-caption font-medium",
  },
  
  // Form elements
  form: {
    label:  "text-body-md font-medium",
    input:  "text-body-md",
    helper: "text-caption",
    error:  "text-caption font-medium",
  },
  
  // Navigation
  nav: {
    primary:   "text-body-md font-medium",
    secondary: "text-caption font-medium",
    breadcrumb:"text-caption",
  },
  
  // Cards and components
  card: {
    title:    "text-h3 font-semibold",              // 17px – card heading
    subtitle: "text-body-md font-medium",           // 14px – card sub-heading
    content:  "text-body-md",                       // 14px – card body
    price:    "text-h1 font-bold",                  // 26px – price display
    badge:    "text-label font-medium",             // 12px – badge text
  },
  
  // Modal and dropdown
  modal: {
    title:  "text-h3 font-semibold",
    content:"text-body-md",
    button: "text-body-md font-medium",
  },
} as const;