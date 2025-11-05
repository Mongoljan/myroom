# Design System Audit - Quick Reference Summary

## 🎯 Top 5 Most Common Violations

### 1. Section Padding (28 instances)
**Problem:** Using `py-6` everywhere
```tsx
// ❌ Wrong
<section className="py-6">

// ✅ Correct
<section className="py-12">  // Comfortable spacing
<section className="py-8">   // Compact spacing
<section className="py-16">  // Spacious/feature sections
```

### 2. Typography Not Using Design System (47 instances)
**Problem:** Hardcoded font sizes
```tsx
// ❌ Wrong
<h2 className="text-lg font-bold text-gray-900">

// ✅ Correct (import text from design-system)
<h2 className={text.h2}>  // text-xl sm:text-2xl leading-snug font-bold tracking-tight
<p className={text.bodyMd}>
<span className={text.caption}>
```

### 3. Card Padding Inconsistency (15 instances)
**Problem:** Using `p-3`, `p-4`, or `p-6`
```tsx
// ❌ Wrong
<div className="bg-white rounded-lg p-4">

// ✅ Correct
<div className="bg-white rounded-xl p-5">  // Standard card padding
```

### 4. Border Radius Inconsistency (12 instances)
**Problem:** Using `rounded-md` or `rounded-lg` inconsistently
```tsx
// ❌ Wrong
<div className="rounded-md border">  // For buttons
<span className="rounded-md">        // For badges

// ✅ Correct
<div className="rounded-lg border">   // For standard components
<div className="rounded-xl">          // For cards
<span className="rounded-full">       // For badges
```

### 5. Arbitrary Spacing Values (18 instances)
**Problem:** Using non-standard values like `mb-0.5`, `mb-1.5`, `mb-3`, `mb-5`, `gap-2`, `gap-3`
```tsx
// ❌ Wrong
<div className="mb-3 gap-2">

// ✅ Correct - Use standard values only
<div className="mb-4 gap-4">  // md spacing
<div className="mb-6 gap-6">  // lg spacing
<div className="mb-8 gap-8">  // xl spacing
```

---

## 📋 Quick Fix Checklist

### Before Starting Work on Any Component:
- [ ] Import design system: `import { text } from '@/styles/design-system'`
- [ ] Check if component uses sections - use `py-8`, `py-12`, or `py-16`
- [ ] Check if component uses cards - use `p-5`, `rounded-xl`
- [ ] Replace all typography with `text.h1`, `text.h2`, etc.
- [ ] Use standard spacing: `mb-2/3/4/6/8`, `gap-4/6/8`
- [ ] Badges should be `rounded-full`

### Search & Replace Patterns:

```bash
# Typography fixes
text-lg font-bold → {text.h2}
text-sm font-semibold → {text.h4}
text-xs → {text.caption} or {text.bodySm}

# Spacing fixes
py-6 → py-12
p-3 → p-5
p-4 → p-5 (for cards)
p-6 → p-5 (for cards)
mb-0.5 → mb-2
mb-1.5 → mb-2
mb-3 → mb-4
mb-5 → mb-6
gap-2 → gap-4
gap-3 → gap-4
gap-5 → gap-6

# Border radius fixes
rounded-md → rounded-lg (components) or rounded-full (badges)
```

---

## 🏆 Good Examples to Follow

### ✅ ModernHero.tsx
**Why it's good:**
- Uses `text.h1`, `text.bodyMd` from design system
- Proper glassmorphism with `rounded-2xl`
- Correct button styling
- Good typography hierarchy

```tsx
<h1 className={`${text.h1} text-gray-900 mb-2`}>
  {t('hero.title')}
</h1>
<p className={`${text.bodyMd} text-gray-600`}>
  {t('hero.subtitle')}
</p>
```

### ✅ Design System Documentation Pattern
```tsx
// Always prefer this pattern:
import { text } from '@/styles/design-system';

<div className="py-12">  {/* Section */}
  <h2 className={text.h2}>Title</h2>
  <p className={text.bodyMd + " text-gray-600"}>Description</p>

  <div className="grid gap-4">  {/* Standard gap */}
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className={text.h3}>Card Title</h3>
      <p className={text.bodySm + " text-gray-600"}>Card text</p>
    </div>
  </div>
</div>
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ Don't hardcode typography
```tsx
// Bad
<h2 className="text-lg font-bold text-gray-900 mb-1">

