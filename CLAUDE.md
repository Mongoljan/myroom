# Claude Development Guidelines

## CRITICAL: User Instructions Override
**IMPORTANT**: Unless explicitly told by the user, do NOT make unnecessary changes, create extra components, or over-engineer solutions. Always prefer minimal changes that accomplish exactly what was requested - nothing more, nothing less.

## API Usage Rules

### CRITICAL: Never Use Localhost in API Calls
- ❌ **NEVER** use `http://localhost:3001/api/...` or similar localhost URLs
- ✅ **ALWAYS** use the proper API service methods from `/src/services/api.ts`
- ✅ Use `ApiService.getCombinedData()` instead of `fetch('/api/combined-data/')`
- ✅ The ApiService automatically handles the correct base URL (`https://dev.kacc.mn/api`)

### Available APIs for Filters

Based on `/api/combined-data/` endpoint analysis:

#### Available Data (from API):
1. **property_types** - Hotel, Apartment, GuestHouse (3 items)
2. **facilities** - Restaurant, Wi-Fi, Parking, etc. (39 items)
3. **ratings** - N/A, 1-5 stars (6 items)
4. **province** - All provinces/locations
5. **accessibility_features** - Accessibility options
6. **languages** - Available languages
7. **soum** - District/soum data

#### 10 Filter Categories Implementation:

**API Data Analysis Complete** ✅

1. **Зочид буудлын төрөл** (Property Types) - ✅ USE API `property_types`
   - Hotel, Apartment, GuestHouse (3 items)

2. **Түгээмэл хайлтууд** (Popular Searches) - STATIC DATA
   - breakfast, romantic, 5-star, spa, pool (5 items)

3. **Үнийн хязгаар** (Price Range) - STATIC DATA
   - Price ranges: 0-100K, 100K-200K, etc. up to 2M

4. **Өрөөний онцлог зүйлс** (Room Features) - ✅ USE API `facilities` filtered
   - From API facilities: "Air conditioning", "Breakfast included", "Non-smoking rooms", "Family rooms"

5. **Ерөнхий үйлчилгээ** (General Services) - ✅ USE API `facilities` filtered
   - From API facilities: "Restaurant", "Room service", "24-hour front desk", "Free Wi-Fi", "Parking", "Business center", "Fitness center", "Elevator", "Airport shuttle", "Car rental", "Currency exchange", "Luggage storage", "Wake-up call", "Taxi call"

6. **Орны төрөл** (Bed Types) - STATIC DATA
   - Single, Double, Queen, King beds

7. **Алдартай газрууд** (Popular Places) - ✅ USE API `province` or STATIC
   - Use province data from API or static popular locations

8. **Хямдралтай** (Discounted) - STATIC DATA
   - Boolean checkbox filter

9. **Зочдын үнэлгээ** (Guest Rating) - ✅ USE API `ratings`
   - From API: N/A, 1-5 stars (6 items)

10. **Гадаах талбай** (Outdoor Areas) - ✅ USE API `facilities` filtered
    - From API facilities: "Garden", "Terrace", "BBQ", "Swimming pool", "Golf course", "Water park"

### Facility Categorization from API (39 total):

**Room Features (4):**
- Air conditioning, Breakfast included, Non-smoking rooms, Family rooms

**General Services (15):**
- Restaurant, Room service, 24-hour front desk, Free Wi-Fi, Parking, Business center, Fitness center, Elevator, Airport shuttle, Car rental, Currency exchange, Luggage storage, Wake-up call, Taxi call, Conference room

**Outdoor Areas (6):**
- Garden, Terrace, BBQ, Swimming pool, Golf course, Water park

**Entertainment/Leisure (7):**
- Bar, Cafe, Karoake, Hot tub / Jacuzzi, Sauna, Spa & welness center, Smoking area

**Special Services (7):**
- Adults only, Airport Pick-up Service, Car garage, Electric vehicle charging station, Guest Laundry, Pet friendly, Wheelchair accessible

### API Service Methods to Use:
```typescript
// Use these instead of direct fetch calls:
ApiService.getCombinedData() // Main filter data
ApiService.getAllData()      // Additional room/facility data
ApiService.getFeatures()     // Room features
```

## Common Mistakes to Avoid:
1. Don't use localhost URLs in API calls
2. Don't create duplicate API interfaces - use existing ones from ApiService
3. Always check ApiService first before creating new API calls
4. Use proper error handling for API calls

