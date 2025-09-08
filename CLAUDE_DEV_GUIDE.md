# Claude Development Guide for MyRoom Project

## 📋 Project Overview
**Project Name:** MyRoom  
**Version:** 0.1.0  
**Type:** Hotel Booking Platform  
**Language:** TypeScript  

## 🛠 Technology Stack

### Core Framework Versions
- **Next.js:** `15.5.0` (Latest stable - App Router)
- **React:** `19.1.0` (Latest stable with new features)
- **React DOM:** `19.1.0`
- **TypeScript:** `^5` (Latest)
- **Node.js Target:** ES2017

### Styling & UI
- **Tailwind CSS:** `^4` (Latest major version - NEW SYNTAX)
- **Tailwind PostCSS:** `@tailwindcss/postcss ^4`
- **Class Variance Authority:** `^0.7.1`
- **Tailwind Merge:** `^3.3.1`
- **CLSX:** `^2.1.1`

### UI Components & Icons
- **Radix UI:** `@radix-ui/react-slot ^1.2.3`
- **Lucide React:** `^0.540.0` (Primary icon library - simple, consistent)
- **React Icons:** Use https://react-icons.github.io/ for additional icons
  - **Rule:** NEVER use random icons or inconsistent icon libraries
  - **Priority:** Lucide React first, React Icons for missing icons
  - **Installation:** `npm install react-icons` when needed
- **Framer Motion:** `^12.23.12` (Animations)

### Internationalization
- **i18next:** `^25.4.0`
- **react-i18next:** `^15.7.1`
- **i18next-browser-languagedetector:** `^8.2.0`

### Theme Management
- **Next Themes:** `^0.4.6` (Dark mode support)

## 🎨 Tailwind CSS v4 Guidelines

### ⚠️ CRITICAL: Opacity Syntax Changes
**OLD (v3.x):** `bg-opacity-25`, `text-opacity-50`  
**NEW (v4.x):** `bg-black/25`, `text-gray-900/50`

### Color Usage Patterns
```css
/* Background with opacity */
bg-black/25          /* 25% opacity black background */
bg-white/90          /* 90% opacity white background */
bg-blue-600/20       /* 20% opacity blue background */

/* Text with opacity */
text-gray-900/80     /* 80% opacity gray text */
text-white/75        /* 75% opacity white text */

/* Border with opacity */
border-gray-200/50   /* 50% opacity gray border */
```

### Project-Specific Color Scheme
The project uses CSS custom properties for theming:
- `hsl(var(--primary))`, `hsl(var(--secondary))`
- `hsl(var(--background))`, `hsl(var(--foreground))`
- `hsl(var(--muted))`, `hsl(var(--accent))`

## 🏗 Project Structure

### Path Aliases
- `@/*` maps to `./src/*`

### Content Sources (Tailwind)
```typescript
content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
]
```

## 📝 Code Style Guidelines

### TypeScript Configuration
- **Target:** ES2017
- **Module:** ESNext with bundler resolution
- **Strict mode:** Enabled
- **JSX:** Preserve (handled by Next.js)

### Import Patterns
```typescript
// Absolute imports using @ alias
import { Component } from '@/components/ui/Component'
import { api } from '@/services/api'
import { TYPOGRAPHY } from '@/styles/containers'
```

### Component Patterns
1. Use `'use client'` directive for client components
2. TypeScript interfaces for all props
3. Tailwind classes with modern syntax
4. Framer Motion for animations when needed

## 🎯 Specific Implementation Notes

### Responsive Design
- Mobile-first approach with `lg:` breakpoints
- Use `lg:hidden` for mobile-only elements
- Use `hidden lg:block` for desktop-only elements

### Modal/Overlay Implementation
```typescript
// Correct overlay syntax for Tailwind v4
className="fixed inset-0 bg-black/25 z-40 lg:hidden"

// NOT: bg-opacity-25 (deprecated)
```

### Animation Classes Available
- `animate-accordion-down`, `animate-accordion-up`
- `animate-fade-in`, `animate-slide-in`, `animate-bounce-in`

### Build Configuration
- Uses Turbopack: `next build --turbopack`
- Image optimization configured for `dev.kacc.mn` and `images.unsplash.com`