// Good
<h2 className={text.h2 + " text-gray-900 mb-2"}>
```

### ❌ Don't use arbitrary spacing
```tsx
// Bad
<div className="py-6 mb-3 gap-5">

// Good
<div className="py-12 mb-4 gap-6">
```

### ❌ Don't mix border radius styles
```tsx
// Bad
<div className="rounded-lg">  {/* For one card */}
<div className="rounded-xl"> {/* For another card */}

// Good - Be consistent
<div className="rounded-xl">  {/* All cards */}
<div className="rounded-xl">  {/* All cards */}
```

---

## 📊 Compliance Score by Component

| Component | Score | Priority |
|-----------|-------|----------|
| SearchFilters.tsx | 35% | 🔴 HIGH |
| RecommendedHotels.tsx | 45% | 🔴 HIGH |
| WhyChooseUs.tsx | 55% | 🟡 MEDIUM |
| HotelPageContent.tsx | 60% | 🟡 MEDIUM |
| SectionHotelCard.tsx | 65% | 🟡 MEDIUM |
| PopularDestinations.tsx | 70% | 🟡 MEDIUM |
| RecentlyViewed.tsx | 70% | 🟡 MEDIUM |
| Partnerships.tsx | 75% | 🟡 MEDIUM |
| FaqSection.tsx | 80% | 🟢 LOW |
| SearchResultsHeader.tsx | 80% | 🟢 LOW |
| ModernHero.tsx | 90% | ✅ GOOD |
| ProfessionalHotelCard.tsx | 90% | ✅ GOOD |

---

## 🎨 Design System Quick Reference

### Typography Tokens
```tsx
text.displayLg  // Hero: text-4xl sm:text-5xl lg:text-6xl
text.displayMd  // Sub-hero: text-3xl sm:text-4xl lg:text-5xl
text.displaySm  // Features: text-2xl sm:text-3xl lg:text-4xl
text.h1         // Page titles: text-2xl sm:text-3xl
text.h2         // Section titles: text-xl sm:text-2xl
text.h3         // Card headers: text-lg sm:text-xl
text.h4         // Sub-headers: text-base sm:text-lg
text.bodyLg     // Prominent text: text-lg
text.bodyMd     // Standard text: text-base
text.bodySm     // Compact text: text-sm
text.caption    // Metadata: text-xs
```

### Spacing Tokens
```tsx
// Sections
py-8   // Compact
py-12  // Comfortable (default)
py-16  // Spacious
py-20  // Hero

// Components
p-2    // xs - Badges
p-3    // sm - Small buttons
p-4    // md - Standard components
p-5    // lg - Cards (default)
p-6    // xl - Feature cards

// Margins
mb-2   // xs
mb-3   // sm
mb-4   // md (default)
mb-6   // lg
mb-8   // xl

// Gaps
gap-2  // xs (avoid in most cases)
gap-3  // sm (avoid in most cases)
gap-4  // md (default)
gap-6  // lg
gap-8  // xl
```

### Border Radius
```tsx
rounded-md    // 6px - Small buttons
rounded-lg    // 8px - Standard components
rounded-xl    // 12px - Cards (default)
rounded-2xl   // 16px - Large cards, hero sections
rounded-full  // Badges, pills, avatars
```

### Colors (Text)
```tsx
text-gray-900  // Primary text (headings, important text)
text-gray-600  // Secondary text (body text)
text-gray-500  // Tertiary text (captions, metadata)
```

---

## 🔧 Implementation Steps

### Step 1: Import Design System (Every Component)
```tsx
import { text } from '@/styles/design-system';
```

### Step 2: Fix Typography (First Priority)
Replace all hardcoded font classes with design system tokens

### Step 3: Fix Spacing (Second Priority)
Standardize py, mb, gap values

### Step 4: Fix Border Radius (Third Priority)
Make cards consistent

### Step 5: Test & Validate
Check visual consistency across all pages

---

**Full Report:** See `DESIGN_SYSTEM_AUDIT_REPORT.md` for detailed line-by-line issues
