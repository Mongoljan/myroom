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
  // Section padding - compact like booking sites
  section: {
    compact: "py-6",
    standard: "py-8", 
    large: "py-12"
  },
  
  // Component margins
  component: {
    tight: "mb-4",
    standard: "mb-6",
    large: "mb-8"
  },
  
  // Text spacing
  text: {
    tight: "mb-1",
    standard: "mb-2",
    large: "mb-3"
  }
} as const;

// Typography scale - comprehensive hierarchy like booking sites
export const TYPOGRAPHY = {
  // Hero sections
  hero: {
    title: "text-2xl md:text-3xl lg:text-4xl font-bold",
    subtitle: "text-lg md:text-xl font-medium",
    description: "text-base font-normal"
  },
  
  // Page headings
  heading: {
    h1: "text-xl font-bold",      // Main page titles
    h2: "text-lg font-semibold",  // Section titles  
    h3: "text-base font-medium",  // Subsection titles
    h4: "text-sm font-medium"     // Small titles
  },
  
  // Body text
  body: {
    large: "text-base font-normal",  // Important content
    standard: "text-sm font-normal", // Regular content
    small: "text-xs font-normal",    // Secondary info
    caption: "text-xs font-normal"   // Captions, labels
  },
  
  // UI Elements
  button: {
    large: "text-base font-medium",
    standard: "text-sm font-medium",
    small: "text-xs font-medium"
  },
  
  // Form elements
  form: {
    label: "text-sm font-medium",
    input: "text-base font-normal",
    helper: "text-xs font-normal",
    error: "text-xs font-medium"
  },
  
  // Navigation
  nav: {
    primary: "text-sm font-medium",
    secondary: "text-xs font-medium",
    breadcrumb: "text-xs font-normal"
  },
  
  // Cards and components
  card: {
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium", 
    content: "text-sm font-normal",
    price: "text-lg font-bold",
    badge: "text-xs font-medium"
  },
  
  // Modal and dropdown
  modal: {
    title: "text-base font-semibold",
    content: "text-sm font-normal",
    button: "text-sm font-medium"
  }
} as const;