## 🚨 Common Mistakes to Avoid

1. **Using old Tailwind opacity syntax** - Always use `/` notation
2. **Forgetting 'use client'** - Required for interactive components
3. **Not using TypeScript interfaces** - All props should be typed
4. **Mixing CSS-in-JS with Tailwind** - Prefer Tailwind classes
5. **Hardcoding breakpoints** - Use Tailwind responsive prefixes

## 🔧 Development Commands

```bash
npm run dev      # Development server
npm run build    # Production build with Turbopack
npm run start    # Production server
npm run lint     # ESLint
```

## 📚 Key Libraries Usage

### Framer Motion (v12.23.12)
```typescript
import { motion } from 'framer-motion'
// Use for complex animations beyond CSS
```

### Lucide React (v0.540.0)
```typescript
import { Filter, MapPin, X } from 'lucide-react'
// Consistent icon usage throughout the app
```

### i18next
```typescript
import { useTranslation } from 'react-i18next'
// Mongolian/English internationalization
```

## 🎨 UI Library Strategy for Beautiful Design

### ✅ RECOMMENDED: shadcn/ui
- **Status:** FULLY COMPATIBLE with Tailwind v4
- **Type:** Copy-paste components (not npm package)
- **Usage:** Primary component library for consistent, accessible UI
- **Installation:** `npx shadcn@latest init`

### ⚠️ CONDITIONAL: Aceternity UI
- **Status:** PARTIALLY COMPATIBLE with Tailwind v4
- **Type:** Copy-paste components with Framer Motion
- **Limitation:** ~33% of components need PostCSS plugins (not v4 compatible)
- **Usage:** Cherry-pick SIMPLE components only (buttons, cards, basic animations)
- **Avoid:** Components requiring PostCSS plugins

### 🚨 UI LIBRARY RULES FOR CLAUDE
1. **ALWAYS prefer shadcn/ui** for standard components (buttons, inputs, cards, etc.)
2. **NEVER suggest Aceternity components** that mention PostCSS plugins
3. **USE existing Framer Motion** for custom animations instead of complex Aceternity components
4. **MAINTAIN existing design tokens** - they're professionally crafted
5. **FOLLOW Tailwind v4 syntax** - use `/` for opacity, not `bg-opacity-*`

## 🎯 Aesthetic Improvement Priority
1. **shadcn/ui** - Primary component system
2. **Custom design tokens** - Already implemented, keep using
3. **Framer Motion** - For custom animations (already installed)
4. **Simple Aceternity** - Only basic components without PostCSS dependencies

## 📁 Asset Management
When user references image/picture files by name, search in these locations:
- `/Users/mongoljansabyrjan/Downloads/`
- `/Users/mongoljansabyrjan/Desktop/`

---

**Last Updated:** When reading this guide  
**Next.js Version:** 15.5.0 (App Router)  
**Tailwind Version:** v4 (Modern syntax required)  
**UI Strategy:** shadcn/ui + selective Aceternity + custom design tokens

> Always refer to this guide when writing code for the MyRoom project to ensure consistency with the current tech stack and avoid deprecated patterns. For UI components, prioritize shadcn/ui over other libraries.

## 🎨 UI Design System Guidelines

### Design Philosophy
**Minimal & Professional**: Following modern travel platform standards (Hotels.com, Trip.com) with emphasis on clean borders over heavy shadows, consistent spacing, and readable typography.

### 🎯 Core Visual Principles

#### 1. Shadow Usage - MINIMAL APPROACH
**✅ PREFERRED (Use these exclusively):**
```css
/* No shadow - preferred for most components */
border border-gray-200

/* Subtle shadow for elevated components only */
box-shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
```

**❌ AVOID (Heavy shadows):**
```css
shadow-xl, shadow-2xl, shadow-lg (in most cases)
drop-shadow-lg, shadow-md (unless for specific UI states)
```

#### 2. Border Styling - CONSISTENT APPROACH
**✅ Standard Border Pattern:**
```css
/* Primary pattern - use for cards, containers, modals */
border border-gray-200

/* Hover states */
hover:border-gray-300

/* Interactive states */
hover:border-blue-200 (for actionable elements)
```