## Loading Animation Libraries Research (2025)

### Research Requirement
When implementing new UI libraries, components, or frameworks, find and document at least 3 reliable sources with implementation details, performance considerations, and best practices.

### 1. Aceternity UI Components
**Sources:**
- [Aceternity UI Official Documentation](https://ui.aceternity.com/)
- [Aceternity UI GitHub Repository](https://github.com/aceternity/ui)
- [Aceternity UI Component Examples](https://ui.aceternity.com/components)

**Key Features:**
- Modern React components with Framer Motion animations
- Tailwind CSS integration for styling
- TypeScript support with proper type definitions
- Performance-optimized animations with GPU acceleration
- Customizable sizing (sm, md, lg) and styling props

**Implementation Patterns:**
```typescript
// Basic Aceternity loader with motion animations
export function LoaderOne() {
  return (
    <motion.div
      className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
```

**Performance Notes:**
- Uses transform properties for smooth 60fps animations
- Optimized for mobile devices with reduced motion support
- Memory efficient with proper cleanup on component unmount

### 2. Magic UI Loading Components
**Sources:**
- [Magic UI Official Site](https://magicui.design/)
- [Magic UI Loading Components](https://magicui.design/docs/components/loading)
- [Magic UI GitHub Examples](https://github.com/magicuidesign/magicui)

**Key Features:**
- Shimmer effects and gradient animations
- Button loading states with integrated spinners
- Text loading with animated dots
- Customizable colors and timing
- Accessibility compliant with ARIA labels

**Implementation Patterns:**
```typescript
// Magic UI inspired spinner with gradient
export function MagicSpinner({ size = 'md' }: MagicSpinnerProps) {
  return (
    <motion.div
      className="border-2 border-muted border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
```

**UX Benefits:**
- Reduces perceived loading time with engaging animations
- Provides clear visual feedback during async operations
- Maintains brand consistency with customizable styling

### 3. React Loading Ecosystem (2025 Standards)
**Sources:**
- [React Loading Skeleton v3.4+](https://github.com/dvtng/react-loading-skeleton)
- [Lottie React Animations](https://airbnb.design/lottie/)
- [Framer Motion v11 Performance Guide](https://www.framer.com/motion/)

**Modern Loading Patterns:**
1. **Skeleton Loading** - Preferred for content that has predictable layout
2. **Spinner Animations** - Best for indeterminate progress
3. **Progressive Loading** - Show partial content while loading rest
4. **Micro-interactions** - Small animations that provide immediate feedback

**Best Practices for 2025:**
- Use `transform` and `opacity` for animations (GPU accelerated)
- Implement `prefers-reduced-motion` media query support
- Lazy load animation libraries to reduce bundle size
- Use React.Suspense with proper fallback components
- Implement proper error boundaries for failed loading states

**Performance Considerations:**
```typescript
// Optimized loading component with reduced motion support
const LoadingComponent = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
      transition={{ duration: prefersReducedMotion ? 0 : 1.5 }}
    >
      {children}
    </motion.div>
  );
};
```

### Implementation Guidelines
1. **Choose the Right Pattern:**
   - Skeleton loading for predictable content layouts
   - Spinners for unknown duration operations
   - Progress bars for measurable operations

2. **Accessibility:**
   - Include proper ARIA labels and live regions
   - Support reduced motion preferences
   - Provide meaningful loading text for screen readers

3. **Performance:**
   - Lazy load animation libraries
   - Use CSS transforms over changing layout properties
   - Implement proper cleanup to prevent memory leaks

### Current Project Implementation
- **ModernHero**: Uses HotelSearchSpinner for search operations
- **Button States**: Implements ButtonLoading for form submissions
- **Search Results**: Uses LoadingSkeleton for result placeholders
- **Hotel Cards**: Uses MagicSpinner for data loading states

## Known Issues

### React Server Components Bug
**Issue**: Occasional React Server Components bundler error:
```
Could not find the module "/Users/mongoljansabyrjan/myroom/node_modules/next/dist/lib/framework/boundary-components.js#MetadataBoundary" in the React Client Manifest.
```

**Status**: This appears to be a Next.js 15.5.0 + Turbopack bug, not related to our code changes. The build still succeeds and the application functions correctly.