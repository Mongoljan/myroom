# MyRoom Design System Documentation

This document outlines the comprehensive design system for the MyRoom hotel booking platform. Follow these guidelines to ensure consistent, modern, and accessible UI/UX across the entire application.

## 🎨 Design Philosophy

Our design system is inspired by modern minimalist aesthetics (Wave.co, Linear, Stripe) with these core principles:

1. **Clarity First** - Clear visual hierarchy, readable typography
2. **Smooth Interactions** - Subtle animations, smooth transitions
3. **Space-Efficient** - Compact layouts without feeling cramped
4. **Consistent** - Unified design language throughout
5. **Accessible** - WCAG compliant, keyboard navigation, screen reader friendly

---

## 📦 Installation & Usage

```typescript
// Import the design system
import DESIGN_SYSTEM, { text } from '@/styles/design-system';

// Use predefined text styles
<h1 className={text.h1}>Section Title</h1>
<p className={text.bodyMd}>Body text content</p>

// Or use individual tokens
<div className={DESIGN_SYSTEM.spacing.section.comfortable}>
  <div className={DESIGN_SYSTEM.components.card.default}>
    Card content
  </div>
</div>
```

---

## 🎯 Typography Hierarchy

### Display Text (Hero Sections, Landing Pages)
```tsx
// Large Display - Hero headers
<h1 className={text.displayLg}>
  Find Your Perfect Hotel Stay
</h1>

// Medium Display - Sub-heroes
<h1 className={text.displayMd}>
  Welcome to MyRoom
</h1>

// Small Display - Feature headers
<h2 className={text.displaySm}>
  Browse Our Collection
</h2>
```

### Headings (Sections, Cards)
```tsx
// H1 - Page titles
<h1 className={text.h1}>Why Choose Us?</h1>

// H2 - Section titles
<h2 className={text.h2}>Recommended Hotels</h2>

// H3 - Card headers
<h3 className={text.h3}>Hotel Name</h3>

// H4 - Sub-headers
<h4 className={text.h4}>Room Details</h4>
```

### Body Text
```tsx
// Large - Prominent paragraphs
<p className={text.bodyLg}>
  Important descriptive text
</p>

// Medium - Standard body text (DEFAULT)
<p className={text.bodyMd}>
  Regular paragraph content
</p>

// Small - Compact descriptions
<p className={text.bodySm}>
  Card descriptions, captions
</p>
```

### Captions & Meta
```tsx
// Captions - Metadata, dates, timestamps
<span className={text.caption}>
  Last updated: 2 hours ago
</span>
```

---

## 🎨 Color Usage

### Primary Brand Colors
```tsx
// Primary actions (buttons, links, focus states)
className="bg-blue-600 hover:bg-blue-700"
className="text-blue-600"
className="border-blue-500"
```

### Secondary Accent Colors
```tsx
// Feature highlights
className="bg-violet-500"  // Premium features
className="bg-purple-500"  // Special offers
className="bg-pink-500"    // New/trending
```

### Neutral Grays
```tsx
// Backgrounds
className="bg-gray-50"     // Page backgrounds
className="bg-gray-100"    // Card backgrounds
className="bg-white"       // Elevated surfaces

// Borders
className="border-gray-200"  // Standard borders
className="border-gray-300"  // Emphasized borders

// Text
className="text-gray-900"  // Primary text
className="text-gray-600"  // Secondary text
className="text-gray-500"  // Tertiary text/captions
```

### Semantic Colors
```tsx
// Success
className="bg-green-100 text-green-700"  // Success badge
className="text-green-600"               // Success message

// Warning
className="bg-yellow-100 text-yellow-700"

// Error
className="bg-red-100 text-red-700"
className="text-red-600"

// Info
className="bg-blue-100 text-blue-700"
```

---

## 📐 Spacing System

### Section Spacing
```tsx
// Compact sections (tight content)
<section className="py-8">

// Comfortable sections (standard spacing) - DEFAULT
<section className="py-12">

// Spacious sections (feature sections)
<section className="py-16">

// Hero sections
<section className="py-20">
```

### Component Spacing
```tsx
// Padding
className="p-2"  // xs - Badges, small UI
className="p-3"  // sm - Buttons
className="p-4"  // md - Cards (DEFAULT)
className="p-5"  // lg - Large cards
className="p-6"  // xl - Feature cards

// Margins (bottom spacing)
className="mb-2"  // xs
className="mb-3"  // sm
className="mb-4"  // md (DEFAULT)
className="mb-6"  // lg
className="mb-8"  // xl

// Gaps (flex/grid spacing)
className="gap-2"  // xs
className="gap-3"  // sm
className="gap-4"  // md (DEFAULT)
className="gap-6"  // lg
className="gap-8"  // xl
```

---

## 🔲 Borders & Radius

### Border Radius
```tsx
className="rounded-md"   // sm - Buttons, small cards (6px)
className="rounded-lg"   // md - Standard cards (8px) - DEFAULT
className="rounded-xl"   // lg - Large cards (12px)
className="rounded-2xl"  // xl - Hero sections (16px)
className="rounded-full" // Circles, pills
```