#### 3. Border Radius - STANDARDIZED VALUES
**✅ Consistent Usage:**
```css
rounded-lg      /* 12px - buttons, inputs, small components */
rounded-xl      /* 16px - cards, containers, modals */
rounded-2xl     /* 24px - large containers, hero sections */
rounded-full    /* Circular elements, avatars, badges */
```

**❌ AVOID:**
```css
rounded-md, rounded-sm, rounded-3xl (inconsistent with design system)
```

#### 4. Component-Specific Guidelines

##### Cards (Hotel cards, info cards, etc.)
```css
className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 overflow-hidden"
```

##### Modals & Dropdowns
```css
className="fixed bg-white rounded-xl border border-gray-200 z-[100000]"
style={{
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
}}
```

##### Buttons
```css
/* Primary buttons - no shadow */
className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-4 py-2.5 rounded-lg transition-all duration-200"

/* Secondary buttons */
className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-all duration-200"
```

##### Loading States
```css
/* Skeleton cards */
className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse"
```

### 🏗️ Layout Patterns

#### Container Spacing
```css
/* Page containers */
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

/* Section spacing */
className="py-8 sm:py-12 lg:py-16"

/* Card padding */
className="p-4 sm:p-6"
```

#### Grid Layouts
```css
/* Hotel cards grid */
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

/* Search results */
className="grid grid-cols-1 lg:grid-cols-3 gap-8"
```

### 🔧 Implementation Rules

#### 1. Component Consistency
- **FAQ Section** serves as the reference for minimal styling
- All cards should follow the same border pattern: `border border-gray-200`
- Hover states should be subtle: `hover:border-gray-300`

#### 2. Modal Positioning
```typescript
// Prevent clipping with proper boundary checks
style={{ 
  top: Math.max(8, modalPosition.top),
  left: Math.max(8, Math.min(modalPosition.left, window.innerWidth - modalWidth - 16)),
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
}}
```

#### 3. Z-Index Management
```css
/* Modal/Dropdown layers */
z-[100000]  /* Use for all portaled modals */

/* Sticky navigation */
z-40        /* Use for sticky navs */

/* Regular elevated content */
z-10        /* Use for dropdowns within containers */
```

#### 4. Animation Standards
```css
/* Standard transitions */
transition-all duration-200

/* Hover animations */
whileHover={{ scale: 1.02 }}
transition={{ duration: 0.3, ease: "easeOut" }}
```

### 📐 Design Token Reference

#### Colors
```css
/* Backgrounds */
bg-white           /* Cards, modals, containers */
bg-gray-50         /* Page backgrounds */
bg-blue-50/30      /* Section backgrounds */

/* Borders */
border-gray-200    /* Default borders */
border-gray-300    /* Hover borders */
border-blue-200    /* Interactive hover borders */

/* Text */
text-gray-900      /* Primary text */
text-gray-600      /* Secondary text */
text-gray-500      /* Muted text */
```

#### Spacing
```css
/* Component spacing */
p-4, p-6           /* Card padding */
gap-4, gap-6, gap-8 /* Grid gaps */
space-y-4, space-y-6 /* Vertical rhythm */
mb-2, mb-3, mb-4, mb-6 /* Margins */
```

### ✅ Quality Checklist

Before implementing any UI component, verify:

- [ ] Uses minimal shadows (prefer borders over shadows)
- [ ] Follows consistent border radius values (`rounded-lg`, `rounded-xl`, `rounded-2xl`)
- [ ] Uses `border border-gray-200` pattern
- [ ] Implements proper hover states
- [ ] Modals use proper positioning and z-index
- [ ] Animations are subtle and consistent
- [ ] Responsive design principles are followed
- [ ] Matches the visual pattern established by FAQ section

### 🚫 Common Mistakes to Avoid

1. **Heavy shadows**: Don't use `shadow-xl`, `shadow-2xl`, or `drop-shadow-lg`
2. **Inconsistent radius**: Don't mix `rounded-md` with `rounded-xl`
3. **Border neglect**: Don't create cards without borders
4. **Z-index chaos**: Don't use arbitrary z-index values
5. **Animation overuse**: Don't use heavy or distracting animations

**Remember**: The goal is a clean, professional, and consistent user interface that prioritizes usability and visual hierarchy over flashy effects.