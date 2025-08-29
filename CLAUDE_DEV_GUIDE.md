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

---

**Last Updated:** When reading this guide  
**Next.js Version:** 15.5.0 (App Router)  
**Tailwind Version:** v4 (Modern syntax required)  
**UI Strategy:** shadcn/ui + selective Aceternity + custom design tokens

> Always refer to this guide when writing code for the MyRoom project to ensure consistency with the current tech stack and avoid deprecated patterns. For UI components, prioritize shadcn/ui over other libraries.