### Borders
```tsx
// Standard border
className="border border-gray-200"

// Hover states
className="hover:border-gray-300"
className="hover:border-blue-300"

// Focus states
className="focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
```

---

## 💫 Shadows & Elevation

```tsx
// Cards
className="shadow-sm"           // Subtle (flat cards)
className="shadow-md"           // Standard cards
className="shadow-lg"           // Elevated cards
className="shadow-xl"           // Modals, overlays

// Hover effects
className="hover:shadow-lg"
className="hover:shadow-xl"

// Colored glows
className="shadow-lg shadow-blue-500/20"    // Blue glow
className="shadow-lg shadow-violet-500/20"  // Violet glow
```

---

## ✨ Animations & Transitions

### Duration
```tsx
className="duration-150"  // Fast - Micro interactions
className="duration-200"  // Normal - Standard (DEFAULT)
className="duration-300"  // Slow - Emphasized
className="duration-500"  // Slower - Large movements
```

### Common Hover Effects
```tsx
// Lift effect
className="hover:-translate-y-1 transition-transform duration-200"

// Scale effect
className="hover:scale-[1.02] transition-transform duration-200"

// Glow effect
className="hover:shadow-lg transition-shadow duration-300"
```

### Framer Motion Presets
```tsx
// Entrance animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>

// Hover lift
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
>

// Hover scale
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>

// Tap feedback
<motion.button
  whileTap={{ scale: 0.98 }}
>
```

---

## 🎴 Component Presets

### Cards
```tsx
// Default card
<div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300">

// Elevated card
<div className="bg-white rounded-xl border border-gray-200 p-5 shadow-md hover:shadow-xl transition-all duration-300">

// Glass card
<div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:shadow-lg transition-all duration-300">
```

### Buttons
```tsx
// Primary
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200">

// Secondary
<button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg px-4 py-2 transition-colors duration-200">

// Ghost
<button className="hover:bg-gray-100 text-gray-700 font-medium rounded-lg px-4 py-2 transition-colors duration-200">
```

### Badges
```tsx
// Default
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">

// Primary
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">

// Success
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
```

---

## 🌈 Special Effects

### Glassmorphism
```tsx
// Light glass
className="bg-white/80 backdrop-blur-xl"

// Medium glass
className="bg-white/70 backdrop-blur-lg"

// Dark glass
className="bg-gray-900/80 backdrop-blur-xl"
```

### Gradients
```tsx
// Primary gradient
className="bg-gradient-to-r from-blue-500 to-violet-500"

// Text gradient
className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"

// Subtle background gradient
className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10"
```

### Blur Effects
```tsx
// Background orbs
className="blur-3xl"

// Overlay backdrop
className="backdrop-blur-sm"
```

---

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px (Mobile landscape, small tablets)
- **md**: 768px (Tablets)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large desktop)

### Mobile-First Approach
```tsx
// Always start with mobile, then scale up
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>

<section className="py-8 sm:py-12 lg:py-16">
  {/* Responsive spacing */}
</section>
```

---

## ✅ Component Checklist

When creating/updating components, ensure:

- [ ] Typography follows hierarchy (use `text.*` utilities)
- [ ] Colors use design tokens (no arbitrary values)
- [ ] Spacing uses system values (2, 3, 4, 6, 8, etc.)
- [ ] Border radius is consistent (lg, xl, 2xl)
- [ ] Hover/focus states are defined
- [ ] Animations are subtle (200-300ms duration)
- [ ] Responsive at all breakpoints
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Dark backgrounds have proper text contrast

---

## 🚀 Quick Start Examples

### Section Header Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="mb-5"
>
  <h2 className={text.h2}>Section Title</h2>
  <p className={text.bodySm + " text-gray-600"}>
    Section description
  </p>
</motion.div>
```

### Card Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  whileHover={{ y: -4 }}
  className="group"
>
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
    <h3 className={text.h3}>Card Title</h3>
    <p className={text.bodySm + " text-gray-600"}>
      Card description
    </p>
  </div>
</motion.div>
```

### Badge with Pulse
```tsx
<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-gray-200/50 text-xs font-medium text-gray-700">
  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse" />
  Badge Text
</span>
```

---

## 📚 Resources

- **Design System File**: `/src/styles/design-system.ts`
- **Example Components**:
  - WhyChooseUs (`/src/components/sections/WhyChooseUs.tsx`)
  - ModernHero (`/src/components/hero/ModernHero.tsx`)
  - PopularDestinations (`/src/components/sections/PopularDestinations.tsx`)

---

## 🎯 Best Practices

1. **Always use design tokens** - Never hardcode colors or spacing
2. **Mobile-first** - Start with mobile layout, enhance for desktop
3. **Subtle animations** - Keep duration under 500ms for UI interactions
4. **Consistent spacing** - Use 4px increments (8px, 12px, 16px, 24px, 32px)
5. **Accessible contrast** - Minimum 4.5:1 for normal text, 3:1 for large text
6. **Semantic HTML** - Use proper heading hierarchy (h1 → h2 → h3)
7. **Performance** - Lazy load images, minimize animation complexity

---

Built with ❤️ for MyRoom Hotel Booking Platform
