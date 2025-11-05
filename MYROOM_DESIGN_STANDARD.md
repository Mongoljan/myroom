# MyRoom Design System Standard
**Version:** 1.0
**Last Updated:** 2025-11-05
**Status:** Active Design Standard

This is the **official design system** for the MyRoom hotel booking platform. All components and pages **MUST** follow these standards unless explicitly overridden by user request.

---

## 📋 Table of Contents
1. [Quick Reference](#quick-reference)
2. [Typography System](#typography-system)
3. [Color Palette](#color-palette)
4. [Button Standards](#button-standards)
5. [Spacing & Layout](#spacing--layout)
6. [Component Guidelines](#component-guidelines)
7. [Usage Instructions](#usage-instructions)

---

## 🎯 Quick Reference

### Import Statement (Use in ALL components)
```typescript
import { DESIGN_SYSTEM, text } from '@/styles/design-system';
// OR for legacy support:
import { TYPOGRAPHY, CONTAINERS, SPACING } from '@/styles/containers';
```

### Primary Design Principles
- **Minimalist & Clean**: Inspired by Booking.com, Airbnb, modern SaaS
- **Content-First**: Let content breathe, reduce visual noise
- **Consistent Spacing**: Use 8px grid system (multiples of 8)
- **Mobile-First**: Always design for mobile, enhance for desktop

---

## 📝 Typography System

### Current Issues Identified
✅ **Problems Found:**
1. **Inconsistent font sizes** - Hero uses `text-2xl sm:text-3xl` while sections use `text-lg`
2. **Hierarchy confusion** - Section titles and subtitles too similar in size
3. **Font weights mixed** - Some use `font-bold`, others `font-semibold`
4. **Color inconsistency** - Text colors vary between `text-gray-900`, `text-gray-800`, `text-gray-700`

### ✅ Official Typography Scale

| Element | Class | Size (Mobile → Desktop) | Weight | Color | Usage |
|---------|-------|-------------------------|--------|-------|-------|
| **Hero Title** | `text.h1` | `2xl → 3xl` (24px → 30px) | `font-bold` | `text-gray-900` | Main page hero |
| **Section Title** | `text.h2` | `xl → 2xl` (20px → 24px) | `font-bold` | `text-gray-900` | Section headings |
| **Subsection Title** | `text.h3` | `lg → xl` (18px → 20px) | `font-semibold` | `text-gray-900` | Card headers |
| **Body Large** | `text.bodyLg` | `lg` (18px) | `font-normal` | `text-gray-700` | Important text |
| **Body Standard** | `text.bodyMd` | `base` (16px) | `font-normal` | `text-gray-700` | Regular text |
| **Body Small** | `text.bodySm` | `sm` (14px) | `font-normal` | `text-gray-600` | Secondary text |
| **Caption/Label** | `text.caption` | `xs` (12px) | `font-normal` | `text-gray-500` | Labels, metadata |

### Standardized Implementation

#### ✅ DO THIS:
```tsx
// Section titles
<h2 className={`${text.h2} text-gray-900 mb-1`}>
  {t('hotel.recommended')}
</h2>
<p className={`${text.caption} text-gray-600`}>
  {t('features.wideSelectionDesc')}
</p>

// Card titles
<h3 className={`${text.h3} text-gray-900 mb-2`}>
  {hotelName}
</h3>

// Body text
<p className={`${text.bodySm} text-gray-600 leading-relaxed`}>
  {description}
</p>
```

#### ❌ DON'T DO THIS:
```tsx
// ❌ Inconsistent sizes
<h2 className="text-lg font-bold">Title</h2>
<h2 className="text-2xl font-semibold">Another Title</h2>

// ❌ Mixed colors
<p className="text-gray-700">Text</p>
<p className="text-gray-800">More text</p>
```

---

## 🎨 Color Palette

### Primary Colors
```typescript
// Brand Blue - Use for CTAs, primary actions, links
Primary: #3b82f6 (blue-600)
Primary Hover: #2563eb (blue-700)
Primary Light: #60a5fa (blue-400)

// Text Colors - Consistent hierarchy
Title Text: #111827 (gray-900)     // Main headings
Body Text: #4b5563 (gray-600)      // Standard text
Muted Text: #6b7280 (gray-500)     // Labels, captions
Disabled: #9ca3af (gray-400)       // Disabled states
```

### Semantic Colors
```typescript
Success: #10b981 (green-500)   // Confirmations, success states
Warning: #f59e0b (amber-500)   // Warnings, alerts
Error: #ef4444 (red-500)       // Errors, destructive actions
Info: #3b82f6 (blue-500)       // Information, tips
```

### Background Colors
```typescript
Page Background: #ffffff (white)
Card Background: #ffffff (white)
Hover Background: #f9fafb (gray-50)
Border: #e5e7eb (gray-200)
```

---

## 🔘 Button Standards

### Current Issues
✅ **Problems Found:**
1. Hero search button: `bg-blue-600 text-white px-6 py-2.5` with custom shadow
2. Filter buttons: `bg-blue-600 text-white` with different padding
3. Secondary buttons: Inconsistent gray shades

### ✅ Official Button Styles

#### Primary Button (CTAs, Main Actions)
```tsx
// Large (Hero, Important CTAs)
className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
           px-6 py-3 rounded-xl transition-all duration-200
           shadow-sm hover:shadow-md"

// Medium (Forms, Cards)
className="bg-blue-600 hover:bg-blue-700 text-white font-medium
           px-4 py-2 rounded-lg transition-all duration-200
           shadow-sm hover:shadow-md"

// Small (Filters, Tags)
className="bg-blue-600 hover:bg-blue-700 text-white font-medium
           px-3 py-1.5 rounded-lg transition-all duration-200 text-sm"
```

#### Secondary Button (Alternative Actions)
```tsx
// Large
className="bg-white hover:bg-gray-50 text-gray-900 font-semibold
           px-6 py-3 rounded-xl border-2 border-gray-200
           hover:border-gray-300 transition-all duration-200"

// Medium
className="bg-white hover:bg-gray-50 text-gray-700 font-medium
           px-4 py-2 rounded-lg border border-gray-200
           hover:border-gray-300 transition-all duration-200"
```

#### Ghost Button (Subtle Actions)
```tsx
className="hover:bg-gray-100 text-gray-700 font-medium
           px-4 py-2 rounded-lg transition-all duration-200"
```

#### Button with Icon
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium
                   px-4 py-2 rounded-lg transition-all duration-200
                   flex items-center gap-2">
  <Search className="w-4 h-4" />
  <span>Search</span>
</button>
```

---

## 📏 Spacing & Layout

### Container Widths
```typescript
Standard Page: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Narrow Content: max-w-4xl mx-auto px-4 sm:px-6
Auth Pages: max-w-md mx-auto px-4
Full Width: w-full px-4 sm:px-6 lg:px-8
```

### Section Spacing (Vertical)
```typescript
Compact: py-6     // 24px - Homepage sections (RECOMMENDED)
Standard: py-8    // 32px - Regular sections
Large: py-12      // 48px - Feature sections
Hero: py-8        // 32px - Hero sections (keep compact)
```

### Component Spacing
```typescript
// Margins between elements
Tight: mb-1       // 4px - Title to subtitle
Small: mb-2       // 8px - Subtitle to content
Medium: mb-4      // 16px - Between sections
Large: mb-6       // 24px - Between major sections

// Padding inside components
Card: p-3         // 12px - Small cards
Card Large: p-4   // 16px - Standard cards
Modal: p-6        // 24px - Modals, drawers

// Gaps in flex/grid
Tight: gap-2      // 8px - Badges, tags
Medium: gap-4     // 16px - Card grids
Large: gap-6      // 24px - Section layouts
```

---

## 🧩 Component Guidelines

### Section Header Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="mb-4"
>
  <h2 className={`${text.h2} text-gray-900 mb-1`}>
    {t('section.title')}
  </h2>
  <p className={`${text.caption} text-gray-600`}>
    {t('section.subtitle')}
  </p>
</motion.div>
```

### Card Pattern
```tsx
<div className="bg-white rounded-lg border border-gray-200
                overflow-hidden transition-all duration-300
                hover:shadow-lg hover:border-gray-300">
  {/* Image */}
  <div className="relative h-36">
    <Image src={image} alt={alt} fill className="object-cover" />
  </div>

  {/* Content */}
  <div className="p-3">
    <h3 className={`${text.h3} text-gray-900 mb-1 line-clamp-1`}>
      {title}
    </h3>
    <p className={`${text.bodySm} text-gray-600 mb-2`}>
      {location}
    </p>
  </div>
</div>
```

### Badge Pattern
```tsx
// Success badge
<span className="px-2 py-0.5 text-xs font-medium rounded-md
                 bg-green-100 text-green-700">
  {label}
</span>

// Info badge
<span className="px-2 py-0.5 text-xs font-medium rounded-md
                 bg-blue-100 text-blue-700">
  {label}
</span>

// Custom color badge
<span className={`px-2 py-0.5 text-xs font-medium rounded-md
                  text-white ${badgeColor}`}>
  {label}
</span>
```

---

## 🎯 Hero Component Issues & Fixes

### Current ModernHero Issues

#### ❌ Problems Identified:
1. **Font size too small**: `text-2xl sm:text-3xl` feels cramped compared to sections using `text-lg`
2. **Subtitle too subtle**: `text-sm` is barely visible
3. **Background too busy**: Blur orbs compete with content
4. **Button inconsistency**: Custom styling doesn't match the rest of the app
5. **Form input labels hidden**: Labels commented out, reducing clarity

#### ✅ Recommended Fixes:

**Title Size:**
```tsx
// BEFORE
<h1 className="text-2xl sm:text-3xl font-bold">

// AFTER (Better hierarchy)
<h1 className={`${text.h1} text-gray-900 tracking-tight`}>
// Or even bolder:
<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
```

**Subtitle:**
```tsx
// BEFORE
<p className="text-sm text-gray-600">

// AFTER
<p className={`${text.bodyMd} text-gray-600`}>
// Or: text-base for better visibility
```

**Search Button:**
```tsx
// BEFORE
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5
           rounded-xl ... font-semibold text-sm"

// AFTER (Consistent with design system)
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3
           rounded-xl transition-all duration-200 font-semibold text-base
           shadow-sm hover:shadow-md"
```

**Background Simplification:**
```tsx
// BEFORE: Multiple blur orbs with complex animations

// AFTER: Simpler, cleaner
<div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-violet-50/20" />
```

---

## 📚 Usage Instructions

### For Claude (AI Assistant)

**When creating or modifying components:**

1. **ALWAYS import design system first:**
   ```typescript
   import { DESIGN_SYSTEM, text } from '@/styles/design-system';
   ```

2. **Use standardized typography:**
   - Headings: `text.h1`, `text.h2`, `text.h3`, `text.h4`
   - Body: `text.bodyLg`, `text.bodyMd`, `text.bodySm`
   - Labels: `text.caption`

3. **Follow button patterns:**
   - Primary actions → Primary button (blue-600)
   - Secondary actions → Secondary button (white with border)
   - Filters/toggles → Small button or ghost button

4. **Maintain consistent spacing:**
   - Sections: `py-6` (compact homepage style)
   - Between title/subtitle: `mb-1`
   - Between sections: `mb-4`

5. **Use semantic colors:**
   - Titles: `text-gray-900`
   - Body: `text-gray-600` or `text-gray-700`
   - Labels/captions: `text-gray-500`

### For Developers

**Before creating a new component:**
1. Check this document first
2. Look at similar components for patterns
3. Use design system imports
4. Test responsive behavior (mobile-first)

**Component Checklist:**
- [ ] Imports design system
- [ ] Uses standardized typography classes
- [ ] Follows button patterns
- [ ] Consistent spacing (8px grid)
- [ ] Proper color hierarchy
- [ ] Mobile-responsive
- [ ] Accessible (ARIA labels, keyboard nav)

---

## 🔄 Migration Guide

### Updating Existing Components

**Step 1:** Add design system import
```tsx
import { text } from '@/styles/design-system';
```

**Step 2:** Replace hardcoded classes
```tsx
// BEFORE
<h2 className="text-lg font-bold text-gray-900">

// AFTER
<h2 className={`${text.h2} text-gray-900`}>
```

**Step 3:** Standardize buttons
```tsx
// BEFORE
<button className="bg-blue-600 px-4 py-2 text-white rounded-lg">

// AFTER
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium
                   px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
```

---

## 📊 Design Audit Results

### ✅ Components Following Standards
- ✅ **RecommendedHotels**: Good section header pattern, consistent spacing
- ✅ **WhyChooseUs**: Clean typography, proper hierarchy
- ✅ **PopularDestinations**: Consistent card design
- ✅ **SectionHotelCard**: Follows card pattern well

### ⚠️ Components Needing Updates
- ⚠️ **ModernHero**: Font sizes too small, subtitle barely visible
- ⚠️ **SearchButton**: Inconsistent styling (text-[18px] instead of text-base)
- ⚠️ Some form labels hidden/commented out

### 🎯 Priority Improvements
1. **Hero component typography** - Increase title size to match importance
2. **Button standardization** - Ensure all buttons use consistent padding/sizing
3. **Form label visibility** - Uncomment labels or ensure clear placeholders
4. **Color consistency** - Audit all text colors, standardize to gray-900/600/500

---

## 🚀 Quick Start Examples

### Creating a New Section
```tsx
import { text } from '@/styles/design-system';
import { motion } from 'framer-motion';

export default function MyNewSection() {
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h2 className={`${text.h2} text-gray-900 mb-1`}>
            Section Title
          </h2>
          <p className={`${text.caption} text-gray-600`}>
            Section subtitle or description
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cards or content here */}
        </div>
      </div>
    </section>
  );
}
```

### Creating a Card Component
```tsx
import { text } from '@/styles/design-system';
import Image from 'next/image';
import Link from 'next/link';

export default function MyCard({ title, description, image, href }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden
                 transition-all duration-300 hover:shadow-lg hover:border-gray-300
                 block"
    >
      <div className="relative h-36">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="p-3">
        <h3 className={`${text.h3} text-gray-900 mb-1 line-clamp-1`}>
          {title}
        </h3>
        <p className={`${text.bodySm} text-gray-600`}>
          {description}
        </p>
      </div>
    </Link>
  );
}
```

---

## 📝 Notes

- This document is the **single source of truth** for design decisions
- When in doubt, reference **Booking.com** or **Airbnb** for inspiration
- Prioritize **clarity** and **usability** over visual flair
- Keep it **simple** - remove what's not needed
- **Mobile-first** - test on small screens first

**Last Updated:** 2025-11-05
**Maintained By:** Development Team
**Status:** Active Standard
